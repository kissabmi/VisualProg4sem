import { expect, test } from "vitest";
import { capitalizeFirst, spaceDelete } from "./StringFormatter";

test("capitalizeFirst делает первую букву заглавной", () => {
	expect(capitalizeFirst("hello")).toBe("Hello");
});

test("capitalizeFirst с флагом uppercase делает всю строку заглавной", () => {
	expect(capitalizeFirst("hello", true)).toBe("HELLO");
});

test("spaceDelete удаляет пробелы по краям", () => {
	expect(spaceDelete("  hi  ")).toBe("hi");
});

test("spaceDelete с флагом uppercase удаляет пробелы и делает заглавными", () => {
	expect(spaceDelete("  hi  ", true)).toBe("HI");
});
