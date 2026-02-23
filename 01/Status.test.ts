import { expect, test } from "vitest";
import type Status from "./Status";
import { getStatusColor } from "./Status";

// Тест для каждого возможного значения union-типа Status
test.each<[string, status]>([
	["blue", "active"],
	["black", "inactive"],
	["gold", "new"],
])("возвращает '%s' для статуса '%s'", (expectedColor, status) => {
	const result = getStatusColor(status);
	expect(result).toBe(expectedColor);
});

test("должен принимать только допустимые статусы", () => {
	const allStatuses: Status[] = ["active", "inactive", "new"];

	allStatuses.forEach((status) => {
		const color = getStatusColor(status);
		expect(typeof color).toBe("string");
		expect(color.length).toBeGreaterThan(0);
	});
});
