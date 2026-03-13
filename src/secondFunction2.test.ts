import { readFile, writeFile } from "node:fs/promises";
import { expect, it } from "vitest";
import { formatCSVFileToJSONFile } from "./secondFunction";

it("real CSV and JSON files", async () => {
	const inputPath = "./test_input.csv";
	const outputPath = "./test_output.json";

	const csvContent = "Имя;Возраст\nИван;20\nАнна;19  \n";
	await writeFile(inputPath, csvContent, "utf8");

	await formatCSVFileToJSONFile(inputPath, outputPath, ";");

	const resultRaw = await readFile(outputPath, "utf8");
	const result = JSON.parse(resultRaw);

	expect(result).toEqual([
		{ Имя: "Иван", Возраст: 20 },
		{ Имя: "Анна", Возраст: 19 },
	]);
});
