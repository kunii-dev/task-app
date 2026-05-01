import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";

function TaskForm({ onAdd, isLoading }) {
  const [text, setText] = useState("");
  const inputRef = useRef(null);

  // 🔥 初回フォーカス
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔥 空入力チェック
    if (!text.trim()) {
      toast.error("タスクを入力してください");
      return;
    }

    // 🔥 追加
    onAdd(text);

    // 🔥 リセット & フォーカス戻す
    setText("");
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="input-area">
      <input
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="タスクを入力"
      />

      <button
        className="button"
        type="submit"
        disabled={isLoading}
      >
        追加
      </button>
    </form>
  );
}

export default TaskForm;