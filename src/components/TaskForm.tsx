import { useState } from "react";

interface TaskFormProps {
	addTask: (name: string, description: string) => void;
}

export function TaskForm({ addTask }: TaskFormProps) {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");

	// нажатие на кнопку добавить задачу
	function handleSubmit(event: React.FormEvent) {
		event.preventDefault();

		if (name.trim() === "" || description.trim() === "") {
			alert("заполните все поля!");
			return;
		}

		addTask(name.trim(), description.trim());

		setName("");
		setDescription("");
	}

	return (
		<div className="task-form">
			<h3>добавить задачу</h3>
			<form onSubmit={handleSubmit}>
				<div>
					<input
						type="text"
						placeholder="название задачи..."
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				</div>
				<div>
					<input
						type="text"
						placeholder="описание задачи..."
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
				</div>
				<button type="submit">добавить</button>
			</form>
		</div>
	);
}
