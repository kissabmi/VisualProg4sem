import { useState, useMemo } from "react";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import { SearchFilter } from "./components/SearchFilter";
import type { Task, FilterType } from "./task";

export function App() {
	const [tasks, setTasks] = useState<Task[]>([
		{
			id: 1,
			name: "выучить react+ts",
			description: "изучить основы react с typescript",
			status: false,
		},
		{
			id: 2,
			name: "сделать todolist",
			description: "реализовать приложение со всем функционалом",
			status: false,
		},
	]);

	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState<FilterType>("all");

	// добавление задачи
	function addTask(name: string, description: string) {
		const newTask: Task = {
			id: Date.now(), // время в милисекундах от 1970г
			name,
			description,
			status: false,
		};
		setTasks((prev) => [...prev, newTask]);
	}

	// удаление задачи
	function deleteTask(id: number) {
		setTasks((prev) => prev.filter((t) => t.id !== id));
	}

	// переключение статуса
	function toggleTask(id: number) {
		setTasks((prev) =>
			prev.map((t) => (t.id === id ? { ...t, status: !t.status } : t))
		);
	}

	// фильтрация + поиск
	const filteredTasks = useMemo(() => {
		let result = tasks;

		// фильтр по статусу
		if (filter === "done") {
			result = result.filter((t) => t.status);
		} else if (filter === "notDone") {
			result = result.filter((t) => !t.status);
		}

		// поиск по названию и описанию
		if (search.trim() !== "") {
			const query = search.toLowerCase();
			result = result.filter(
				(t) =>
					t.name.toLowerCase().includes(query) ||
					t.description.toLowerCase().includes(query)
			);
		}

		return result;
	}, [tasks, filter, search]);

	// статистика
	const doneCount = tasks.filter((t) => t.status).length;
	const todoCount = tasks.length - doneCount;

	return (
		<div className="app">
			<header>
				<h1>todolist</h1>
				<div>
					<span>всего: {tasks.length} | </span>
					<span>выполнено: {doneCount} | </span>
					<span>осталось: {todoCount}</span>
				</div>
			</header>

			<TaskForm addTask={addTask} />

			<SearchFilter
				search={search}
				onSearchChange={setSearch}
				filter={filter}
				onFilterChange={setFilter}
			/>

			<TaskList
				tasks={filteredTasks}
				deleteTask={deleteTask}
				toggleTask={toggleTask}
			/>
		</div>
	);
}
