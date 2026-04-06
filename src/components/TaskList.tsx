import type { Task } from "../task";
import { TaskItem } from "./TaskItem";

interface TaskListProps {
	tasks: Task[];
	deleteTask: (id: number) => void;
	toggleTask: (id: number) => void;
}

export function TaskList({ tasks, deleteTask, toggleTask }: TaskListProps) {
	if (tasks.length === 0) {
		return (
			<div>
				<p>задач пока нет или ничего не найдено</p>
			</div>
		);
	}

	return (
		<div>
			{tasks.map((item) => (
				<TaskItem
					key={item.id}
					task={item}
					deleteTask={deleteTask}
					toggleTask={toggleTask}
				/>
			))}
		</div>
	);
}
