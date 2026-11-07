// Generated from api/schema by `npm run types`. Do not edit by hand.
/* eslint-disable */

/**
 * Main Engineering (Deck 7): the patch line from brief to live, the last check of the patch bay, the manual NAS commands, and the split-or-solo experiment.
 */
export interface EngineeringFile {
  asOf: string;
  synthetic: boolean;
  patches: {
    id: string;
    title: string;
    /**
     * Where it is on the line. The Chief plans and reviews, Systems builds, Diagnostics verifies, the Captain applies.
     */
    stage: "brief" | "plan" | "build" | "verify" | "review" | "apply" | "live";
    /**
     * Its last check failed, so it went back a stage.
     */
    failed?: boolean;
    updatedAt: string;
    why: string;
    orders?: string[];
    checks?: {
      passed: number;
      total: number;
    };
    files?: number;
  }[];
  check: {
    at: string;
    present: number;
    total: number;
    note: string;
  };
  commands: {
    label: string;
    cmd: string;
    when: string;
  }[];
  experiment: {
    name: string;
    question: string;
    arms: {
      id: "solo" | "split";
      label: string;
      runs: number;
      minutes: number;
      rework: number;
    }[];
    verdict: string | null;
  };
}

/**
 * The coded fast paths: first words that code routes straight to a station's profile, before Number One reads the message. Hermes keeps them in routing/fast-paths.json, which the arrival hook reads; live/fastpaths.json from the ship probe copies it for the board. Without it the board shows this sample (patch P's words).
 */
export interface FastPathsFile {
  asOf: string;
  synthetic: boolean;
  /**
   * @maxItems 100
   */
  paths: {
    /**
     * First words, lower case, matched at the very start of the typed text as whole words. A speed word before them still counts as the start.
     *
     * @minItems 1
     * @maxItems 8
     */
    words:
      | [string]
      | [string, string]
      | [string, string, string]
      | [string, string, string, string]
      | [string, string, string, string, string]
      | [string, string, string, string, string, string]
      | [string, string, string, string, string, string, string]
      | [string, string, string, string, string, string, string, string];
    /**
     * The Hermes profile code files the card for.
     */
    profile: string;
    /**
     * The patch that added it.
     */
    patch?: string;
    /**
     * A message that takes this path.
     */
    example?: string;
  }[];
}

/**
 * Helm's application tracker: job ads, applications and their events, from find to close. live/helm.json from the ship probe reads the tracker's own files (helm/app-tracker/*.csv) once they live on the NAS; without it the board shows this sample. Contact details, salary asks and file paths are never copied.
 */
export interface HelmFile {
  asOf: string;
  synthetic: boolean;
  /**
   * Job ads, newest found first.
   */
  ads: {
    id: string;
    found: string;
    company: string;
    role: string;
    location?: string;
    source?: string;
    deadline?: string;
    /**
     * Keyword match with the CV, percent.
     */
    match?: number;
    fit?: string;
    status: "found" | "shortlisted" | "applying" | "skipped" | "parked";
    notes?: string;
  }[];
  applications: {
    id: string;
    job: string;
    company: string;
    role: string;
    status: "drafting" | "ready" | "applied" | "interview" | "offer" | "rejected" | "withdrawn" | "ghosted";
    created: string;
    applied?: string;
    match?: number;
    nextStep?: string;
    nextDate?: string;
    notes?: string;
  }[];
  /**
   * Everything that happened, newest first: found, shortlisted, sent, reply, interview, closed and so on.
   */
  events: {
    date: string;
    id: string;
    kind: string;
    text: string;
  }[];
}

/**
 * The Science lab's meters: what the crew spends (tokens, and dollars where Hermes knows a price) by rail, station and time window, from Hermes' own session records; how fast each cloud rail works, from the hand-off log; the weekly leak share, from leak-kpis.csv; and the speed trials on the local rail (time to first token and tokens a second). live/meters.json from the meter probe replaces the sample.
 */
export interface MetersFile {
  asOf: string;
  synthetic: boolean;
  /**
   * Where each meter came from this time, and why one is empty.
   */
  sources: {
    sessions: {
      state: "read" | "missing" | "error";
      note: string;
      readAt?: string;
    };
    handoffs: {
      state: "read" | "missing" | "error";
      note: string;
      readAt?: string;
    };
    leak: {
      state: "read" | "missing" | "error";
      note: string;
      readAt?: string;
    };
    trials: {
      state: "read" | "missing" | "error";
      note: string;
      readAt?: string;
    };
  };
  /**
   * The time windows the spend is counted over. 'all' has no start.
   */
  windows: {
    id: "day" | "week" | "month" | "all";
    label: string;
    from?: string;
  }[];
  /**
   * One row per rail and window, from Hermes' session records (every profile's state.db).
   */
  spend: {
    rail: "local" | "codex" | "claude" | "other";
    window: "day" | "week" | "month" | "all";
    sessions: number;
    /**
     * Model calls, where Hermes counts them.
     */
    calls?: number;
    input: number;
    cached: number;
    output: number;
    reasoning: number;
    /**
     * Only where Hermes has a price. A subscription or local rail has none.
     */
    costUsd?: number;
  }[];
  /**
   * This week's spend by station (the Hermes profile), most first.
   */
  stations: {
    station: string;
    rail: "local" | "codex" | "claude" | "other";
    sessions: number;
    tokens: number;
    costUsd?: number;
  }[];
  /**
   * Hand-offs to the cloud rails, from handoff-log.csv: how many, their tokens and wall time. tokensPerSec is tokens over wall time, tools and waits included, not the model's own speed.
   */
  handoffs: {
    rail: "local" | "codex" | "claude" | "other";
    window: "day" | "week" | "month" | "all";
    count: number;
    tokens: number;
    wallS: number;
    costUsd?: number;
    tokensPerSec?: number;
  }[];
  leak: {
    /**
     * Which columns of leak-kpis.csv the share was worked out from.
     */
    basis: string;
    /**
     * One row per ISO week, newest first.
     */
    weeks: {
      week: string;
      from: string;
      runs: number;
      unmatched?: number;
      tokens: number;
      leakTokens: number;
      /**
       * Leak tokens as a percent of all tokens, one decimal.
       */
      share: number;
    }[];
  };
  /**
   * Speed trials on the local rail, newest first: the same short prompt a few times, timed. Each is a run of its own.
   */
  trials: {
    id: string;
    at: string;
    engine: string;
    model: string;
    repeats: number;
    ok: boolean;
    /**
     * Time to first token, the median of the repeats, measured at the client.
     */
    ttftMs?: number;
    ttftMsMax?: number;
    /**
     * Output tokens a second, from the engine's own count and time, median.
     */
    tokensPerSec?: number;
    promptTokensPerSec?: number;
    /**
     * Time spent loading the model on the first repeat (0 when it was already loaded).
     */
    loadMs?: number;
    promptTokens?: number;
    outputTokens?: number;
    note?: string;
  }[];
}

/**
 * live/nas.json from the Ops probe: the NAS's own readings (memory, swap, CPU, uptime, temperature and the disks it is told to watch). The page puts them in place of the sample NAS and its disks in ops.json. The probe only reads /proc, /sys and the size of each disk.
 */
export interface NasFile {
  asOf: string;
  synthetic: boolean;
  hosts: {
    id: string;
    name: string;
    role: string;
    state: "ok" | "warn" | "bad" | "unknown";
    seenAt: string;
    uptimeH?: number;
    cpuPct?: number;
    ram?: {
      usedGb: number;
      totalGb: number;
    };
    swap?: {
      usedGb: number;
      totalGb: number;
    };
    tempC?: number;
    note?: string;
  }[];
  disks: {
    id: string;
    host: string;
    label: string;
    mount: string;
    usedGb: number;
    totalGb: number;
    /**
     * How fast it fills, in GB a day.
     */
    perDayGb?: number;
    note?: string;
  }[];
}

/**
 * Navigation's calendar, trips and bookings. A sample only: Navigation keeps no files of its own yet. Bookings stop before Confirm for the Captain.
 */
export interface NavFile {
  asOf: string;
  synthetic: boolean;
  events: {
    id: string;
    title: string;
    start: string;
    end?: string;
    place?: string;
    kind: "appointment" | "travel" | "work" | "personal" | "hold";
    sourceOrd?: string;
  }[];
  trips: {
    id: string;
    title: string;
    from: string;
    to: string;
    depart: string;
    back?: string;
    status: "idea" | "planned" | "booked" | "done";
    sourceOrd?: string;
    legs?: {
      mode: "train" | "bus" | "car" | "flight" | "ferry" | "walk" | "bike";
      from: string;
      to: string;
      depart: string;
      arrive?: string;
    }[];
  }[];
  bookings: {
    id: string;
    what: string;
    when: string;
    where?: string;
    status: "held" | "confirmed" | "released";
    heldUntil?: string;
    sourceOrd?: string;
  }[];
}

/**
 * Ops (Deck 1): what Ops knows about the ship's machines. The hosts, the network, the containers, the disks, the GPU, the schedule, the backups, and Ops's standing cautions. Ops only reads; every change is the Captain's, by hand.
 */
export interface OpsFile {
  asOf: string;
  synthetic: boolean;
  hosts: {
    id: string;
    name: string;
    role: string;
    state: "ok" | "warn" | "bad" | "unknown";
    seenAt: string;
    uptimeH?: number;
    cpuPct?: number;
    ram?: {
      usedGb: number;
      totalGb: number;
    };
    swap?: {
      usedGb: number;
      totalGb: number;
    };
    tempC?: number;
    note?: string;
  }[];
  network: {
    internet: {
      state: "ok" | "warn" | "bad" | "unknown";
      downMbps?: number;
      upMbps?: number;
      checkedAt: string;
    };
    devices: {
      id: string;
      name: string;
      kind: "router" | "server" | "desktop" | "phone" | "other";
      /**
       * The host id, when the device is one of the hosts.
       */
      host?: string;
      state: "ok" | "warn" | "bad" | "unknown";
      link: string;
      latencyMs?: number;
      note?: string;
    }[];
    /**
     * What the ship reaches outside the LAN, and whether it answered.
     */
    links: {
      id: string;
      name: string;
      for: string;
      state: "ok" | "warn" | "bad" | "unknown";
      checkedAt: string;
    }[];
    /**
     * What listens on the LAN, and who can sign in.
     */
    ports: {
      port: number;
      service: string;
      host: string;
      reach: "local" | "lan" | "internet";
      signIn: string;
      note?: string;
    }[];
  };
  containers: {
    name: string;
    host: string;
    image: string;
    state: "running" | "restarting" | "paused" | "exited";
    memMb: number;
    limitMb?: number;
    restarts: number;
    upSince: string;
    note?: string;
  }[];
  disks: {
    id: string;
    host: string;
    label: string;
    mount: string;
    usedGb: number;
    totalGb: number;
    /**
     * How fast it fills, in GB a day.
     */
    perDayGb?: number;
    note?: string;
  }[];
  /**
   * The GPU box. The VRAM in use comes from the rails file's local VRAM meter, which is live.
   */
  gpu: {
    host: string;
    name: string;
    vramGb: number;
    tempC?: number;
    powerW?: number;
    /**
     * The models Ollama has loaded.
     */
    models: {
      name: string;
      sizeGb: number;
      until?: string;
    }[];
  };
  jobs: {
    id: string;
    name: string;
    every: string;
    /**
     * The station that owns the job.
     */
    owner: string;
    last: "ok" | "failed" | "skipped" | "running" | "never";
    lastAt?: string;
    nextAt?: string;
    order?: string;
    backup?: string;
    note?: string;
  }[];
  backups: {
    id: string;
    what: string;
    from: string;
    to: string;
    lastAt: string;
    sizeGb?: number;
    /**
     * Whether the last copy was read back and found whole.
     */
    verified: "ok" | "failed" | "never";
    keep: string;
    /**
     * A copy older than this many hours is overdue.
     */
    warnAfterH: number;
    note?: string;
  }[];
  cautions: {
    id: string;
    text: string;
    why: string;
  }[];
}

export interface OrdersFile {
  asOf: string;
  synthetic: boolean;
  orders: {
    id: string;
    title: string;
    station: string;
    state: "queued" | "running" | "review" | "awaiting-captain" | "blocked" | "done";
    /**
     * The risk tier, 0 to 3. Live orders have none until the tier classifier (conn handoff) is built.
     */
    tier?: number;
    /**
     * The Captain's speed word (docs/04-speed-scale.md). Impulse and High Warp are the older sample words.
     */
    speed?:
      | "Thrusters"
      | "Quarter Impulse"
      | "Half Impulse"
      | "Full Impulse"
      | "Impulse"
      | "Warp"
      | "Warp 9"
      | "High Warp"
      | "Maximum Warp";
    updatedAt: string;
    /**
     * When the order came in (orders.csv received_at, else its first card).
     */
    openedAt?: string;
    /**
     * When the order closed. Done orders only.
     */
    closedAt?: string;
    /**
     * Where the Captain gave it: telegram, desktop, dashboard, ...
     */
    surface?: string;
    /**
     * How many Kanban cards were filed for it. 0: answered in chat, or never picked up.
     */
    cards?: number;
    parent?: string;
    mission?: string;
    detail?: string;
    /**
     * The card body as filed, plain text. A line that starts with GOAL:, CONTEXT:, CONSTRAINTS:, DONE WHEN: or START WITH: begins a section; a line that starts with '- ' is a list item.
     */
    body?: string;
    /**
     * What came back on the order, oldest first: the answer the Captain was sent, a card's result, a run's summary or error, and comments. The newest few only.
     */
    replies?: {
      at: string;
      /**
       * A station id, or the name of whoever wrote it.
       */
      by: string;
      kind: "answer" | "result" | "run" | "error" | "comment";
      /**
       * Plain text, as written.
       */
      text: string;
    }[];
  }[];
}

export interface QuartersFile {
  asOf: string;
  synthetic: boolean;
  campaigns: {
    id: string;
    name: string;
    objective: string;
    measure: string;
    percent: number;
    /**
     * Target month, YYYY-MM.
     */
    target: string;
    status: "active" | "paused" | "done";
  }[];
  missions: {
    id: string;
    name: string;
    campaign?: string;
    doneWhen: string;
    stations: string[];
    progress: string;
    status: "awaiting-captain" | "in-flight" | "planning" | "closed";
  }[];
  /**
   * The captain's log. Stays on the local rail; only the Ship's Computer reads it.
   */
  log: {
    at: string;
    text: string;
  }[];
  standingOrders: string[];
  yeoman: {
    id: string;
    text: string;
    kind: "todo" | "reminder" | "waiting";
    due: string;
  }[];
  reading: {
    year: number;
    read: number;
    goal: number;
    current: {
      title: string;
      author: string;
      percent: number;
    }[];
    next: {
      title: string;
      author: string;
    }[];
  };
}

/**
 * live/rail-log.json from the rails probe: a line each time a rail went out or came back, newest first. The page works out which crew went to quarters (Crew Quarters duty log).
 */
export interface RailLogFile {
  asOf: string;
  synthetic: boolean;
  events: {
    at: string;
    rail: "local" | "codex" | "claude";
    /**
     * out: the rail went out. up: it came back.
     */
    state: "out" | "up";
  }[];
}

export interface RailsFile {
  asOf: string;
  synthetic: boolean;
  rails: {
    id: "local" | "codex" | "claude";
    label: string;
    engine?: string;
    host?: string;
    state: "up" | "degraded" | "out";
    meters: {
      id: string;
      label: string;
      percent: number;
      resetsAt?: string;
    }[];
    burn?: {
      active: boolean;
      until?: string;
    };
    note?: string;
  }[];
}

/**
 * The Science lab (Deck 3): the local models, their evals, serving, datasets and quantising runs, every number with the run that measured it, and the study bench (tracks of lessons).
 */
export interface ScienceFile {
  asOf: string;
  /**
   * true for sample data.
   */
  synthetic: boolean;
  models: {
    id: string;
    name: string;
    quant: "fp16" | "q8" | "q6" | "q5" | "q4" | "q3";
    sizeGb: number;
    role: string;
    /**
     * The run that made this file.
     */
    run: string;
  }[];
  suites: {
    id: string;
    label: string;
    what: string;
    dataset: string;
  }[];
  evals: {
    id: string;
    model: string;
    suite: string;
    /**
     * Percent right.
     */
    score: number;
    /**
     * Every number comes with the run that measured it.
     */
    run: string;
  }[];
  serving: {
    id: string;
    engine: string;
    model: string;
    state: "live" | "trial" | "failed";
    contextK: number;
    tokensPerSec?: number;
    /**
     * Percent of the GPU's memory in use.
     */
    vram?: number;
    run: string;
  }[];
  datasets: {
    id: string;
    name: string;
    rows: number;
    state: "draft" | "curated" | "frozen";
    purpose: string;
    run?: string;
  }[];
  runs: {
    id: string;
    kind: "eval" | "quantise" | "serve" | "dataset";
    title: string;
    at: string;
    minutes: number;
    ok: boolean;
    model?: string;
    dataset?: string;
    /**
     * The run log's own lines.
     *
     * @minItems 1
     */
    log: [string, ...string[]];
  }[];
  study: {
    id: string;
    name: string;
    why: string;
    /**
     * @minItems 1
     */
    lessons: [
      {
        title: string;
        done: boolean;
        /**
         * A run of ours the lesson reads.
         */
        run?: string;
      },
      ...{
        title: string;
        done: boolean;
        /**
         * A run of ours the lesson reads.
         */
        run?: string;
      }[]
    ];
  }[];
}

/**
 * The Sensor array (Deck 3): the watches Sensors keeps, what they found (cited), the asks that reached Sensors word for word, and web content held in quarantine.
 */
export interface SensorsFile {
  asOf: string;
  synthetic: boolean;
  watches: {
    id: string;
    name: string;
    /**
     * Where it sits on the scope.
     */
    sector: "jobs" | "market" | "tech" | "home";
    kind: "price" | "jobs" | "release" | "research";
    /**
     * How often it is scanned. Tracked, never capped.
     */
    cadence: "daily" | "weekly" | "monthly";
    /**
     * What is watched, in plain words.
     */
    target: string;
    /**
     * The station the findings go to.
     */
    forStation: string;
    lastScan: string;
    nextScan: string;
    state: "active" | "paused";
    order?: string;
  }[];
  findings: {
    id: string;
    watch: string;
    at: string;
    title: string;
    summary: string;
    /**
     * @minItems 1
     */
    sources: [
      {
        title: string;
        site: string;
      },
      ...{
        title: string;
        site: string;
      }[]
    ];
    /**
     * The station it went to has read it.
     */
    seen: boolean;
  }[];
  asks: {
    id: string;
    at: string;
    /**
     * The Captain's words, exactly as they were sent.
     */
    words: string;
    /**
     * What Number One passed on, when it was not word for word.
     */
    passed?: string;
    /**
     * True when Sensors got the words unchanged.
     */
    unchanged: boolean;
    state: "answered" | "running" | "queued";
    order?: string;
  }[];
  quarantine: {
    id: string;
    at: string;
    watch: string;
    site: string;
    /**
     * Why it was held, described. Never the held text itself.
     */
    what: string;
  }[];
}

export interface ShipFile {
  asOf: string;
  synthetic: boolean;
  name: string;
  registry: string;
  condition: "green" | "yellow" | "red";
  captain: {
    onBridge: boolean;
    conn: string;
  };
  timezone?: string;
}

export interface ShipLogFile {
  asOf: string;
  synthetic: boolean;
  entries: {
    at: string;
    station: string;
    kind: "order" | "split" | "hail" | "customs" | "review" | "done" | "rail" | "duty" | "briefing";
    text: string;
    /**
     * duty: out = the crew member went to quarters, in = back at the post
     */
    dir?: "out" | "in";
    /**
     * briefing: the stations at the table
     *
     * @minItems 1
     */
    attendees?: [string, ...string[]];
    /**
     * briefing: when it ended
     */
    ends?: string;
    /**
     * briefing: what the room agreed, from the minutes
     */
    outcome?: string;
  }[];
}

export interface StationsFile {
  asOf: string;
  synthetic: boolean;
  stations: {
    id: string;
    name: string;
    short: string;
    kind: "station" | "place" | "captain";
    rail: "local" | "codex" | "claude" | "mixed" | "captain";
    status: "live" | "approved" | "proposed" | "reserved";
    rank:
      | "captain"
      | "commander"
      | "ltcmdr"
      | "lt"
      | "ltjg"
      | "ensign"
      | "cpo"
      | "po"
      | "cadet"
      | "none"
      | "team"
      | "space";
    dept: "command" | "flight" | "ops" | "security" | "eng" | "holo" | "sci" | "med" | null;
    deck: number;
    profile?: string;
    aliases: string[];
    model?: string;
    /**
     * The speed the station works at when the Captain gives no speed word. Without it, Impulse.
     */
    defaultSpeed?:
      | "Thrusters"
      | "Quarter Impulse"
      | "Half Impulse"
      | "Full Impulse"
      | "Impulse"
      | "Warp"
      | "Warp 9"
      | "High Warp"
      | "Maximum Warp";
    answersTo?: string;
    needs?: ("local" | "codex" | "claude")[];
    head?: boolean;
    duty: string;
    note?: string;
    activeOrder: string | null;
  }[];
}

/**
 * The Main Viewscreen's sessions: each time the Captain's desktop went on screen, and every click, key and line typed, with the Captain's answer. A sample only: the computer-use sessions keep no log the probe reads yet.
 */
export interface ViewscreenFile {
  asOf: string;
  synthetic: boolean;
  /**
   * Newest first.
   */
  sessions: {
    id: string;
    start: string;
    end?: string;
    surface: "telegram" | "desktop" | "dashboard";
    why: string;
    sourceOrd?: string;
    /**
     * Screenshots sent to Telegram.
     */
    captures: number;
    actions: {
      at: string;
      kind: "click" | "type" | "key" | "scroll";
      what: string;
      decision: "approved" | "denied" | "waiting";
    }[];
  }[];
}

/**
 * The Captain's Yeoman's list: open todos, reminders, waiting-fors and recurring dates, and what closed. live/yeoman.json from the ship probe reads the Yeoman's own files (yeoman/*.csv); without it the boards show this sample. Test rows are left out, and nothing about a chat is copied.
 */
export interface YeomanFile {
  asOf: string;
  synthetic: boolean;
  /**
   * When the Yeoman's timer last beat (.timer-heartbeat). The timer is what fires reminders, in code.
   */
  heartbeat?: string;
  todos: {
    id: string;
    text: string;
    addedAt: string;
    /**
     * When it is due. Within 48 hours, or past, it is urgent.
     */
    due?: string;
    /**
     * The Captain's "!".
     */
    important: boolean;
    /**
     * The order the Captain gave it in.
     */
    sourceOrd?: string;
  }[];
  reminders: {
    id: string;
    text: string;
    dueAt: string;
    status: "open" | "snoozed";
    /**
     * Where it fires: telegram, desktop, ...
     */
    surface?: string;
    /**
     * The order the Captain gave it in.
     */
    sourceOrd?: string;
  }[];
  waiting: {
    id: string;
    what: string;
    since: string;
    fromWhom?: string;
    /**
     * When the Yeoman nudges the Captain about it.
     */
    nudgeAfter?: string;
    /**
     * The order the Captain gave it in.
     */
    sourceOrd?: string;
  }[];
  recurring: {
    id: string;
    text: string;
    /**
     * daily, weekly:mon, monthly:25, yearly:10-25 (with a time when one was given).
     */
    rule: string;
    nextDue?: string;
    surface?: string;
    /**
     * The order the Captain gave it in.
     */
    sourceOrd?: string;
  }[];
  done: {
    id: string;
    kind: "todo" | "reminder" | "waiting" | "recurring";
    text: string;
    closedAt: string;
    /**
     * ticked, fired, arrived, cancelled, ...
     */
    how: string;
    /**
     * The order the Captain gave it in.
     */
    sourceOrd?: string;
  }[];
}
