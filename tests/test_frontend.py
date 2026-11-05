"""The Bridge keeps the one rule: moving around never calls a model.

The source may only load its own files, the fixtures and live/ (the rails probe's file). No external hosts,
no model endpoints, no write requests. The built page must be committed and current.
"""
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WEB = ROOT / "frontend"
SRC = WEB / "src"
CODE = [p for p in SRC.rglob("*") if p.suffix in {".ts", ".tsx", ".css"}] + [WEB / "index.html"]


class OneRule(unittest.TestCase):
    def test_there_is_a_page(self):
        self.assertTrue((WEB / "index.html").exists())
        self.assertTrue((SRC / "App.tsx").exists())

    def test_no_external_hosts(self):
        # Only the SVG namespace URI may appear; it is a name, not a request.
        allowed = {"http://www.w3.org/2000/svg", "http://www.w3.org/1999/xlink", "http://www.w3.org/1999/xhtml"}
        for path in CODE:
            for url in re.findall(r"https?://[^\s\"'`)]+", path.read_text(encoding="utf-8")):
                with self.subTest(file=path.name, url=url):
                    self.assertIn(url, allowed)

    def test_fetches_only_fixtures_and_live(self):
        for path in CODE:
            for target in re.findall(r"fetch\(\s*([^),]+)", path.read_text(encoding="utf-8")):
                with self.subTest(file=path.name, target=target):
                    self.assertRegex(target.strip(), r"^['\"`](fixtures|live)/")

    def test_no_writes_or_model_calls(self):
        banned = [r"method\s*:\s*['\"](POST|PUT|PATCH|DELETE)", r"XMLHttpRequest", r"WebSocket",
                  r"EventSource", r"/v1/(chat|messages|completions|responses)", r"/api/(generate|chat|embed)", r":11434"]
        for path in CODE:
            text = path.read_text(encoding="utf-8")
            for pattern in banned:
                with self.subTest(file=path.name, pattern=pattern):
                    self.assertIsNone(re.search(pattern, text, re.I))

    def test_built_page_is_committed(self):
        dist = WEB / "dist"
        self.assertTrue((dist / "index.html").exists(), "run: cd frontend && npm run build")
        html = (dist / "index.html").read_text(encoding="utf-8")
        for ref in re.findall(r"(?:src|href)=\"/?([^\"#:]+)\"", html):
            with self.subTest(ref=ref):
                self.assertTrue((dist / ref).exists(), ref)


if __name__ == "__main__":
    unittest.main()
