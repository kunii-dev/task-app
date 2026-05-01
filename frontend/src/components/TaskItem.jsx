import { useState, useRef, useEffect } from "react";

function TaskItem({ task,
    deletingId,
    onToggle,
    onDelete,
    onUpdate }) {

    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(task.title);

    const handleUpdate = () => {
        if (!editText.trim()) return;
        onUpdate(task.id, editText);
        setIsEditing(false);
    };

    const inputRef = useRef(null);

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
        }
    }, [isEditing]);

    // ===== 編集モード =====
    if (isEditing) {
        return (
            <li className="task-item card">
                <input
                    ref={inputRef}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleUpdate();
                        }
                        if (e.key === "Escape") {
                            setIsEditing(false);
                        }
                    }}
                />

                <button className="button" onClick={handleUpdate}>
                    保存
                </button>
            </li>
        );
    }

    // ===== 通常モード =====
    return (
        <li className="task-item card">
            <div className="task-main">
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggle(task)}
                />

                <span className={`task-title ${task.completed ? "completed" : ""}`}>
                    {task.title}
                </span>
            </div>

            <div className="task-actions">
                <button
                    className="button"
                    onClick={() => {
                        setEditText(task.title);
                        setIsEditing(true);
                    }}
                >編集
                </button>

                <button
                    className="button delete-button"
                    onClick={() => {
                        if (!window.confirm("このタスクを削除しますか？")) return;
                        onDelete(task.id);
                    }}
                    disabled={deletingId === task.id}
                >
                    削除
                </button>
            </div>
        </li>
    );
}

export default TaskItem;