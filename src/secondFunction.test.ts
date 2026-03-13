// 1. Импортируем нужные слова из vitest (включая vi)

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { formatCSVFileToJSONFile } from "./secondFunction";

vi.mock("node:fs/promises");

describe("formatCSVFileToJSONFile test", () => {
	it("read CSV, convert to JSON and write to file", async () => {
		const fakeCSVText = "Имя;Возраст\nИван;20\nАнна;19  \n";

		vi.mocked(readFile).mockResolvedValue(fakeCSVText);

		const expectedArray = [
			{ Имя: "Иван", Возраст: 20 },
			{ Имя: "Анна", Возраст: 19 },
		];
		const expectedJSONText = JSON.stringify(expectedArray, null, 4);

		await formatCSVFileToJSONFile("input.csv", "output.json", ";");

		expect(readFile).toHaveBeenCalledWith("input.csv", "utf8");

		expect(writeFile).toHaveBeenCalledWith(
			"output.json",
			expectedJSONText,
			"utf8",
		);
	});
});
