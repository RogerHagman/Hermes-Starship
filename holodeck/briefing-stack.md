# Briefing Room · Topic: the ship's interface stack

**Where:** a Hermes group chat. This is the Briefing Room's first trial run.
**Chair:** Number One, which opens the session with this topic name and files the minutes.
**Attending:** the Captain, the Chief Engineer (Codex), and Stellar Cartography (Claude), standing in for the Holodeck Officer, which isn't hired yet.
**Purpose:** a discussion, not a decision. Nothing is set in stone. The Captain decides afterwards.

## How the session runs

1. **Round 1:** the Captain posts the brief below. Each station answers in turn and doesn't comment on the other's answer yet. Codex answers first, then Claude.
2. **Round 2:** Number One asks each station: "Where do you agree with the other, where do you disagree, and what would change your mind?"
3. **Close:** Number One writes the minutes at the bottom (options still standing, open questions, the Captain's leaning) and files them under this topic.
4. **After:** the Ship's Computer reads the filed minutes and writes them to Hindsight. The Computer is not in the room, because memory never crosses to a cloud rail (rule 0).

---

## Brief (the Captain posts this in the group chat)

You're attending a design discussion for a home-lab project. Answer as yourself, frankly, in under 400 words. It's fine to disagree with the options listed.

**The project.** Hermes is a personal multi-agent setup themed as a starship. Each agent is a "station" and runs on one of three rails: a local qwen 27B on Ollama (one RTX 3090), Codex, and Claude. We're building the ship's own web interface. It has about 18 "boards" (a deck plan of stations, a network map, an approvals inbox, a strategist console, a viewscreen and so on), designed so far as static HTML/CSS mockups with inline styles and a set of design tokens: colours, three Google fonts, spacing and radii.

**Constraints.**
- It's reached from Hermes's own built-in dashboard, as a custom link in that dashboard's navigation. It stays on the home LAN only, behind a login. It's hosted on the NAS, which has 8 GB of RAM in total, shared with many other services. RAM matters, but there's no fixed budget yet.
- **Navigation never calls a model.** Opening boards, filters, tabs and status read local files through a read API and must feel instant. Only order buttons and free text reach a model.
- The data is local files: CSV logs, JSON/YAML state and run records. Hermes itself is Python.
- Live updates are wanted later (status changes, new items awaiting approval).
- Work split: front-end code is written by an agent on the Claude rail, and the backend and data layer by an agent on the Codex rail. They review each other's PRs.
- **The owner reads Python well and JavaScript only at an elementary level.** He wants to be able to review code quality himself.
- Roadmap: first a static UI on synthetic data, then read-only live boards, then boards that act (approve, hand over the conn) through the backend only.

**Options on the table (not exhaustive):**
- A. React + TypeScript + Vite, with a small Python read API
- B. FastAPI + Jinja templates + HTMX (and a little Alpine.js), server-rendered
- C. A Python UI framework: Streamlit, NiceGUI or Reflex
- D. Plain HTML/CSS/JS on a Python API

**Questions:**
1. Which option would you pick for this owner and this roadmap, and why?
2. What's the strongest case against your pick?
3. Which option would you rule out, and why?
4. How well can you, specifically, write and maintain code in your pick?
5. Anything about the work split (front end on one rail, back end on the other) that your pick makes easier or harder?
6. Should it be a separate app that the Hermes dashboard links to, or should it live inside that dashboard? How does each option affect login and the stack choice?
7. Roughly how much RAM would your pick use at runtime on the NAS?

---

## Minutes

*(the Captain fills in after round 2.)*

- Options still standing:
- Where the rails agreed:
- Where they disagreed:
- Open questions:
- The Captain's leaning:
