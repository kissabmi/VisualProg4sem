# Typescript задание 4

**Задание выполняется в ветке** `lab4`

## Задание

1. Тип Transform<T>
Описать тип Transform<T>, каждый объект которого представляет собой функцию, которая принимает
массив T[] и возвращает новый массив T[].

2. Тип Where<T>
Описать тип Where<T>, каждый объект которого представляет собой функцию, которая:
параметризована типом T (объект) и K — одним из ключей этого объекта;
принимает:
  - key — имя поля объекта (K),
  - value — значение того же типа, что и поле T[K];
возвращает Transform<T>, то есть функцию, фильтрующую массив объектов T.

3. Тип Sort<T>
Описать тип Sort<T>, каждый объект которого представляет собой функцию, которая:
параметризована типом T и ключом K объекта;
принимает key — имя поля в объекте T;
возвращает Transform<T>, то есть функцию, которая сортирует массив объектов T по этому
полю.

4. Тип Group<T, K>
Описать тип Group<T, K>, каждый объект которого представляет собой объект, описывающий одну
группу:
  - key — значение поля K (например, конкретный city или userId);
  - items — массив всех элементов T, которые попали в эту группу.

5. Тип GroupBy<T>
Описать тип GroupBy<T>, каждый объект которого представляет собой функцию, которая:
параметризована типом T и ключом K объекта;
принимает key — поле, по которому мы группируем ("city", "userId" и т.п.);
возвращает Transform<Group<T, K>>, то есть функцию, которая превращает массив T[] в
массив групп Group<T, K>[] (каждая — со своим значением ключа и списком элементов).

6. Тип GroupTransform<T, K>
Описать тип GroupTransform<T, K>, каждый объект которого представляет собой функцию, которая
работает уже не с отдельными объектами T, а с массивом групп по ключу K и возвращает новый массив
таких же групп (например, отфильтрованных или переупорядоченных).

7. Тип Having<T>
Описать тип Having<T>, каждый объект которого представляет собой функцию, которая:
параметризована типом T и ключом K;
принимает predicate — предикат, который получает одну группу Group<T, K> и возвращает
true/false (оставить или отбросить эту группу);
возвращает GroupTransform<T, K>, то есть функцию, которая фильтрует массив групп по этому
предикату.

8. Функция query
Реализовать функцию query, которая принимает переменное количество шагов (where: Where<T>, sort:
Sort<T>, groupBy: GroupBy<T>, having: Having<T>) и возвращает одну функцию типа Transform<T>.
Требования к query:
1. query должна принимать произвольное количество шагов, которые являются функциями вида
Transform<…> или GroupTransform<…>.
2. query(...) возвращает функцию, принимающую данные первого шага и последовательно
прогоняющую их через все переданные шаги.

Например:

Дано:

```ts
type User = {
 id: number;
 name: string;
 surname: string;
 age: number;
 city: string;
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
  { id: 1, name: "John", surname: "Doe", age: 34, city: "NY" },
  { id: 2, name: "John", surname: "Doe", age: 33, city: "NY" },
  { id: 3, name: "John", surname: "Doe", age: 35, city: "LA" },
  { id: 4, name: "Mike", surname: "Doe", age: 35, city: "LA" },
];
```

Фильтрация и сортировка

```ts
const where: Where<User> =
 (key, value) =>
 (data) =>
 data.filter((item) => item[key] === value);
const sort: Sort<User> =
 (key) =>
 (data) =>
 [...data].sort((a, b) => {
 const av = a[key];
 const bv = b[key];
 if (av < bv) return -1;
 if (av > bv) return 1;
 return 0;
 });
const search = query<User>(
 where("name", "John"),
 where("surname", "Doe"),
 sort("age"),
);
const result = search(users);
/*
result: User[] = [
 { id: 2, name: "John", surname: "Doe", age: 33, city: "NY" },
 { id: 1, name: "John", surname: "Doe", age: 34, city: "NY" },
 { id: 3, name: "John", surname: "Doe", age: 35, city: "LA" },
]
*/
```

Группировка и фильтр по группам

```ts
const groupBy: GroupBy<User> =
 (key) =>
 (data) =>
 Object.values(
 data.reduce((acc, item) => {
 const k = item[key] as unknown as string;
 (acc[k] ??= { key: item[key], items: [] }).items.push(item);
 return acc;
 }, {} as Record<string, Group<User, typeof key>>),
 );
const having: Having<User> =
 (predicate) =>
 (groups) =>
 groups.filter(predicate);
const groupAndFilter = query<User>(
 groupBy("city"),
 having<User>((group) => group.items.length > 1),
);
const grouped = groupAndFilter(users);
/*
grouped: Array<{
 key: string; // city
 items: User[];
}>
*/
```

Комбинированный конвейер

```ts
const pipeline = query<User>(
 where("surname", "Doe"),
 groupBy("city"),
 having<User>(
 (group) => group.items.some((u) => u.age > 34)
 ),
);
const res = pipeline(users);
```
