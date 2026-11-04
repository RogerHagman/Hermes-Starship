"""Serve the landing page on fixtures, for local review. Python standard library only.

    python3 frontend/serve.py            # http://localhost:8650
    python3 frontend/serve.py --port 9000

/ serves frontend/, and /fixtures/ serves the repo's fixtures/ folder,
the same layout the NAS container uses. Nothing here writes anything.
"""
import argparse
import functools
import http.server
from pathlib import Path

WEB = Path(__file__).resolve().parent
FIXTURES = WEB.parent / "fixtures"


class Handler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        clean = path.split("?", 1)[0].split("#", 1)[0]
        if clean.startswith("/fixtures/"):
            target = (FIXTURES / clean[len("/fixtures/"):]).resolve()
            if FIXTURES in target.parents:
                return str(target)
            return str(FIXTURES / "missing")
        return super().translate_path(path)

    def do_POST(self):  # read-only: refuse every write
        self.send_error(405)

    do_PUT = do_PATCH = do_DELETE = do_POST


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=8650)
    parser.add_argument("--bind", default="127.0.0.1")
    args = parser.parse_args()
    handler = functools.partial(Handler, directory=str(WEB))
    with http.server.ThreadingHTTPServer((args.bind, args.port), handler) as httpd:
        print(f"Hermes Starship on http://{args.bind}:{args.port} (fixtures only)")
        httpd.serve_forever()


if __name__ == "__main__":
    main()
