"""News agent: fetch RSS/Atom feeds, filter by keyword, skip what you've already seen,
and write a Markdown digest.

Standard library only. Usage:

    python news_agent.py                 # run with sources.json, write a digest
    python news_agent.py --include-seen  # ignore the "already seen" history
    python news_agent.py --dry-run       # print the digest, don't record anything
"""

from __future__ import annotations

import argparse
import hashlib
import json
import logging
import re
import sqlite3
import sys
import time
import urllib.request
import xml.etree.ElementTree as ET
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime
from html.parser import HTMLParser
from pathlib import Path
from typing import Iterable

HERE = Path(__file__).resolve().parent
DEFAULT_CONFIG = HERE / "sources.json"
DEFAULT_DB = HERE / "state" / "seen.sqlite3"
DEFAULT_OUT = HERE / "digests"

USER_AGENT = "news-agent/0.1 (+personal RSS reader)"
log = logging.getLogger("news_agent")


@dataclass
class Item:
    source: str
    title: str
    link: str
    summary: str
    published: datetime | None

    @property
    def key(self) -> str:
        # Prefer the link; fall back to the title so link-less items still dedupe.
        basis = self.link or self.title
        return hashlib.sha256(basis.strip().lower().encode("utf-8")).hexdigest()


# ---------------------------------------------------------------- parsing

class _TextStripper(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.parts: list[str] = []

    def handle_data(self, data: str) -> None:
        self.parts.append(data)


def strip_html(text: str | None) -> str:
    if not text:
        return ""
    parser = _TextStripper()
    parser.feed(text)
    parser.close()
    return re.sub(r"\s+", " ", " ".join(parser.parts)).strip()


def _parse_date(value: str | None) -> datetime | None:
    if not value or not value.strip():
        return None
    value = value.strip()
    try:
        dt = parsedate_to_datetime(value)  # RSS: RFC 822 dates
    except (TypeError, ValueError):
        try:
            dt = datetime.fromisoformat(value.replace("Z", "+00:00"))  # Atom: ISO 8601
        except ValueError:
            return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


def _local(tag: str) -> str:
    """Strip an XML namespace: '{http://...}title' -> 'title'."""
    return tag.rsplit("}", 1)[-1]


def _child_text(elem: ET.Element, *names: str) -> str | None:
    for child in elem:
        if _local(child.tag) in names:
            return (child.text or "").strip() or None
    return None


def _atom_link(elem: ET.Element) -> str:
    fallback = ""
    for child in elem:
        if _local(child.tag) != "link":
            continue
        href = child.get("href", "")
        if child.get("rel", "alternate") == "alternate":
            return href
        fallback = fallback or href
    return fallback


def parse_feed(data: bytes, source: str) -> list[Item]:
    """Parse an RSS 2.0 or Atom document into Items. Raises ET.ParseError on bad XML."""
    root = ET.fromstring(data)
    kind = _local(root.tag)
    items: list[Item] = []

    if kind == "rss" or kind == "RDF":
        entries = [e for e in root.iter() if _local(e.tag) == "item"]
        for e in entries:
            items.append(Item(
                source=source,
                title=strip_html(_child_text(e, "title")),
                link=(_child_text(e, "link") or "").strip(),
                summary=strip_html(_child_text(e, "description", "summary", "encoded")),
                published=_parse_date(_child_text(e, "pubDate", "date", "published")),
            ))
    elif kind == "feed":
        for e in root:
            if _local(e.tag) != "entry":
                continue
            items.append(Item(
                source=source,
                title=strip_html(_child_text(e, "title")),
                link=_atom_link(e),
                summary=strip_html(_child_text(e, "summary", "content")),
                published=_parse_date(_child_text(e, "published", "updated")),
            ))
    else:
        raise ValueError(f"unrecognised feed format: <{kind}>")

    return [i for i in items if i.title]


# ---------------------------------------------------------------- fetching

def fetch(url: str, timeout: float = 20.0) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.read()


# ---------------------------------------------------------------- filtering

def filter_items(
    items: Iterable[Item],
    include: list[str],
    exclude: list[str],
    max_age: timedelta | None,
    now: datetime | None = None,
) -> list[Item]:
    now = now or datetime.now(timezone.utc)
    inc = [k.lower() for k in include]
    exc = [k.lower() for k in exclude]
    kept = []
    for item in items:
        if max_age and item.published and now - item.published > max_age:
            continue
        haystack = f"{item.title} {item.summary}".lower()
        if inc and not any(k in haystack for k in inc):
            continue
        if any(k in haystack for k in exc):
            continue
        kept.append(item)
    return kept


# ---------------------------------------------------------------- state

class SeenStore:
    """Remembers which item links have already appeared in a digest."""

    def __init__(self, path: Path) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        self.conn = sqlite3.connect(path)
        self.conn.execute(
            "CREATE TABLE IF NOT EXISTS seen (key TEXT PRIMARY KEY, title TEXT, first_seen TEXT)"
        )

    def unseen(self, items: list[Item]) -> list[Item]:
        if not items:
            return []
        keys = [i.key for i in items]
        placeholders = ",".join("?" * len(keys))
        rows = self.conn.execute(
            f"SELECT key FROM seen WHERE key IN ({placeholders})", keys
        ).fetchall()
        known = {r[0] for r in rows}
        return [i for i in items if i.key not in known]

    def mark(self, items: list[Item]) -> None:
        now = datetime.now(timezone.utc).isoformat()
        self.conn.executemany(
            "INSERT OR IGNORE INTO seen (key, title, first_seen) VALUES (?, ?, ?)",
            [(i.key, i.title, now) for i in items],
        )
        self.conn.commit()

    def close(self) -> None:
        self.conn.close()


# ---------------------------------------------------------------- output

def render_digest(items_by_source: dict[str, list[Item]], generated: datetime) -> str:
    total = sum(len(v) for v in items_by_source.values())
    lines = [
        f"# News digest - {generated:%Y-%m-%d %H:%M} UTC",
        "",
        f"{total} new item(s) from {len(items_by_source)} source(s).",
        "",
    ]
    for source, items in items_by_source.items():
        if not items:
            continue
        lines += [f"## {source}", ""]
        for item in items:
            when = f" ({item.published:%Y-%m-%d})" if item.published else ""
            lines.append(f"- [{item.title}]({item.link}){when}")
            if item.summary:
                snippet = item.summary[:280] + ("..." if len(item.summary) > 280 else "")
                lines.append(f"  {snippet}")
        lines.append("")
    if total == 0:
        lines.append("Nothing new matched your filters.")
    return "\n".join(lines) + "\n"


# ---------------------------------------------------------------- orchestration

def load_config(path: Path) -> dict:
    with path.open(encoding="utf-8") as f:
        config = json.load(f)
    if not config.get("sources"):
        raise ValueError(f"{path} has no sources")
    return config


def collect(config: dict, delay: float = 1.0) -> dict[str, list[Item]]:
    """Fetch every source. A failing source is logged and skipped, never fatal."""
    results: dict[str, list[Item]] = {}
    per_source = int(config.get("max_items_per_source", 30))
    for i, src in enumerate(config["sources"]):
        if i:
            time.sleep(delay)
        name, url = src["name"], src["url"]
        try:
            items = parse_feed(fetch(url), name)
        except Exception as exc:  # network, HTTP, or XML errors all end up here
            log.warning("skipping %s: %s", name, exc)
            continue
        results[name] = items[:per_source]
        log.info("%s: %d item(s)", name, len(items))
    return results


def run(
    config_path: Path,
    db_path: Path,
    out_dir: Path,
    include_seen: bool = False,
    dry_run: bool = False,
) -> tuple[Path | None, str]:
    config = load_config(config_path)
    filters = config.get("filters", {})
    max_age_hours = filters.get("max_age_hours")
    max_age = timedelta(hours=max_age_hours) if max_age_hours else None

    raw = collect(config)
    store = SeenStore(db_path)
    try:
        by_source: dict[str, list[Item]] = {}
        for source, items in raw.items():
            kept = filter_items(
                items,
                include=filters.get("include", []),
                exclude=filters.get("exclude", []),
                max_age=max_age,
            )
            if not include_seen:
                kept = store.unseen(kept)
            by_source[source] = kept

        digest = render_digest(by_source, datetime.now(timezone.utc))
        if dry_run:
            return None, digest

        out_dir.mkdir(parents=True, exist_ok=True)
        out_path = out_dir / f"digest-{datetime.now(timezone.utc):%Y-%m-%d-%H%M}.md"
        out_path.write_text(digest, encoding="utf-8")

        if not include_seen:
            store.mark([i for items in by_source.values() for i in items])
        return out_path, digest
    finally:
        store.close()


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Scrape news feeds into a digest.")
    parser.add_argument("--config", type=Path, default=DEFAULT_CONFIG)
    parser.add_argument("--db", type=Path, default=DEFAULT_DB)
    parser.add_argument("--out", type=Path, default=DEFAULT_OUT)
    parser.add_argument("--include-seen", action="store_true",
                        help="include items already in earlier digests")
    parser.add_argument("--dry-run", action="store_true",
                        help="print the digest without saving or recording it")
    parser.add_argument("-v", "--verbose", action="store_true")
    args = parser.parse_args(argv)

    logging.basicConfig(
        level=logging.INFO if args.verbose else logging.WARNING,
        format="%(levelname)s %(message)s",
    )
    out_path, digest = run(
        args.config, args.db, args.out,
        include_seen=args.include_seen, dry_run=args.dry_run,
    )
    print(digest)
    if out_path:
        print(f"Saved to {out_path}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
