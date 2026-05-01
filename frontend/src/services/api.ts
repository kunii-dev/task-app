import { Task, CreateTaskInput, UpdateTaskInput } from "../types/task";
import { ApiFetch } from "../types/api";

const API_BASE = "https://task-app-backend-1f16.onrender.com/api"; // 共通
const TASKS_URL = `${API_BASE}/tasks`;          // タスク専用

// =========================
// 一覧取得
// =========================
export const getTasks = async (
    apiFetch: ApiFetch
): Promise<Task[]> => {
    try {
        const res = await apiFetch(TASKS_URL);

        if (!res.ok) {
            throw new Error("取得失敗");
        }

        const data = await res.json();
        return data.rows ?? data;

    } catch (error) {
        throw new Error("ネットワークエラー");
    }
};

// =========================
// 追加
// =========================
export const createTask = async (
    data: CreateTaskInput,
    apiFetch: ApiFetch
): Promise<Task> => {
    try {
        const res = await apiFetch(TASKS_URL, {
            method: "POST",
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            throw new Error("追加失敗");
        }

        return res.json();
    } catch (error) {
        // 🔥 ここが重要
        throw new Error("ネットワークエラー");
    }
};

// =========================
// 削除
// =========================
export const deleteTaskApi = async (
    id: number,
    apiFetch: ApiFetch
): Promise<void> => {
    try {
        const res = await apiFetch(`${TASKS_URL}/${id}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            throw new Error("削除失敗");
        }
    } catch {
        throw new Error("ネットワークエラー")
    }
};

// =========================
// 更新
// =========================
export const updateTaskApi = async (
    id: number,
    data: UpdateTaskInput,
    apiFetch: ApiFetch
): Promise<Task> => {
    try {
        const res = await apiFetch(`${TASKS_URL}/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            throw new Error("更新失敗");
        }

        return res.json();
    } catch (error) {
        // 🔥 ここが重要
        throw new Error("ネットワークエラー");
    }
};

// =========================
// 完了切替
// =========================
export const toggleTaskApi = async (
    id: number,
    apiFetch: ApiFetch
): Promise<Task> => {
    try {
        const res = await apiFetch(`${TASKS_URL}/${id}/toggle`, {
            method: "PATCH",
        });

        if (!res.ok) {
            throw new Error("更新失敗");
        }

        return res.json();
    } catch (error) {
        // 🔥 ここが重要
        throw new Error("ネットワークエラー");
    }
};

// =========================
// /me API
// =========================
export const getMe = async (
    apiFetch: ApiFetch
) => {
    try {
        const res = await apiFetch(`${API_BASE}/me`);

        if (!res.ok) {
            throw new Error("ユーザー取得失敗");
        }

        return res.json();
    } catch (error) {
        // 🔥 ここが重要
        throw new Error("ネットワークエラー");
    }
};