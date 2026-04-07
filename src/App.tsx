import { useEffect, useState } from "react";
import BookCard from "./BookCard";

// тип ответа от api
interface bookdata {
	id: number;
	title: string;
	isbn: string;
	pageCount: number;
	authors: string[];
}

// то как будем хранить у себя
export interface book {
	id: number;
	title: string;
	authors: string[];
	coverblob: Blob | null;
}

export function App() {
	const [books, setbooks] = useState<book[]>([]);
	const [loading, setloading] = useState(true);

	useEffect(() => {
		// основная функция загрузки
		async function loadbooks() {
			try {
				// берем список книг
				const res = await fetch("https://fakeapi.extendsclass.com/books");
				const data: bookdata[] = await res.json();

				// параллельно качаем все обложки
				const promises = data.map(async (item) => {
					let blob: Blob | null = null;

					try {
						// ищем по isbn
						const gres = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${item.isbn}`);
						const gdata = await gres.json();

						// если нашли картинку
						if (gdata.items && gdata.items[0]?.volumeInfo?.imageLinks?.thumbnail) {
							// фикс на всякий случай для https
							const thumburl = gdata.items[0].volumeInfo.imageLinks.thumbnail.replace("http:", "https:");
							
							// грузим картинку (blob) через прокси из-за cors
							const proxyurl = "https://api.allorigins.win/raw?url=" + encodeURIComponent(thumburl);
							const imgres = await fetch(proxyurl);
							if (imgres.ok) {
								blob = await imgres.blob();
							}
						}
					} catch (e) {
						// если че пошло не так, просто пропускаем
						console.error("косяк с обложкой " + item.title, e);
					}

					return {
						id: item.id,
						title: item.title,
						authors: item.authors || [],
						coverblob: blob,
					};
				});

				const result = await Promise.all(promises);
				setbooks(result);
			} catch (e) {
				console.error("вообще ничего не загрузилось", e);
			} finally {
				setloading(false);
			}
		}

		loadbooks();
	}, []);

	if (loading) {
		return <div style={{ padding: "20px" }}>грузим книжки...</div>;
	}

	return (
		<div className="books-container">
			{books.length === 0 && <div>книг нет :(</div>}
			{books.map((b) => (
				<BookCard
					key={b.id}
					title={b.title}
					authors={b.authors}
					cover={b.coverblob}
				/>
			))}
		</div>
	);
}
