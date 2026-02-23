import { expect, test } from "vitest";
import { getFirstElement } from "./Element";

test("возвращает первый элемент массива чисел", () => {
	const numbers = [123, 324, 555];
	const result = getFirstElement(numbers);

	expect(result).toBe(123);
});

test("возвращает первый элемент массива строк", () => {
	const strs = ["alo", "priv", "pok"];
	const result = getFirstElement(strs);

	expect(result).toBe("alo");
});

test("возвращает undefined для пустого массива", () => {
	const emptyArr: number[] = [];
	const result = getFirstElement(emptyArr);

	expect(result).toBeUndefined();
});

test("работает с массивом объектов", () => {
	const users = [
		{ id: 1, name: "Alice" },
		{ id: 2, name: "Bob" },
	];
	const result = getFirstElement(users);

	expect(result).toEqual({ id: 1, name: "Alice" });
});
