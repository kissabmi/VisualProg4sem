export interface Task {
	id: number;
	name: string;
	description: string;
	status: boolean;
}

export type FilterType = "all" | "done" | "notDone";
