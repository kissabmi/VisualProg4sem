import { expect, test } from "vitest";
import { calculateArea } from "./Area.js";

test("Calculate area circle", () => {
	expect(calculateArea("circle", 1)).toBe(Math.PI);
});

test("Calculate area square", () => {
	expect(calculateArea("square", 25)).toBe(625);
});
