// 1. тип Transform<T>
// Функция, которая преобразует один массив в другой массив того же типа
export type Transform<T> = (data: T[]) => T[];

// 2. тип Where<T> для фильтра с помощью transform
export type Where<T> = <K extends keyof T>(key: K, value: T[K]) => Transform<T>;

// 3. тип Sort<T> для сортировки с помощью transform
export type Sort<T> = <K extends keyof T>(key: K) => Transform<T>;

// 4. тип Group<T, K>
// группа элементов, объединенных по общему знач ключа K
export type Group<T, K extends keyof T> = {
	key: T[K];
	items: T[];
};

// 5. тип GroupBy<T> для группировки с помощью transform
export type GroupBy<T> = <K extends keyof T>(
	key: K,
) => (data: T[]) => Group<T, K>[];

// 6. тип GroupTransform<T, K>
export type GroupTransform<T, K extends keyof T> = (
	groups: Group<T, K>[],
) => Group<T, K>[];

// 7. тип Having<T> фильтрация групп по предикату, который принимает группу и возвращает true/false
export type Having<T> = <K extends keyof T>(
	predicate: (group: Group<T, K>) => boolean,
) => GroupTransform<T, K>;

// на основе примеров из .pdf:

export function query<T>(...queries: Array<(data: any) => any>) {
	return (data: T[]) => {
		let result: T[] = data;
		for (const q of queries) {
			result = q(result);
		}
		return result;
	};
} //с лекции) но с any

export const where: Where<any> = (key, value) => (data) =>
	data.filter((item) => item[key] === value);

export const sort: Sort<any> = (key) => (data) =>
	[...data].sort((a, b) => {
		const av = a[key];
		const bv = b[key];
		if (av < bv) return -1;
		if (av > bv) return 1;
		return 0;
	});

export const groupBy: GroupBy<any> = (key) => (data) =>
	Object.values(
		data.reduce(
			(acc, item) => {
				const k = item[key] as unknown as string;
				(acc[k] ??= { key: item[key], items: [] }).items.push(item);
				return acc;
			},
			{} as Record<string, Group<any, any>>,
		),
	);

export const having: Having<any> = (predicate) => (groups) =>
	groups.filter(predicate);

// использование
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

const groupAndFilter = query<User>(
	groupBy("city"),
	having<User, "city">((group) => group.items.length > 1),
);
const grouped = groupAndFilter(users);

const pipeline = query<User>(
	where("surname", "Doe"),
	groupBy("city"),
	having<User>((group) => group.items.some((u) => u.age > 34)),
);

//console.log("grouped:", grouped);
console.log("grouped:", JSON.stringify(grouped, null, 2));
const res = pipeline(users);
//console.log("pipeline:", res);
console.log("pipeline:", JSON.stringify(res, null, 2));
