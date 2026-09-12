export function removeGameFromList<T extends { id: string }>(items: T[], gameId: string): T[] {
  return items.filter((item) => item.id !== gameId);
}
