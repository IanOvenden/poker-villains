export interface SeasonLike {
  id?: string;
  number?: number;
  gameCount?: number;
  status?: "active" | "complete";
}

export function getNextSeasonNumber(seasons: SeasonLike[]): number {
  const latest = seasons.reduce((max, season) => {
    const number = typeof season.number === "number" ? season.number : 0;
    return Math.max(max, number);
  }, 0);

  return latest + 1;
}

export function seasonStartDateFromInput(value: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error("Please choose a valid season start date.");
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(0);
  date.setFullYear(year, month - 1, day);
  date.setHours(0, 0, 0, 0);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    throw new Error("Please choose a valid season start date.");
  }

  return date.toISOString();
}

export function getActiveSeasonIds(seasons: SeasonLike[]): string[] {
  return seasons
    .filter((season) => season.status === "active")
    .map((season) => season.id)
    .filter((id): id is string => Boolean(id));
}

export function hasMultipleActiveSeasons(seasons: SeasonLike[]): boolean {
  return getActiveSeasonIds(seasons).length > 1;
}

export function canFinalizeSeason(
  season: { gameCount?: number } | null | undefined,
  totalGames: number,
): boolean {
  if (!season) return false;
  return Number(season.gameCount ?? 0) >= totalGames;
}
