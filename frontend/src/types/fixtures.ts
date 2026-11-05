// Generated from api/schema by `npm run types`. Do not edit by hand.
/* eslint-disable */

export interface OrdersFile {
  asOf: string;
  synthetic: boolean;
  orders: {
    id: string;
    title: string;
    station: string;
    state: "queued" | "running" | "review" | "awaiting-captain" | "blocked" | "done";
    tier: number;
    speed?: "Thrusters" | "Impulse" | "Warp" | "High Warp" | "Maximum Warp";
    updatedAt: string;
    parent?: string;
    mission?: string;
    detail?: string;
    /**
     * The card body as filed, plain text. A line that starts with GOAL:, CONTEXT:, CONSTRAINTS:, DONE WHEN: or START WITH: begins a section; a line that starts with '- ' is a list item.
     */
    body?: string;
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
    answersTo?: string;
    needs?: ("local" | "codex" | "claude")[];
    head?: boolean;
    duty: string;
    note?: string;
    activeOrder: string | null;
  }[];
}
