import { removeGameFromList } from "@/lib/gameList";

describe("removeGameFromList", () => {
  test("removes a deleted game immediately while preserving the rest of the list", () => {
    const games = [
      { id: "game-1", date: "2025-01-01" },
      { id: "game-2", date: "2025-01-02" },
      { id: "game-3", date: "2025-01-03" },
    ];

    const result = removeGameFromList(games, "game-2");

    expect(result.map((game) => game.id)).toEqual(["game-1", "game-3"]);
    expect(games.map((game) => game.id)).toEqual(["game-1", "game-2", "game-3"]);
  });
});
