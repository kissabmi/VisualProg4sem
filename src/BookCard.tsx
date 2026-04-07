import { useEffect, useState } from "react";

// пропсы компонента
interface props {
	title: string;
	authors: string[];
	cover: Blob | null;
}

export default function BookCard({ title, authors, cover }: props) {
	const [imgurl, setimgurl] = useState<string | null>(null);

	useEffect(() => {
		// если блоб пришел, делаем из него ссылку
		if (cover) {
			const url = URL.createObjectURL(cover);
			setimgurl(url);

			// убираем за собой чтобы память не текла
			return () => URL.revokeObjectURL(url);
		}
	}, [cover]);

	return (
		<div className="book-card">
			<div className="cover-wrapper">
				{imgurl ? (
					<img src={imgurl} alt={title} className="cover" />
				) : (
					<div className="no-cover">нет обложки</div>
				)}
			</div>
			
			<div className="title">{title}</div>
			<div className="authors">{authors.join(", ")}</div>
		</div>
	);
}
