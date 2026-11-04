"""The landing page keeps the one rule: moving around never calls a model.

It may only load its own files and the fixtures. No external hosts, no model
endpoints, no write requests.
"""
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WEB = ROOT / "frontend"
TEXT = [p for p in WEB.rglob("*") if p.suffix in {".html", ".css", ".js"} and "tools" not in p.parts]


class OneRule(unittest.TestCase):
    def test_there_is_a_page(self):
        self.assertTrue((WEB / "index.html").exists())
        self.assertGreater(len(TEXT), 2)

    def test_no_external_hosts(self):
        # Only the SVG and XHTML namespace URIs may appear; they are names, not requests.
        allowed = {"http://www.w3.org/2000/svg", "http://www.w3.org/1999/xlink", "http://www.w3.org/1999/xhtml"}
        for path in TEXT:
            for url in re.findall(r"https?://[^\s\"')]+", path.read_text(encoding="utf-8")):
                with self.subTest(file=path.name, url=url):
                    self.assertIn(url, allowed)

    def test_fetches_only_local_files(self):
        for path in WEB.rglob("*.js"):
            for target in re.findall(r"fetch\(\s*([^),]+)", path.read_text(encoding="utf-8")):
                with self.subTest(file=path.name, target=target):
                    self.assertRegex(target.strip(), r"^(['\"`](fixtures|assets)/|url\b|path\b)")

    def test_no_writes_or_model_calls(self):
        banned = [r"method\s*:\s*['\"](POST|PUT|PATCH|DELETE)", r"XMLHttpRequest", r"WebSocket",
                  r"EventSource", r"/v1/(chat|messages|completions|responses)", r"/api/(generate|chat|embed)", r":11434"]
        for path in WEB.rglob("*.js"):
            text = path.read_text(encoding="utf-8")
            for pattern in banned:
                with self.subTest(file=path.name, pattern=pattern):
                    self.assertIsNone(re.search(pattern, text, re.I))

    def test_files_the_page_names_exist(self):
        html = (WEB / "index.html").read_text(encoding="utf-8")
        for ref in re.findall(r"(?:src|href)=\"([^\"#:]+)\"", html):
            with self.subTest(ref=ref):
                self.assertTrue((WEB / ref).exists(), ref)


if __name__ == "__main__":
    unittest.main()
