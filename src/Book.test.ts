import { expect, test } from "vitest";
import { createBook } from "./Book";

test("createBook создаёт правильный Book", () => {
	const book = createBook({
		title: "title1",
		author: "zxcat",
		genre: "fiction",
	});

	expect(book).toHaveProperty("title", "title1");
	expect(book).toHaveProperty("author", "zxcat");
	expect(book).toHaveProperty("genre", "fiction");

	//по полной структуре
	expect(book).toStrictEqual({
		title: "title1",
		author: "zxcat",
		genre: "fiction",
	});
});

test("createBook", () => {
	const input = { title: "title1", author: "zxcat", genre: "fiction" };
	const book1 = createBook(input);
	const book2 = createBook(input);

	expect(book1).not.toBe(book2);
	expect(book1).toStrictEqual(book2);
});
