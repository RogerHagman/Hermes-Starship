#!/usr/bin/env python3
"""A speed trial on the local rail: time to first token and tokens a second.

Run by hand (it is a run, not a probe): it sends the same short prompt to Ollama a few times and
times each answer. Time to first token is measured here, from sending the request to the first
piece of the answer (thinking counts). Tokens a second come from Ollama's own count and time for
the answer (eval_count / eval_duration), and the prompt's from prompt_eval_count / duration.
The trial is added to speed-trials.json (the newest 30 are kept), which the meter probe puts on
the Science lab's board.

It uses the model that is already loaded, so Number One's model is never pushed out of VRAM; if
none is loaded it uses MODEL. It costs a few seconds of GPU time and nothing else. Nothing else
is called and nothing leaves the network.

Settings come from the environment: OLLAMA_URL, MODEL (when nothing is loaded), REPEATS (3),
TOKENS (most output tokens per answer, 128) and TRIALS (the file it adds to). Standard library only.
"""
import json
import os
import statistics
import sys
import tempfile
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib.request import Request, urlopen

UTC = timezone.utc
KEEP = 30
PROMPT = "In three short sentences, explain what a starship's warp core does."


def log(message):
    print(message, file=sys.stderr, flush=True)


def call(url, path, body=None, timeout=300):
    data = None if body is None else json.dumps(body).encode()
    request = Request(url.rstrip("/") + path, data=data, method="GET" if body is None else "POST",
                      headers={"Content-Type": "application/json"})
    return urlopen(request, timeout=timeout)


def loaded_model(url):
    """The model Ollama has loaded now, or None."""
    with call(url, "/api/ps", timeout=5) as response:
        models = json.load(response).get("models") or []
    return models[0].get("name") or models[0].get("model") if models else None


def one_answer(url, model, tokens, clock=time.monotonic):
    """{ttftMs, tokensPerSec, promptTokensPerSec, loadMs, promptTokens, outputTokens} for one answer."""
    body = {"model": model, "prompt": PROMPT, "stream": True, "options": {"temperature": 0, "num_predict": tokens}}
    start = clock()
    first = None
    final = None
    with call(url, "/api/generate", body) as response:
        for line in response:
            if not line.strip():
                continue
            part = json.loads(line)
            if part.get("error"):
                raise RuntimeError(part["error"])
            if first is None and (part.get("response") or part.get("thinking")):
                first = clock()
            if part.get("done"):
                final = part
                break
    if first is None or final is None:
        raise RuntimeError("the answer was empty")
    ns = 1e9
    out = {"ttftMs": round((first - start) * 1000, 1), "loadMs": round(final.get("load_duration", 0) / 1e6, 1),
           "promptTokens": int(final.get("prompt_eval_count") or 0), "outputTokens": int(final.get("eval_count") or 0)}
    if final.get("eval_duration"):
        out["tokensPerSec"] = round(out["outputTokens"] / (final["eval_duration"] / ns), 1)
    if final.get("prompt_eval_duration") and out["promptTokens"]:
        out["promptTokensPerSec"] = round(out["promptTokens"] / (final["prompt_eval_duration"] / ns), 1)
    return out


def trial(url, model, repeats, tokens, now=None, answer=one_answer):
    """One trial: the median of the repeats. A failure is recorded too, with its reason."""
    now = now or datetime.now(UTC)
    entry = {"at": now.strftime("%Y-%m-%dT%H:%M:%SZ"),
             "engine": "ollama", "model": model or "none loaded", "repeats": repeats, "ok": False}
    if not model:
        entry["note"] = "No model is loaded and MODEL is not set."
        return entry
    answers = []
    try:
        for _ in range(repeats):
            answers.append(answer(url, model, tokens))
    except Exception as error:   # a trial that fails is still a run worth keeping
        entry["note"] = f"Failed after {len(answers)} of {repeats}: {str(error)[:200]}"
        return entry
    med = lambda k: round(statistics.median(a[k] for a in answers if k in a), 1)   # noqa: E731
    entry.update(ok=True, ttftMs=med("ttftMs"), ttftMsMax=max(a["ttftMs"] for a in answers),
                 loadMs=answers[0]["loadMs"], promptTokens=answers[0]["promptTokens"],
                 outputTokens=int(statistics.median(a["outputTokens"] for a in answers)))
    for k in ("tokensPerSec", "promptTokensPerSec"):
        if any(k in a for a in answers):
            entry[k] = med(k)
    if entry["loadMs"] > 1000:
        entry["note"] = "The model had to load first; the first answer's time to first token includes it."
    return entry


def number(trial_id):
    try:
        return int(str(trial_id).split("-", 1)[1])
    except (IndexError, ValueError):
        return 0


def add(path, entry):
    """Give the trial the next SPD- number and add it to the history. Returns the entry."""
    path = Path(path)
    try:
        trials = json.loads(path.read_text(encoding="utf-8")).get("trials", [])
    except (OSError, ValueError, AttributeError):
        trials = []
    entry = {"id": f"SPD-{max([number(t.get('id')) for t in trials] + [0]) + 1}", **entry}
    trials = trials + [entry]
    trials = sorted(trials, key=lambda t: t.get("at", ""))[-KEEP:]
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, temp = tempfile.mkstemp(dir=path.parent, prefix=".trials.", suffix=".tmp")
    with os.fdopen(fd, "w", encoding="utf-8") as handle:
        json.dump({"trials": trials}, handle, indent=2)
        handle.write("\n")
    os.chmod(temp, 0o644)
    os.replace(temp, path)
    return entry


def main():
    env = os.environ
    url = env.get("OLLAMA_URL")
    if not url:
        log("OLLAMA_URL is not set")
        return 2
    try:
        model = loaded_model(url) or env.get("MODEL") or None
    except OSError as error:
        log(f"Ollama didn't answer: {error}")
        model = None
    entry = trial(url, model, max(1, int(env.get("REPEATS", "3"))), max(16, int(env.get("TOKENS", "128"))))
    entry = add(env.get("TRIALS", "/trials/speed-trials.json"), entry)
    if entry["ok"]:
        log(f"{entry['id']} {entry['model']}: first token {entry['ttftMs']:.0f} ms, "
            f"{entry.get('tokensPerSec', 0)} tokens a second ({entry['repeats']} answers)")
    else:
        log(f"{entry['id']} failed: {entry.get('note')}")
    return 0 if entry["ok"] else 1


if __name__ == "__main__":
    sys.exit(main())
