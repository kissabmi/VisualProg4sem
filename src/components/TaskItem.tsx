import type { Task } from "../task";

interface TaskItemProps {
	task: Task;
	deleteTask: (id: number) => void;
	toggleTask: (id: number) => void;
}

export function TaskItem({ task, deleteTask, toggleTask }: TaskItemProps) {
	return (
		<div className={`task-item ${task.status ? "done" : ""}`}>
			<label>
				<input
					type="checkbox"
					checked={task.status}
					onChange={() => toggleTask(task.id)}
				/>
				<span> статус выполнения</span>
			</label>

			<div className="task-content">
				<div className="task-name" style={{ fontWeight: "bold" }}>{task.name}</div>
				<div>{task.description}</div>
			</div>

			<button onClick={() => deleteTask(task.id)}>
				удалить
			</button>
		</div>
	);
}
