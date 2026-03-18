export type Transform<T> = (data: T[]) => T[];

export type Group<T, K extends keyof T> = {
	key: T[K];
	items: T[];
};

export type GroupTransform<T, K extends keyof T> = (
	groups: Group<T, K>[],
) => Group<T, K>[];

// 1.type Branding
//добавляем фиктивное поле __op, чтобы TypeScript мог отличать функции на этапе компиляции.
export type WhereTransform<T> = Transform<T> & { readonly __op?: "W" };
export type GroupByTransform<T, K extends keyof T> = ((
	data: T[],
) => Group<T, K>[]) & { readonly __op?: "G" };
export type HavingTransform<T, K extends keyof T> = GroupTransform<T, K> & {
	readonly __op?: "H";
};
export type SortTransform<T> = Transform<T> & { readonly __op?: "S" };

//обновленные типы создателей операций
export type Where<T> = <K extends keyof T>(
	key: K,
	value: T[K],
) => WhereTransform<T>;
export type Sort<T> = <K extends keyof T>(key: K) => SortTransform<T>;
export type GroupBy<T> = <K extends keyof T>(key: K) => GroupByTransform<T, K>;
export type Having<T> = <K extends keyof T>(
	predicate: (group: Group<T, K>) => boolean,
) => HavingTransform<T, K>;

// 2. реализация операций (с приведением типов)
export const where: Where<any> = (key, value) =>
	((data: any[]) =>
		data.filter((item) => item[key] === value)) as WhereTransform<any>;

export const sort: Sort<any> = (key) =>
	((data: any[]) =>
		[...data].sort((a, b) => {
			const av = a[key];
			const bv = b[key];
			if (av < bv) return -1;
			if (av > bv) return 1;
			return 0;
		})) as SortTransform<any>;

export const groupBy: GroupBy<any> = (key) =>
	((data: any[]) =>
		Object.values(
			data.reduce((acc: Record<string, Group<any, any>>, item: any) => {
				const k = String(item[key]);
				(acc[k] ??= { key: item[key], items: [] }).items.push(item);
				return acc;
			}, {}),
		)) as GroupByTransform<any, any>;

export const having: Having<any> = (predicate) =>
	((groups: any[]) => groups.filter(predicate)) as HavingTransform<any, any>;

// 3. система типов для строгого порядка операций. правило: Where -> GroupBy -> Having -> Sort

// утилита для декартова произведения при добавлении в кортеж
type Append<Acc extends string[], Next extends string> = Acc extends any
	? Next extends any
		? [...Acc, Next]
		: never
	: never;

//какие операторы после текущего
type NextOp<O extends string> = O extends "W"
	? "W" | "G" | "H" | "S"
	: O extends "G"
		? "G" | "H" | "S"
		: O extends "H"
			? "H" | "S"
			: O extends "S"
				? "S"
				: never;

//генерируем валидные последовательности до длины Len
type BuildSeq<Len extends number, Acc extends string[] = []> = Acc extends any
	? Acc["length"] extends Len
		? Acc
		: Acc extends []
			? BuildSeq<Len, Append<Acc, "W" | "G" | "H" | "S">>
			: Acc extends [...any[], infer Last extends string]
				? BuildSeq<Len, Append<Acc, NextOp<Last>>>
				: never
	: never;
//массив символов->массив реальных типов функций
type MapOp<T, O extends string> = O extends "W"
	? WhereTransform<T>
	: O extends "G"
		? GroupByTransform<T, any>
		: O extends "H"
			? HavingTransform<T, any>
			: O extends "S"
				? SortTransform<T>
				: never;

type MapTuple<T, Tup extends string[]> = Tup extends []
	? []
	: Tup extends [infer First extends string, ...infer Rest extends string[]]
		? [MapOp<T, First>, ...MapTuple<T, Rest>]
		: never;

//распределяем маппинг по всему объединению (Union) сгенерированных кортежей
type MapUnion<T, Tup extends string[]> = Tup extends any
	? MapTuple<T, Tup>
	: never;

//объединяем все правильные кортежи (до 6 операций, хватит для любых тестов(наверно))
export type ValidPipeline<T> =
	| []
	| MapUnion<T, BuildSeq<1>>
	| MapUnion<T, BuildSeq<2>>
	| MapUnion<T, BuildSeq<3>>
	| MapUnion<T, BuildSeq<4>>
	| MapUnion<T, BuildSeq<5>>
	| MapUnion<T, BuildSeq<6>>;

// 4. функция query. принимает только правильные последовательности
export function query<T>(...queries: ValidPipeline<T>) {
	return (data: T[]): any => {
		let result: any = data;
		for (const q of queries) {
			result = (q as any)(result);
		}
		return result;
	};
}
