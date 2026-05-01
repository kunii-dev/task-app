export type Task = {
    id: number;
    title: string;
    completed: boolean;
};

// 追加用
export type CreateTaskInput = {
    title: string;
    completed: boolean;
};

// 更新用
export type UpdateTaskInput = Partial<Pick<Task, "title" | "completed">>;