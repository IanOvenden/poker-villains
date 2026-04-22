const GAMES_PER_SESSION = 2;
const SESSION_INTERVAL_DAYS = 14;

export type SessionStatus = "complete" | "next" | "upcoming";

export interface SessionInfo {
  sessionNumber: number;
  date: Date;
  game1: number;
  game2: number;
  status: SessionStatus;
}

export function buildSchedule(
  startDate: string,
  gamesPlayed: number,
  totalGames: number
): SessionInfo[] {
  const sessionsTotal = totalGames / GAMES_PER_SESSION;
  const base = new Date(startDate);
  const sessions: SessionInfo[] = [];
  let nextFound = false;

  for (let i = 0; i < sessionsTotal; i++) {
    const date = new Date(base);
    date.setDate(base.getDate() + i * SESSION_INTERVAL_DAYS);

    const game1 = i * GAMES_PER_SESSION + 1;
    const game2 = game1 + 1;
    const completedInSession = Math.min(
      Math.max(gamesPlayed - i * GAMES_PER_SESSION, 0),
      GAMES_PER_SESSION
    );

    let status: SessionStatus;
    if (completedInSession === GAMES_PER_SESSION) {
      status = "complete";
    } else if (!nextFound) {
      status = "next";
      nextFound = true;
    } else {
      status = "upcoming";
    }

    sessions.push({ sessionNumber: i + 1, date, game1, game2, status });
  }

  return sessions;
}

export function getNextSession(
  startDate: string,
  gamesPlayed: number,
  totalGames: number
): SessionInfo | null {
  return (
    buildSchedule(startDate, gamesPlayed, totalGames).find(
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
