import { useState } from "react";
import { useApi } from "./hooks/useApi";
import toast from "react-hot-toast";

export const Login = ({ onLogin }: { onLogin: (token: string) => void }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // API関数
    const loginApi = async (email: string, password: string) => {
        const res = await fetch("https://task-app-backend-1f16.onrender.com/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            throw new Error("ログインに失敗しました");
        }

        return res.json();
    };

    const { execute, loading, error } = useApi(loginApi);

    const handleLogin = async () => {
        try {
            const data = await execute(email, password);

            localStorage.setItem("token", data.token);

            // ✅ 成功トースト
            toast.success("ログイン成功！🎉");

            onLogin(data.token);
        } catch (e) {
            setTimeout(() => {
                toast.error("ログイン失敗 😢");
            }, 0);
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">ログイン</h2>

            <div className="login-form">
                <input
                    type="email"
                    placeholder="メールアドレス"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="パスワード"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleLogin();
                    }}
                />

                <button onClick={handleLogin} disabled={loading}>
                    {loading ? "ログイン中..." : "ログイン"}
                </button>
            </div>
        </div>
    );
};