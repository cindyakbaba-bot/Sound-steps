# News agent

A small agent that reads news feeds (RSS or Atom), filters them by keyword and age,
skips anything you've already seen, and writes a Markdown digest.

It uses only the Python standard library (3.9+), so there is nothing to install.

## Usage

```bash
cd news-agent
python3 news_agent.py                 # fetch, filter, save digests/digest-<time>.md
python3 news_agent.py --dry-run       # print the digest, record nothing
python3 news_agent.py --include-seen  # ignore history and show everything in range
python3 -m unittest -v test_news_agent
```

## Configuration

Edit `sources.json`:

- `sources`: a list of `{ "name", "url" }` entries. Any RSS 2.0 or Atom feed works.
- `filters.include`: if non-empty, an item must mention at least one of these words.
- `filters.exclude`: drop items that mention any of these words.
- `filters.max_age_hours`: drop items older than this. Undated items are kept.
- `max_items_per_source`: cap per feed per run.

Matching is case-insensitive and checks the title and summary.

## How it works

1. **Fetch**: each source is downloaded. A failing source is logged and skipped, and the run continues.
2. **Parse**: RSS and Atom are normalised into one `Item` shape, and HTML in summaries is stripped.
3. **Filter**: keyword and age rules from `sources.json`.
4. **Dedupe**: links are recorded in `state/seen.sqlite3`, so each story appears once.
5. **Digest**: grouped by source and written to `digests/`.

## Scheduling

Run it on a schedule with cron, for example every morning at 07:00:

```cron
0 7 * * * cd /path/to/Sound-steps/news-agent && /usr/bin/python3 news_agent.py
```

## Ideas for next steps

- Add an LLM summarisation step (for example, the Claude API) that writes a short
  summary per story instead of the feed's own snippet.
- Deliver the digest by email or to a chat channel instead of a file.
- Add more sources, such as sites without feeds, which need a scraper per site.
