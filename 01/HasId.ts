interface HasId {
	id: number;
}

function findById<T extends HasId>(items: T[], id: number): T | undefined {
	for (const item of items) {
		if (item.id === id) return item;
	}
	return undefined;
}

interface Book1 extends HasId {
	id: number;
	title: string;
	author: string;
	year?: number;
	genre: "fiction" | "non-fiction";
}

function createBook2(book: Book1): Book1 {
	return { ...book };
}

const firstBook1: Book1 = createBook2({
	title: "title1",
	author: "zxcat",
	genre: "fiction",
	id: 3,
});

const secondBook2: Book1 = createBook2({
	title: "dota3",
	author: "me",
	year: 2030,
	genre: "non-fiction",
	id: 1,
});

const books2 = [firstBook1, secondBook2];

for (let index = 0; index < 5; index++) {
	console.log(findById(books2, index));
}
