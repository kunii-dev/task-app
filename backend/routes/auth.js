// routes/auth.js

import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js";

const router = express.Router();

const SECRET = "mysecret";

// ■ register
router.post("/register", async (req, res) => {
    const { email, password } = req.body;

    try {
        const hashed = await bcrypt.hash(password, 10);

        const result = await pool.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
            [email, hashed]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "登録失敗" });
    }
});

// ■ login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    console.log("🔥 email:", email);

    if (!email || !password) {
        return res.status(400).json({ error: "メールとパスワード必須" });
    }

    try {
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        console.log("🔥 result:", result.rows);

        const user = result.rows[0];
        console.log("🔥 user:", user);

        if (!user) {
            return res.status(401).json({ error: "ユーザーなし" });
        }

        if (!user.password) {
            console.error("💥 passwordがDBにない");
            return res.status(500).json({ error: "password不正" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("🔥 isMatch:", isMatch);

        if (!isMatch) {
            return res.status(401).json({ error: "パスワード違う" });
        }

        const token = jwt.sign(
            { userId: user.id },
            SECRET,
            { expiresIn: "1d" }
        );

        console.log("🔥 token作成OK");

        res.json({ token });

    } catch (err) {
        console.error("💥 loginエラー:", err);
        res.status(500).json({ error: "server error" });
    }
});

export default router;