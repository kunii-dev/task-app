import { Task } from '../types/task';

export const fetchTasks = async (): Promise<Task[]> => {
    const res = await fetch('/api/tasks');
    return res.json();
};

export const updateTask = async (task: Task): Promise<Task> => {
    const res = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        body: JSON.stringify(task),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return res.json();
};