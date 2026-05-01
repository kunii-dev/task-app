import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Task, CreateTaskInput, UpdateTaskInput } from "../types/task";
import {
    getTasks,
    createTask,
    deleteTaskApi,
    updateTaskApi,
} from "../services/api";
import { ApiFetch } from "../types/api";

type MutationContext = {
    previousTasks: Task[] | undefined;
    optimisticTask?: Task;
};

export const useTasks = (
    token: string | null,
    apiFetch: ApiFetch
) => {

    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const queryClient = useQueryClient();

    const sortTasks = (tasks: Task[]) => {
        return [...tasks].sort((a, b) => Number(a.completed) - Number(b.completed));
    };

    const [filter, setFilter] = useState<
        "all" | "completed" | "incomplete"
    >("all");

    // =========================
    // 取得
    // =========================
    const { data: tasks = [], isLoading, error: queryError } = useQuery<Task[]>({
        queryKey: ["tasks"],
        queryFn: () => getTasks(apiFetch),
        enabled: !!token,
        retry: false,
    });

    useEffect(() => {
        if (queryError) {
        }
    }, [queryError]);

    const filteredTasks = tasks.filter((task) => {
        if (filter === "completed") return task.completed;
        if (filter === "incomplete") return !task.completed;
        return true;
    });

    // =========================
    // 追加
    // =========================
    const addMutation = useMutation<
        Task,
        Error,
        CreateTaskInput,
        MutationContext
    >({
        mutationFn: async (data) => {
            return await createTask(data, apiFetch);
        },

        onMutate: async (newTask) => {
            await queryClient.cancelQueries({ queryKey: ["tasks"] });

            const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

            const optimisticTask: Task = {
                id: Date.now(),
                title: newTask.title,
                completed: false,
            };

            queryClient.setQueryData<Task[]>(
                ["tasks"],
                (old = []) => [optimisticTask, ...old]
            );

            return { previousTasks, optimisticTask };
        },

        onError: (err, newTask, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(
                    ["tasks"],
                    context.previousTasks
                );
            }
            toast.error("タスクの追加に失敗しました");
        },

        onSuccess: (createdTask, _, context) => {
            queryClient.setQueryData<Task[]>(
                ["tasks"],
                (old = []) =>
                    old.map((task) =>
                        task.id === context?.optimisticTask?.id
                            ? createdTask
                            : task
                    )
            );
            toast.success("タスクを追加しました");
        },
    });

    const handleAdd = (text: string) => {
        if (!text.trim()) return;

        addMutation.mutate({
            title: text,
            completed: false,
        });
    };

    // =========================
    // 削除
    // =========================
    const deleteMutation = useMutation<
        void,
        Error,
        number,
        MutationContext
    >({
        mutationFn: async (id) => {
            return await deleteTaskApi(id, apiFetch);
        },

        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ["tasks"] });

            const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

            queryClient.setQueryData<Task[]>(
                ["tasks"],
                (old = []) => old.filter((task) => task.id !== id)
            );

            return { previousTasks };
        },

        onError: (err, id, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(
                    ["tasks"],
                    () => context.previousTasks
                );
            }
            toast.error("タスクの削除に失敗しました");
        },

        onSuccess: () => {
            toast.success("タスクを削除しました");
        },
    });

    const handleDelete = (id: number) => {

        setDeletingId(id);

        deleteMutation.mutate(id, {
            onSettled: () => {
                setDeletingId(null);
            },
        });
    };

    // =========================
    // 更新
    // =========================
    const updateMutation = useMutation<
        Task,
        Error,
        { id: number; data: Partial<Task> },
        MutationContext
    >({
        mutationFn: async ({ id, data }) => {
            return await updateTaskApi(id, data, apiFetch);
        },

        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: ["tasks"] });

            const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

            queryClient.setQueryData<Task[]>(
                ["tasks"],
                (old = []) => old.map((task) =>
                    task.id === variables.id
                        ? { ...task, ...variables.data }
                        : task
                )
            );

            return { previousTasks };
        },

        onError: (err, variables, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(
                    ["tasks"],
                    () => context.previousTasks
                );
            }
            toast.error("タスクの更新に失敗しました");
        },

        onSuccess: (serverTask) => {
            queryClient.setQueryData<Task[]>(
                ["tasks"],
                (old = []) =>
                    old.map((task) =>
                        task.id === serverTask.id ? serverTask : task
                    )
            );
            toast.success("タスクを更新しました");
        },
    });

    const handleUpdate = (id: number, title: string) => {
        if (!title.trim()) return;

        updateMutation.mutate({
            id,
            data: { title },
        });
    };

    // =========================
    // トグル
    // =========================
    const toggleMutation = useMutation<
        Task,
        Error,
        { id: number; completed: boolean },
        MutationContext
    >({
        mutationFn: async ({ id, completed }) => {
            return await updateTaskApi(id, { completed }, apiFetch);
        },

        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: ["tasks"] });

            const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

            queryClient.setQueryData<Task[]>(
                ["tasks"],
                (old = []) => old.map((task) =>
                    task.id === variables.id
                        ? { ...task, completed: variables.completed }
                        : task
                )
            );

            return { previousTasks };
        },

        onError: (err, variables, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(
                    ["tasks"],
                    context.previousTasks
                );
            }
            toast.error("タスクの更新に失敗しました");
        },

        onSuccess: (serverTask) => {
            console.log(serverTask);
            queryClient.setQueryData<Task[]>(
                ["tasks"],
                (old = []) =>
                    old.map((task) =>
                        task.id === serverTask.id ? serverTask : task
                    )
            );
        },
    });

    const handleToggle = (task: Task) => {
        setError(null);

        toggleMutation.mutate({
            id: task.id,
            completed: !task.completed,
        });
    };

    return {
        tasks: sortTasks(filteredTasks),
        loading: isLoading,
        error,
        deletingId,
        handleAdd,
        handleDelete,
        handleUpdate,
        handleToggle,
        filter,
        setFilter,
        isAdding: addMutation.isPending,
    };
};