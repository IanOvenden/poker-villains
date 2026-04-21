import {
  calculatePoints,
  calculatePrizeMoney,
  calculateSeasonPotContribution,
  processGame,
} from "@/lib/pointsEngine";

// --- calculatePoints ---

describe("calculatePoints", () => {
  test("winner in 4-player game: 8pts + knockouts", () => {
    expect(
      calculatePoints(
        { playerId: "1", position: 1, knockouts: ["2", "3", "4"] },
        4,
      ),
    ).toBe(11);
  });

  test("runner-up in 4-player game: 4pts", () => {
    expect(
      calculatePoints({ playerId: "2", position: 2, knockouts: [] }, 4),
    ).toBe(4);
  });

  test("last place in 4-player game: no penalty", () => {
    expect(
      calculatePoints({ playerId: "4", position: 4, knockouts: [] }, 4),
    ).toBe(0);
  });

  test("winner in 6-player game: 8pts + 3 knockouts = 11pts", () => {
    expect(
      calculatePoints(
        { playerId: "1", position: 1, knockouts: ["2", "3", "4"] },
        6,
      ),
    ).toBe(11);
  });

  test("third place in 6-player game: 1pt", () => {
    expect(
      calculatePoints({ playerId: "3", position: 3, knockouts: [] }, 6),
    ).toBe(1);
  });

  test("last place in 6-player game: -1pt", () => {
    expect(
      calculatePoints({ playerId: "6", position: 6, knockouts: [] }, 6),
    ).toBe(-1);
  });

  test("last place in 6-player game with a knockout: 0pts", () => {
    expect(
      calculatePoints({ playerId: "6", position: 6, knockouts: ["5"] }, 6),
    ).toBe(0);
  });
});

// --- calculatePrizeMoney ---

describe("calculatePrizeMoney", () => {
  test("6 players: pot = £60, season cut = £12, runner-up = £12, winner = £36", () => {
    expect(calculatePrizeMoney(1, 6)).toBe(36);
    expect(calculatePrizeMoney(2, 6)).toBe(12);
    expect(calculatePrizeMoney(3, 6)).toBe(0);
  });

  test("4 players: pot = £40, season cut = £8, runner-up = £8, winner = £24", () => {
    expect(calculatePrizeMoney(1, 4)).toBe(24);
    expect(calculatePrizeMoney(2, 4)).toBe(8);
  });

  test("3 players: pot = £30, season cut = £6, winner takes £24", () => {
    expect(calculatePrizeMoney(1, 3)).toBe(24);
    expect(calculatePrizeMoney(2, 3)).toBe(0);
  });
});

// --- calculateSeasonPotContribution ---

describe("calculateSeasonPotContribution", () => {
  test("6 players: £12 to season pot", () => {
    expect(calculateSeasonPotContribution(6)).toBe(12);
  });

  test("4 players: £8 to season pot", () => {
    expect(calculateSeasonPotContribution(4)).toBe(8);
  });
});

// --- processGame ---

describe("processGame", () => {
  test("full 6-player game processes correctly", () => {
    const players = [
      { playerId: "1", position: 1, knockouts: ["2", "3", "4"] },
      { playerId: "2", position: 2, knockouts: [] },
      { playerId: "3", position: 3, knockouts: [] },
      { playerId: "4", position: 4, knockouts: [] },
      { playerId: "5", position: 5, knockouts: [] },
      { playerId: "6", position: 6, knockouts: [] },
    ];

    const summary = processGame(players);

    expect(summary.potTotal).toBe(60);
    expect(summary.seasonPotContribution).toBe(12);
    expect(summary.results[0].points).toBe(11);
    expect(summary.results[0].prizeMoney).toBe(36);
    expect(summary.results[1].points).toBe(4);
    expect(summary.results[1].prizeMoney).toBe(12);
    expect(summary.results[5].points).toBe(-1);
    expect(summary.results[5].prizeMoney).toBe(0);
  });
});
