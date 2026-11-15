# Security

## Reporting a problem

Please don't open a public issue for a security problem. Use GitHub's private
[security advisory form](https://github.com/RogerHagman/Hermes-Starship/security/advisories/new) for this repository, or email the
address in [`__version__.py`](__version__.py). I'll answer as soon as I can. This is a
personal project, so there's no formal response time.

## What the ship is built to promise

- **The boards only read.** nginx answers GET and HEAD only. The one exception is
  `POST /desk/action`, which reaches the optional Yeoman's desk.
- **The probes only read Hermes.** Every Hermes mount is read-only. Each probe drops all
  capabilities (some keep `DAC_READ_SEARCH`, which lets them read without changing anything),
  runs with `no-new-privileges` and a small memory cap, and has no network unless it needs one.
  They write only to `deploy/live/` and `deploy/scratch/`.
- **No board calls a model.** The rails probe makes one Ollama call (`GET /api/ps`) and asks
  each cloud rail for its usage numbers, at most every five minutes.
- **Secrets stay out of git.** `deploy/.env`, `deploy/starship.htpasswd`, `deploy/live/` and
  `deploy/scratch/` are git-ignored. The holo probe's GitHub sign-in should be fine-grained,
  read-only, and limited to one repository.
- **The boards are for your LAN.** Put them behind a VPN or a reverse proxy with TLS before
  exposing them anywhere else. Basic auth over plain HTTP is not enough on the open internet.
