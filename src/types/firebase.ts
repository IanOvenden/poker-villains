export type SeasonStatus = "active" | "complete";

export interface SessionOverride {
  customDate?: string;
  skipped?: boolean;
  reason?: string;
}

export interface Season {
  id: string;
  number: number;
  status: SeasonStatus;
  gameCount: number;
  potTotal: number;
  startDate: string;
  endDate?: string;
  sessionOverrides?: Record<string, SessionOverride>;
}

export interface Player {
  id: string;
  name: string;
  villainId?: string;
  createdAt: string;
}

export interface GameResult {
  playerId: string;
  position: number;
  knockouts: string[];
  points: number;
  prizeMoney: number;
}

export interface Game {
  id: string;
  seasonId: string;
  date: string;
  playerCount: number;
  potTotal: number;
  seasonPotContribution: number;
  results: GameResult[];
}

export interface DraftGamePresence {
  displayName: string;
  lastSeen: string;
}

export interface DraftGame {
  id: string;
  seasonId: string;
  createdAt: string;
  createdBy: string;
  step: "select" | "knockouts" | "positions" | "confirm";
  selectedPlayerIds: string[];
  knockouts: Record<string, string[]>;
  /** Ordered list of knocked-out player IDs, earliest elimination first. */
  eliminationOrder: string[];
  positions: Record<string, number>;
  presence: Record<string, DraftGamePresence>;
}
