import { describe, expect, it } from "vitest";
import { cleanRow, convertValue, csvToJSON, detectType } from "./firstFunction";

import test = require("node:test");

describe("helper functions", () => {
	it("cleanRow should split and trim data", () => {
		expect(cleanRow(" a , b , c ", ",")).toEqual(["a", "b", "c"]);
	});

	it("detectType should works correctly with 3 types of data", () => {
		expect(detectType("true")).toBe("boolean");
		expect(detectType("false")).toBe("boolean");
		expect(detectType("123")).toBe("number");
		expect(detectType("0.5")).toBe("number");
		expect(detectType("foo")).toBe("string");
	});

	it("convertValue converts according to provided type", () => {
		expect(convertValue("123", "number")).toBe(123);
		expect(convertValue("true", "boolean")).toBe(true);
		expect(convertValue("x", "string")).toBe("x");
	});
});

describe("csvToJSON func", () => {
	it("parses a small csv into objects (values stay strings with current type detection)", () => {
		const input = ["a,b", "1,2"];
		expect(csvToJSON(input, ",")).toEqual([{ a: 1, b: 2 }]);
	});

	it("throws when data row has wrong number of columns", () => {
		const input = ["a,b", "1"];

		expect(() => csvToJSON(input, ",")).toThrow();
	});

	it("throws when data row has diff type", () => {
		const input = ["a,b", "1,2", "3,a"];

		expect(() => csvToJSON(input, ",")).toThrow();
	});

	it("same(pochti) as example", () => {
		const res = csvToJSON(["p1;p2;p3;p4", "1;A;b;c", "2;B;v;d"], ";");
		const expected = [
			{
				p1: 1,
				p2: "A",
				p3: "b",
				p4: "c",
			},
			{
				p1: 2,
				p2: "B",
				p3: "v",
				p4: "d",
			},
		];
		expect(res).toEqual(expected);
	});
});
