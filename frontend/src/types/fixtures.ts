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
    detail?: string;
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
    kind: "order" | "split" | "hail" | "customs" | "review" | "done" | "rail";
    text: string;
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
