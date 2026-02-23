import { expect, test } from "vitest";
import type Book1 from "./HasId";
import { createBook2, findById } from "./HasId";

const books: Book1[] = [
	{ id: 1, title: "book1", author: "au1", genre: "fiction" },
	{
		id: 2,
		title: "book2",
		author: "au2",
		genre: "non-fiction",
		year: 2027,
	},
	{ id: 3, title: "book3", author: "au3", genre: "fiction" },
];

test("находит книгу по существующему ID", () => {
	const result = findById(books, 2);

	expect(result).toBeDefined();
	expect(result.id).toBe(2);
	expect(result.title).toBe("book2");
	expect(result.genre).toBe("non-fiction");
	expect(result.year).toBe(2027);
});

test("возвращает undefined, если книга не найдена", () => {
	const result = findById(books, 4);

	expect(result).toBeUndefined();
});

test("возвращает undefined для пустого массива", () => {
	const result = findById([], 1);

	expect(result).toBeUndefined();
});

test("выводит что первое нашел", () => {
	const booksWithDuplicates: Book1[] = [
		{ id: 5, title: "first", author: "A", genre: "fiction" },
		{ id: 5, title: "second", author: "B", genre: "fiction" },
	];

	const result = findById(booksWithDuplicates, 5);

	expect(result.title).toBe("first");
});

test("корректно находит книги созданные через createBook2", () => {
	const bookk = createBook2({
		id: 1000,
		title: "A",
		author: "B",
		genre: "fiction",
	});
	const bookkk = createBook2({
		id: 2000,
		title: "C",
		author: "D",
		genre: "non-fiction",
		year: 2024,
	});

	const books = [bookk, bookkk];

	const result = findById(books, 1000);

	expect(result.title).toBe("A");
	expect(result.year).toBe(undefined);
});
