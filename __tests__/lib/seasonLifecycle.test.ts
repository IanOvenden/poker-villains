import {
	getNextSeasonNumber,
	getActiveSeasonIds,
	canFinalizeSeason,
} from "@/lib/seasonLifecycle";

describe("season lifecycle helpers", () => {
	test("calculates the next season number from the highest existing season", () => {
		expect(
			getNextSeasonNumber([{ number: 1 }, { number: 3 }, { number: 2 }]),
		).toBe(4);
	});

	test("returns only active season ids from a list of seasons", () => {
		expect(
			getActiveSeasonIds([
				{ id: "a", status: "active" },
				{ id: "b", status: "complete" },
				{ id: "c", status: "active" },
			]),
		).toEqual(["a", "c"]);
	});

	test("only allows finalizing once all games in the season are complete", () => {
		expect(canFinalizeSeason({ gameCount: 29 }, 30)).toBe(false);
		expect(canFinalizeSeason({ gameCount: 30 }, 30)).toBe(true);
	});
});
