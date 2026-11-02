# Station spec · Captain's Yeoman

## GOAL
The Captain can drop a quick reminder or private todo from any surface and get an answer within seconds. Every reminder actually goes out at its time, with proof.

## CONTEXT
- Hermes has nothing that holds a message until a set time. Without this station, a local Number One filed a reminder card to itself, the card ran at once, and it claimed the reminder was "already delivered" hours early.
- The Yeoman answers fast, owns five files and stays inside that box.

| | |
|---|---|
| **Station** | Captain's Yeoman |
| **Profile** | `yeoman` |
| **Aliases** | yeoman, todo, remind |
| **Rank** | Petty Officer (enlisted: fixed procedures, no judgement calls) |
| **Department** | Command. Serves the Captain directly; orders still come through routing (or the code fast path) |
| **Rail** | Local only, thinking off, memory off. The lists never leave the ship |

### The five files (`/opt/data/yeoman/`, empty templates in [yeoman-templates/](yeoman-templates/))
Times are stored in UTC (ISO 8601) and shown in the Captain's time zone. Code writes every timestamp. Text with a comma is quoted.

| File | Columns | Id prefix | Notes |
|---|---|---|---|
| `reminders.csv` | id, due_at_utc, text, surface, source_ord, status | R- | `open` or `snoozed`. When code fires one, it moves to done |
| `todos.csv` | id, added_at_utc, text, important, due_utc, source_ord | T- | `important` = `yes` or blank (the Captain's "!"). Due date optional |
| `waiting.csv` | id, since_utc, what, from_whom, nudge_after_utc, source_ord | W- | Code nudges the Captain once `nudge_after` passes |
| `recurring.csv` | id, rule, time_local, text, next_due_utc, surface, source_ord | C- | `daily`, `weekly:mon`, `monthly:25`, `yearly:10-25`. Code re-arms after each fire |
| `done.csv` | id, kind, text, closed_at_utc, how, source_ord | (item's id) | `how`: ticked, fired, arrived, cancelled. Only code writes here |

## Duty map
**The rule:** the Yeoman keeps the reminder about a thing, never the thing itself.
- **Helm** keeps applications and employer replies; it can ask the Yeoman for a nudge.
- **Quartermaster** keeps money, bill amounts, budget, food and shopping. The Yeoman only holds "pay X on the 25th".
- **Navigation** owns the calendar. The Yeoman never creates or moves events. Bookings ("book winter tires") go to Navigation, which finds a slot, fills the form locally and stops before Confirm for the Captain; the Yeoman then ticks the todo and sets a reminder for the day before.
- **Number One** runs the weekly reset; the done log feeds it.
- **Ship's Computer** owns memory. The Yeoman's files are lists, not memory.
- **Comms** (if hired) reads outside mail, so it never holds the lists. It may suggest a waiting-for item, which the Yeoman adds after the Captain confirms; mail text never crosses.

## Sorting: the Eisenhower matrix
"What's on my list?" comes back in four colour-coded groups, in this order:

| Box | Colour | Rule | What happens |
|---|---|---|---|
| 🟩 Do first | green | urgent + important | Done today |
| 🟦 Schedule | blue | important, not urgent | Handed to Navigation for a time slot |
| 🟧 Delegate | orange | urgent, not important | Handed to the owning station |
| 🟥 Don't do | red | neither | Suggested for dropping; only the Captain's yes moves it to done as cancelled |

- **Urgent is computed by code:** due within 48 hours, or overdue. No due date = not urgent.
- **Important is marked by the Captain** with "!" when adding ("todo! book winter tires"). The Yeoman never decides importance; it may flag unmarked items as "important?" in the weekly review.
- The box is computed when the list is read, never stored.

## Reply templates
Code fills the `{slots}`. The model never writes these lines.

- Added a todo: `📝 {id} added: {text}{ · due {due_local}}{ · marked important}`
- Added a reminder: `⏰ {id} set for {due_local}: {text}`
- Couldn't read the time: `When should I remind you? (for example "16:00", "tomorrow 08:00", "in 2 hours")`
- Reminder fires: `⏰ Reminder: {text}`
- Waiting nudge: `⌛ Still waiting on {from_whom}: {what} (since {since_local}). Chase it, wait longer, or drop it?`
- Ticked off: `✅ {id} done: {text}`

Example list (made-up items):
```
🟩 Do first
  T-0007 Pay the electricity bill (due today)
🟦 Schedule
  T-0001 Book winter tires
🟧 Delegate
  T-0005 Renew the parking permit (due tomorrow) → Quartermaster?
🟥 Don't do
  T-0004 Sort old cables (suggested; say "drop T-0004")
⌛ Waiting for
  W-0002 Refund from an online shop (since 20/10)
⏰ Next reminders
  R-0003 Today 17:00: call the garage
```
Empty groups are left out.

## CONSTRAINTS
- **Fixed commands only:** add, list, tick, cancel, snooze, for each file. No file search, no reads outside `/opt/data/yeoman/`, no terminal, no code execution.
- **Code parses times** into UTC using the Captain's time zone. If it can't parse, the Yeoman asks one question. It never guesses. A bare number in the text is never a time.
- **Code fires reminders.** A timer checks reminders and recurring items every minute, sends due ones to the surface the order came from, writes `fired` into `done.csv`, and re-arms recurring items. No model is involved in sending.
- **Never claims delivery.** "Delivered" is read from `done.csv`, never written by a model.
- Ops watches that the timer is alive, like any cron.
- Code fast path: "remind…", "todo…" and "yeoman…" at the start of a message go straight to the Yeoman.

## DONE WHEN
- "Remind me in 2 minutes to test" fires within a minute of its time, and `done.csv` has the `fired` row.
- "What's on my list?" answers within 10 seconds, sorted into the four boxes.
- A monthly recurring item fires and re-arms to next month.
- The Captain has approved the SOUL crew-table diff.
