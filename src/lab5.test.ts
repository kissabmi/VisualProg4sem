import { describe, expect, expectTypeOf, test } from "vitest";
import { groupBy, having, query, sort, where } from "./lab5";

type User = {
	id: number;
	name: string;
	surname: string;
	age: number;
	city: string;
};

const users: User[] = [
	{ id: 1, name: "John", surname: "Doe", age: 34, city: "NY" },
	{ id: 2, name: "John", surname: "Doe", age: 33, city: "NY" },
	{ id: 3, name: "Mike", surname: "Smith", age: 35, city: "LA" },
];

describe("State Machine Type System", () => {
	test("1. Правильные последовательности компилируются и работают", () => {
		const p1 = query<User>(where("name", "John"), sort("age"));
		expect(p1(users)).toHaveLength(2);

		const p2 = query<User>(
			groupBy("city"),
			having<User>((g) => g.items.length > 0),
		);
		expect(p2(users)).toHaveLength(2);

		const p3 = query<User>(
			where("surname", "Doe"),
			groupBy("city"),
			having<User>((g) => g.items.some((u) => u.age > 30)),
			sort("key"),
		);
		expect(p3(users)).toHaveLength(1);

		expectTypeOf(p1).toBeFunction();
	});

	test("компилятор ДОЛЖЕН выдавать ошибки при нарушении порядка", () => {
		// @ts-expect-error
		query<User>(sort("age"), where("name", "John"));

		// @ts-expect-error
		query<User>(
			having<User>((g) => true),
			groupBy("city"),
		);

		// @ts-expect-error
		query<User>(groupBy("city"), where("name", "John"));

		// @ts-expect-error
		query<User>(
			sort("age"),
			having<User>((g) => true),
		);

		// @ts-expect-error
		query<User>(
			where("name", "John"),
			groupBy("city"),
			having<User>((g) => true),
			where("age", 34),
		);
	});
});
