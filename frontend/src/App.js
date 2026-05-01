import { useState, useEffect } from "react";
import { useTasks } from "./hooks/useTasks";
import { Login } from "./Login";
import { getMe } from "./services/api";
import { createApiClient } from "./apiClient";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import FilterButtons from "./components/FilterButtons";
import toast from "react-hot-toast";
import Spinner from "./components/Spinner";
import "./App.css";

function App() {
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true); // ←追加🔥

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null); // ←追加🔥
  };

  const apiFetch = createApiClient(handleLogout);

  const {
    tasks,
    loading,
    error,
    deletingId,
    handleAdd,
    handleDelete,
    handleUpdate,
    handleToggle,
    filter,
    setFilter,
    isAdding,
  } = useTasks(token, apiFetch);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMe(apiFetch);
        setUser(data);
      } catch (err) {
        console.error("💥 /me失敗:", err);

        toast.error("認証に失敗しました"); // ←🔥 ここ追加

        handleLogout(); // ←超重要🔥
      } finally {
        setLoadingUser(false);
      }
    };

    if (token) {
      fetchUser();
    } else {
      setLoadingUser(false);
    }
  }, [token]);

  // 🔥 ローディング中
  if (loadingUser) {
    return <Spinner />;
  }

  // 🔥 未ログイン
  if (!token || !user) {
    return <Login onLogin={setToken} />;
  }

  return (
    <div className="container">

      {/* 🔥 ヘッダー */}
      <div className="header">
        <h1 className="title">タスク一覧</h1>

        <div className="header-right">
          <span className="user-email">
            {user?.email}
          </span>

          <button className="logout-button" onClick={handleLogout}>
            ログアウト
          </button>
        </div>
      </div>

      {/* 🔽 メイン */}
      <TaskForm
        onAdd={handleAdd}
        isLoading={isAdding} // ←仮でOK（後でmutationと繋ぐ）
      />

      <FilterButtons
        filter={filter}
        setFilter={setFilter}
      />

      <TaskList
        tasks={tasks}
        loading={loading}
        error={error}
        deletingId={deletingId}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
        onToggle={handleToggle}
      />
    </div>
  );
}

export default App;