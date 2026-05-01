import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import pool from "../db.js";

const router = express.Router();

// ===== タスク取得 =====
router.get("/tasks", authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM tasks WHERE user_id = $1 ORDER BY completed ASC, id DESC",
            [req.user.id]
        );

        res.json(result.rows);
    } catch (err) {
        console.error("取得エラー:", err);
        res.status(500).json({ error: "DB error" });
    }
});

// ===== タスク追加 =====
router.post("/tasks", authMiddleware, async (req, res) => {
    try {
        console.log("BODY:", req.body);
        console.log("USER:", req.user);

        const { title } = req.body;

        if (!title) {
            return res.status(400).json({ error: "タイトル必須" });
        }

        const result = await pool.query(
            "INSERT INTO tasks (title, completed, user_id) VALUES ($1, false, $2) RETURNING *",
            [title, req.user.id]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error("追加エラー:", err);
        res.status(500).json({ error: "DB error" });
    }
});

// ===== タスク削除 =====
router.delete("/tasks/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *",
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "タスクが見つかりません" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error("削除エラー:", err);
        res.status(500).json({ error: "DB error" });
    }
});

// ===== タスク更新 =====
router.put("/tasks/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, completed } = req.body;

        const result = await pool.query(
            `
            UPDATE tasks
            SET 
                title = COALESCE($1, title),
                completed = COALESCE($2, completed)
            WHERE id = $3 AND user_id = $4
            RETURNING *;
            `,
            [title, completed, id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "タスクが見つかりません" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error("更新エラー:", err);
        res.status(500).json({ error: "DB error" });
    }
});

// ===== 完了切り替え =====
router.patch("/tasks/:id/toggle", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `
            UPDATE tasks
            SET completed = NOT completed
            WHERE id = $1 AND user_id = $2
            RETURNING *;
            `,
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "タスクが見つかりません" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error("toggleエラー:", err);
        res.status(500).json({ error: "DB error" });
    }
});

export default router;