import type { SessionOverride } from "@/types";

const GAMES_PER_SESSION = 2;
const SESSION_INTERVAL_DAYS = 14;

export type SessionStatus = "complete" | "next" | "upcoming" | "skipped";

export interface SessionInfo {
  sessionNumber: number;
  date: Date;
  originalDate: Date;
  game1: number;
  game2: number;
  status: SessionStatus;
  postponed: boolean;
  skipped: boolean;
  overrideReason?: string;
}

export function buildSchedule(
  startDate: string,
  gamesPlayed: number,
  totalGames: number,
  overrides?: Record<string, SessionOverride>
): SessionInfo[] {
  const sessionsTotal = totalGames / GAMES_PER_SESSION;
  const base = new Date(startDate);
  const sessions: SessionInfo[] = [];
  let nextFound = false;
  let skipsCount = 0;

  for (let i = 0; i < sessionsTotal; i++) {
    const override = overrides?.[String(i)];
    const isSkipped = override?.skipped === true;

    // Each prior skip pushes remaining sessions forward by one interval
    const originalDate = new Date(base);
    originalDate.setDate(base.getDate() + (i + skipsCount) * SESSION_INTERVAL_DAYS);

    const date =
      !isSkipped && override?.customDate
        ? new Date(override.customDate)
        : originalDate;

    // Game numbers count only non-skipped sessions
    const nonSkippedIndex = i - skipsCount;
    const game1 = isSkipped ? 0 : nonSkippedIndex * GAMES_PER_SESSION + 1;
    const game2 = isSkipped ? 0 : game1 + 1;

    const completedInSession = isSkipped
      ? 0
      : Math.min(
          Math.max(gamesPlayed - nonSkippedIndex * GAMES_PER_SESSION, 0),
          GAMES_PER_SESSION
        );

    let status: SessionStatus;
    if (isSkipped) {
      status = "skipped";
    } else if (completedInSession === GAMES_PER_SESSION) {
      status = "complete";
    } else if (!nextFound) {
      status = "next";
      nextFound = true;
    } else {
      status = "upcoming";
    }

    if (isSkipped) skipsCount++;

    sessions.push({
      sessionNumber: i + 1,
      date,
      originalDate,
      game1,
      game2,
      status,
      postponed: !isSkipped && !!override?.customDate,
      skipped: isSkipped,
      overrideReason: override?.reason,
    });
  }

  return sessions;
}

export function getNextSession(
  startDate: string,
  gamesPlayed: number,
  totalGames: number,
  overrides?: Record<string, SessionOverride>
): SessionInfo | null {
  return (
    buildSchedule(startDate, gamesPlayed, totalGames, overrides).find(
      (s) => s.status === "next"
    ) ?? null
  );
}

export function formatSessionDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}
