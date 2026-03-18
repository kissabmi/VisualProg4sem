import { describe, expect, test } from "vitest";
import { type Group, groupBy, having, query, sort, where } from "./lab4.js";

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
	{ id: 3, name: "John", surname: "Doe", age: 35, city: "LA" },
	{ id: 4, name: "Mike", surname: "Doe", age: 35, city: "LA" },
];

describe("Tests", () => {
	test("1. where + sort", () => {
		const search = query<User>(
			where("name", "John"),
			where("surname", "Doe"),
			sort("age"),
		);
		const result = search(users) as User[]; //приводим тип, так как query возвращает any

		expect(result).toHaveLength(3);
		//проверяем правильность сортировки по возрасту (33, 34, 35)
		expect(result[0].id).toBe(2);
		expect(result[1].id).toBe(1);
		expect(result[2].id).toBe(3);
	});

	test("2. groupBy", () => {
		const grouper = query<User>(groupBy("city"));
		const result = grouper(users) as Group<User, "city">[];

		expect(result).toHaveLength(2);

		const nyGroup = result.find((g) => g.key === "NY");
		const laGroup = result.find((g) => g.key === "LA");

		expect(nyGroup).toBeDefined();
		expect(nyGroup?.items).toHaveLength(2);

		expect(laGroup).toBeDefined();
		expect(laGroup?.items).toHaveLength(2);
	});

	test("3. groupBy + having", () => {
		const groupAndFilter = query<User>(
			groupBy("city"),
			having<User>((group) => group.items.length > 1),
		);
		const result = groupAndFilter(users) as Group<User, "city">[];

		expect(result).toHaveLength(2); // обе группы должны остаться

		//тест на отсечение группы
		const strictFilter = query<User>(
			groupBy("city"),
			having<User>((group) => group.items.length > 2), //групп с >2 элементами нет
		);
		const emptyResult = strictFilter(users) as Group<User, "city">[];

		expect(emptyResult).toHaveLength(0);
	});

	test("4. where + groupBy + having", () => {
		const pipeline = query<User>(
			where("surname", "Doe"),
			groupBy("city"),
			having<User>((group) => group.items.some((u) => u.age > 34)),
		);

		const res = pipeline(users) as Group<User, "city">[];

		//в NY максимальный возраст 34 (<34) поэтому группа NY рип
		//в LA есть возраст 35, группа LA остается
		expect(res).toHaveLength(1);
		expect(res[0].key).toBe("LA");
		expect(res[0].items).toHaveLength(2);
	});
});
