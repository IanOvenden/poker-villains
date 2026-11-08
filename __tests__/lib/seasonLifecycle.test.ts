import {
	getNextSeasonNumber,
	getActiveSeasonIds,
	canFinalizeSeason,
	seasonStartDateFromInput,
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

	test("converts a selected calendar date to local midnight", () => {
		const expectedDate = new Date(0);
		expectedDate.setFullYear(2026, 10, 8);
		expectedDate.setHours(0, 0, 0, 0);

		expect(seasonStartDateFromInput("2026-11-08")).toBe(
			expectedDate.toISOString(),
		);
	});

	test("rejects invalid season start dates", () => {
		expect(() => seasonStartDateFromInput("2026-02-30")).toThrow(
			"Please choose a valid season start date.",
		);
	});
});
