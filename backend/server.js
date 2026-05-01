import dotenv from "dotenv";
dotenv.config();

console.log("🔥 server.js loaded");

import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import tasksRoutes from "./routes/tasks.js"; // ←追加🔥
import pool from "./db.js";
import { authMiddleware } from "./middleware/auth.js";

console.log("🔥 authRoutes:", authRoutes);

const app = express();

// ✅ CORS（フロント接続用）
app.use(cors({
  origin: "https://task-app-frontend-lrgl.onrender.com",
  credentials: true,
}));

app.use(express.json());

// ✅ ルーティング
app.use("/api", authRoutes);
app.use("/api", tasksRoutes); // ←追加🔥

// ===== root =====
app.get("/", (req, res) => {
  res.send("OK");
});

// ===== DBテスト =====
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (err) {
    console.error("💥 DBエラー:", err);
    res.status(500).json({ error: "DB接続失敗" });
  }
});

// ===== /me（ログインユーザー取得） =====
app.get("/api/me", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, email FROM users WHERE id = $1",
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "ユーザーが見つかりません" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("💥 /meエラー:", err);
    res.status(500).json({ error: "DB error" });
  }
});

// ===== サーバー起動 =====
const PORT = process.env.PORT || 10000; // ←本番対応🔥
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});