export function cleanRow(line: string, delimiter: string): string[] {
	const parts = line.split(delimiter);

	const cleanedParts = [];
	for (let i = 0; i < parts.length; i++) {
		const cleanString = parts[i].trim();
		cleanedParts.push(cleanString);
	}

	return cleanedParts;
}

export function detectType(value: string): string {
	const isNumber = value === String(+value);

	if (isNumber) {
		return "number";
	} else if (value === "true" || value === "false") {
		return "boolean";
	} else {
		return "string";
	}
}

export function convertValue(
	value: string,
	type: string,
): string | number | boolean {
	if (type === "number") {
		return Number(value);
	} else if (type === "boolean") {
		return value === "true";
	} else {
		return value;
	}
}

export function csvToJSON(input: string[], delimiter: string): any[] {
	if (!input || input.length < 2) {
		return [];
	}

	const headerString = input[0];
	const headers = cleanRow(headerString, delimiter);

	const dataStrings = input.slice(1);

	const firstDataRow = cleanRow(dataStrings[0], delimiter);

	if (firstDataRow.length !== headers.length) {
		throw new Error(
			"ошибка: колво колонок с данными не совпадает с заголовками",
		);
	}

	const expectedTypes = []; //типы будут такими для всех колонок (не ток для 1)
	for (let i = 0; i < firstDataRow.length; i++) {
		const type = detectType(firstDataRow[i]);
		expectedTypes.push(type);
	}

	const resultJSON = [];

	for (let rowIndex = 0; rowIndex < dataStrings.length; rowIndex++) {
		const currentRow = cleanRow(dataStrings[rowIndex], delimiter);

		if (currentRow.length !== headers.length) {
			throw new Error(
				`Ошибка: в строке ${rowIndex + 1} неверное количество колонок`,
			);
		}

		const curObject: any = {};

		for (let colIndex = 0; colIndex < headers.length; colIndex++) {
			const cellValue = currentRow[colIndex];
			const headerName = headers[colIndex];
			const expectedType = expectedTypes[colIndex];

			const actualType = detectType(cellValue);
			if (actualType !== expectedType) {
				throw new Error(
					`Ошибка типов в строке ${rowIndex + 1}, в колонке "${headerName}"`,
				);
			}

			curObject[headerName] = convertValue(cellValue, actualType);
		}

		resultJSON.push(curObject);
	}

	return resultJSON;
}
