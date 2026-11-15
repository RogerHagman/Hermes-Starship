# The sample data

Every board starts from the files in this folder. They are **made up**: the orders, the crew's work, the towns, the job ads, the todo list and the numbers were all written by hand to show what each board looks like in use. Each file says so itself with `"synthetic": true`, and a test (`tests/test_fixtures.py`) checks that no file contains anything shaped like a real email address, phone number or ID number.

On the boards, anything still coming from this folder is marked **SAMPLE** in dashed yellow: in the header chips, and on each panel. A part that has a live file shows without a tag.

## Which file feeds what

| File | What it holds | Board | Goes live through |
|---|---|---|---|
| `ship.json` | The ship's name, registry and **time zone** | All | You edit it |
| `stations.json` | The crew: every station, its Hermes profile, rail, rank and department | All | You edit it to match your crew |
| `rails.json`, `raillog.json` | Each rail's state and usage, and when a rail went out or came back | Bridge, Ops, Engineering | rails probe |
| `orders.json`, `shiplog.json` | Orders in flight and the ship's log | Bridge, most boards | ship probe |
| `nas.json` | The host's memory, CPU, temperature and disks | Ops | Ops probe |
| `meters.json` | Spend, speed and leak share | Science lab | meter probe, speed trial |
| `yeoman.json` | The Captain's todos, reminders and waiting-fors | Yeoman's post, Quarters | ship probe |
| `helm.json` | Job ads and applications | Helm | ship probe |
| `fastpaths.json` | First words that route straight to a station | Number One's post | ship probe |
| `holo.json` | Branches, check runs and pull requests | Holodeck Review bay | holo probe |
| `ops.json` | Network, GPU box, containers, jobs and backups | Ops | Sample only, for now |
| `quarters.json` | Hails, campaigns, missions and the Captain's log | Captain's Quarters | Sample only |
| `sensors.json`, `engineering.json`, `science.json`, `nav.json`, `viewscreen.json` | Watches, the patch bay, model scores, trips, screen sessions | Their own boards | Sample only |

"Sample only" means no probe exists yet. To show your own data there, edit the file. The schema in [`api/schema/`](../api/schema/) says what each field means, and `python -m unittest discover -s tests` tells you if an edit broke the shape.

## Making it yours

1. **`ship.json`:** set `"timezone"` to your own (an IANA name, such as `America/New_York`).
2. **`stations.json`:** keep the stations you have, and set each one's `"profile"` to the name of your Hermes profile. The probes use this to put an order on the right station.
3. **Bring parts live** one at a time: see [docs/09-live-data.md](../docs/09-live-data.md), which starts with a five-minute first test.
