import type { Task } from "../task";

interface TaskItemProps {
	task: Task;
}

export function TaskItem(props: TaskItemProps){
    const task = props.task;
    return (
        <div style = {{border: "1px solid black", margin: "8px", padding: "8px"}}>
            <h3>
                {/*пока только показывает статус*/}
            </h3>
            <p>{task.description}</p>
        </div>
    );

}
