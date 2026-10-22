# Hermes Starship · the idea
## What this is

Hermes is my personal crew of AI agents. Instead of one assistant doing everything, the work is split into stations on a starship. Each station has one job and an owner, and it works on the rail that suits that job:

local: a model running on my own hardware, for anything private
Codex: for engineering and anything that needs precise structured output
Claude: for research, writing, design and planning
I'm the Captain. Number One runs the bridge and routes my requests to the right station. The Chief Engineer builds and fixes. The Quartermaster keeps the stores, which means food, receipts and budget. Sensors researches, and Cartography makes things look good. The Ship's Computer keeps the memory, and Security checks everything that leaves the ship.

This repo is going to be the ship itself: a place where I can walk the decks and see my crew at work.

# Why
Today the crew lives in chat and in files. That works, but I can't see it:

- who is working, and on what
- which rail the work is running on, and whether a rail is down or out of quota
- what is waiting for me to approve
- what crossed from my machine to a cloud rail, and whether it was checked
- how my bigger goals (campaigns) and projects (missions) are moving
- A ship you can look around should make all of that obvious at a glance, and make the crew feel like a crew.

## The picture in my head
The deck plan. The ship from above, with every station on it, coloured by the rail it runs on. I can pick a station and see what it does, who it calls, and how it's doing.
The Captain's Quarters. My own room: campaigns, missions, the order log, and everything awaiting my orders.
The station consoles. Engineering, the Sensor array, the Science lab, the Quartermaster's stores, Navigation, the Archives, Cartography and the Strategist's plotting table. Each one shows that station's own work.
The sector chart. The home network: machines, rails and health.
The Briefing Room. Where several stations and I discuss something bigger together.
The main viewscreen. Where I can put any plan, order or document up big.
The comm badge. One place to ask, order or approve from anywhere on the ship.
The ship is built on the Holodeck. The Holodeck Officer lays the first bricks there, turning designs into working decks. Once a deck is built, I use it from the bridge, not from the Holodeck.

## Ideas I want to hold on to
Moving around should be instant. Walking the ship and looking at things should never wait on an AI. The intelligence is for orders, not for opening a door.
Work has levels. An order is one task for one station. A mission is a set of orders with a clear "done when". A campaign is a long-term goal that only I open or close.
Nothing important happens without me. The ship shows; I decide. Anything that acts goes through the same approval rules the crew already follows.
Private stays private. Memory, secrets and personal data stay on my own machines. The ship can show my campaigns and missions, but never things like personal numbers, card details or health readings.
Start small. The first version only looks: a few decks on made-up data. Live data comes next, and buttons that act come last.
Not decided yet
On purpose. These get worked out together with the crew, starting with a Briefing Room session:

## the tech stack
where it's hosted, and how it fits next to Hermes's own dashboard
the look and feel in detail
how live data gets in and how actions get out
First steps
This document.
A Briefing Room session on how to build it.
A first static version of the deck plan and the sector chart.
