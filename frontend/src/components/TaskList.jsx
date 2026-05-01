import TaskItem from "./TaskItem";
import Spinner from "./Spinner";

function TaskList({
    tasks,
    loading,
    error,
    deletingId,
    onToggle,
    onDelete,
    onUpdate,
}) {
    // ■ ローディング中
    if (loading) {
        return (
            <div className="loading-wrapper">
                <Spinner />
                <p className="loading-text">読み込み中...</p>
            </div>
        );
    }

    // ■ エラー
    if (error) {
        return <p className="error">{error}</p>;
    }

    // ■ データなし
    if (!loading && tasks.length === 0) {
        return (
            <div className="empty-state">
                <p className="empty-title">📭 タスクがありません</p>
                <p className="empty-sub">最初のタスクを追加してみましょう！</p>
            </div>
        );
    }

    // ■ データあり
    return (
        <ul className="task-list">
            {tasks.map((task) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    deletingId={deletingId}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                />
            ))}
        </ul>
    );
}

export default TaskList;