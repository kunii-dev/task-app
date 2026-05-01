function FilterButtons({ filter, setFilter }) {
    return (
        <div className="filter-area">
            <button
                onClick={() => {
                    console.log("CLICK", "all");
                    setFilter("all")
                }}
                className={`button filter-button ${filter === "all" ? "active" : ""}`}
            >
                すべて
            </button>

            <button
                onClick={() => {
                    console.log("CLICK", "incomplete"); // ←追加
                    setFilter("incomplete");
                }} // ← 修正🔥
                className={`button filter-button ${filter === "incomplete" ? "active" : ""}`}
            >
                未完了
            </button>

            <button
                onClick={() => {
                    console.log("CLICK", "completed");
                    setFilter("completed")
                }} // ← 修正🔥
                className={`button filter-button ${filter === "completed" ? "active" : ""}`}
            >
                完了
            </button>
        </div >
    );
}

export default FilterButtons;