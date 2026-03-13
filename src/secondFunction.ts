import { readFile, writeFile } from "node:fs/promises";
import { csvToJSON } from "./firstFunction";

export async function formatCSVFileToJSONFile(
	input: string,
	output: string,
	delimiter: string,
): Promise<void> {
	const fileContent = await readFile(input, "utf8");
	//                      отсекает еще и \r (win symbol)
	const allLines = fileContent.split(/\r?\n/);

	const lines: string[] = [];

	for (let i = 0; i < allLines.length; i++) {
		const currentLine = allLines[i];

		const cleanLine = currentLine.trim();

		if (cleanLine !== "") {
			lines.push(currentLine);
		}
	}

	const jsonArray = csvToJSON(lines, delimiter);

	const jsonText = JSON.stringify(jsonArray, null, 4);

	await writeFile(output, jsonText, "utf8");
}
