import tempfile
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path

import news_agent as na

RSS = b"""<?xml version="1.0"?>
<rss version="2.0"><channel><title>Test</title>
  <item>
    <title>Markets rally on rate news</title>
    <link>https://example.com/markets</link>
    <description><![CDATA[<p>Stocks <b>rose</b> sharply.</p>]]></description>
    <pubDate>Mon, 12 Oct 2026 09:00:00 GMT</pubDate>
  </item>
  <item>
    <title>Local bakery wins award</title>
    <link>https://example.com/bakery</link>
    <description>Sponsored content</description>
    <pubDate>Sun, 01 Jan 2023 00:00:00 GMT</pubDate>
  </item>
</channel></rss>"""

ATOM = b"""<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Atom test</title>
  <entry>
    <title>New Python release</title>
    <link rel="alternate" href="https://example.com/python"/>
    <summary>Python 3.99 is out.</summary>
    <published>2026-10-13T06:00:00Z</published>
  </entry>
</feed>"""


class ParseTests(unittest.TestCase):
    def test_rss_items_are_parsed_and_html_stripped(self):
        items = na.parse_feed(RSS, "Test")
        self.assertEqual(len(items), 2)
        self.assertEqual(items[0].title, "Markets rally on rate news")
        self.assertEqual(items[0].link, "https://example.com/markets")
        self.assertEqual(items[0].summary, "Stocks rose sharply.")
        self.assertEqual(items[0].published, datetime(2026, 10, 12, 9, tzinfo=timezone.utc))

    def test_atom_items_are_parsed(self):
        items = na.parse_feed(ATOM, "Atom")
        self.assertEqual(len(items), 1)
        self.assertEqual(items[0].link, "https://example.com/python")
        self.assertEqual(items[0].summary, "Python 3.99 is out.")
        self.assertEqual(items[0].published.hour, 6)

    def test_unknown_format_raises(self):
        with self.assertRaises(ValueError):
            na.parse_feed(b"<html><body>hi</body></html>", "x")

    def test_missing_date_gives_none(self):
        items = na.parse_feed(
            b"<rss><channel><item><title>T</title><link>l</link></item></channel></rss>", "s"
        )
        self.assertIsNone(items[0].published)


class FilterTests(unittest.TestCase):
    def setUp(self):
        self.now = datetime(2026, 10, 13, tzinfo=timezone.utc)
        self.items = na.parse_feed(RSS, "Test") + na.parse_feed(ATOM, "Atom")

    def test_exclude_keyword_drops_item(self):
        kept = na.filter_items(self.items, [], ["sponsored"], None, self.now)
        titles = [i.title for i in kept]
        self.assertNotIn("Local bakery wins award", titles)

    def test_include_keyword_is_required_when_set(self):
        kept = na.filter_items(self.items, ["python"], [], None, self.now)
        self.assertEqual([i.title for i in kept], ["New Python release"])

    def test_include_is_case_insensitive(self):
        kept = na.filter_items(self.items, ["MARKETS"], [], None, self.now)
        self.assertEqual(len(kept), 1)

    def test_max_age_drops_old_items_but_keeps_undated(self):
        undated = na.Item("s", "No date", "u", "", None)
        kept = na.filter_items(
            self.items + [undated], [], [], timedelta(hours=48), self.now
        )
        titles = [i.title for i in kept]
        self.assertNotIn("Local bakery wins award", titles)  # from 2023
        self.assertIn("No date", titles)


class SeenStoreTests(unittest.TestCase):
    def test_items_are_only_new_once(self):
        with tempfile.TemporaryDirectory() as d:
            store = na.SeenStore(Path(d) / "seen.sqlite3")
            items = na.parse_feed(RSS, "Test")
            self.assertEqual(len(store.unseen(items)), 2)
            store.mark(items[:1])
            self.assertEqual([i.title for i in store.unseen(items)],
                             ["Local bakery wins award"])
            store.close()


class DigestTests(unittest.TestCase):
    def test_digest_lists_items_and_handles_empty(self):
        now = datetime(2026, 10, 13, 8, 0, tzinfo=timezone.utc)
        items = na.parse_feed(ATOM, "Atom")
        text = na.render_digest({"Atom": items}, now)
        self.assertIn("## Atom", text)
        self.assertIn("[New Python release](https://example.com/python)", text)
        empty = na.render_digest({"Atom": []}, now)
        self.assertIn("Nothing new matched your filters.", empty)


if __name__ == "__main__":
    unittest.main()
