interface Book {
	title: string;
	author: string;
	year?: number;
	genre: "fiction" | "non-fiction";
}

function createBook(book: Book): Book {
	return { ...book };
}

const firstBook: Book = createBook({
	title: "title1",
	author: "zxcat",
	genre: "fiction",
});

const secondBook: Book = createBook({
	title: "dota3",
	author: "me",
	year: 2030,
	genre: "non-fiction",
});

const books = [firstBook, secondBook];

for (let index = 0; index < books.length; index++) {
	console.log(books[index].year);
}
