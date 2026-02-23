import { expect, test } from "vitest";
import { createUser } from "./User.js";

test("createUser with 3 params", () => {
	expect(createUser(1, "chel", "pochta")).toStrictEqual({
		id: 1,
		name: "chel",
		email: "pochta",
		isActive: true,
	});
});

test("createUser with 2 params", () => {
	expect(createUser(10, "chel2")).toStrictEqual({
		id: 10,
		name: "chel2",
		email: undefined,
		isActive: true,
	});
});
