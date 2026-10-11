const NEXT = { todo: "in-progress", "in-progress": "done", done: "todo" };
const LABEL = { todo: "To do", "in-progress": "In progress", done: "Done" };

export default function TaskCard({ task, showOwner, onAdvance, onEdit, onDelete }) {
  const overdue =
    task.dueDate && task.status !== "done" && new Date(task.dueDate) < new Date();

  return (
    <article className={`card task ${task.status}`}>
      <header>
        <h3>{task.title}</h3>
        <span className={`badge ${task.priority}`}>{task.priority}</span>
      </header>
      {task.description && <p className="muted">{task.description}</p>}
      <footer>
        <span className={`small ${overdue ? "error" : "muted"}`}>
          {task.dueDate ? `Due ${new Date(task.dueDate).toLocaleDateString()}` : "No due date"}
          {showOwner && task.owner?.name ? ` · ${task.owner.name}` : ""}
        </span>
        <div className="row">
          <button onClick={() => onAdvance(task)} title="Move to next status">
            {LABEL[task.status]} → {LABEL[NEXT[task.status]]}
          </button>
          <button onClick={() => onEdit(task)}>Edit</button>
          <button className="danger" onClick={() => onDelete(task)}>Delete</button>
        </div>
      </footer>
    </article>
  );
}

export { NEXT };
