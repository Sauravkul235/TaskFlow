import { EditIcon, TrashIcon, LeftIcon, RightIcon, CalendarIcon } from "./Icons.jsx";

export const STATUS_ORDER = ["todo", "in-progress", "done"];

const formatDate = (d) =>
  new Date(d).toLocaleDateString(undefined, { day: "numeric", month: "short" });

export default function TaskCard({ task, showOwner, onMove, onEdit, onDelete }) {
  const index = STATUS_ORDER.indexOf(task.status);
  const prev = STATUS_ORDER[index - 1];
  const next = STATUS_ORDER[index + 1];

  const due = task.dueDate ? new Date(task.dueDate) : null;
  const overdue = due && task.status !== "done" && due < new Date();

  const onDragStart = (e) => {
    e.dataTransfer.setData("text/plain", task._id);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <article className={`task-card ${task.status}`} draggable onDragStart={onDragStart}>
      <header className="task-card-head">
        <h3>{task.title}</h3>
        <span className={`badge ${task.priority}`}>{task.priority}</span>
      </header>
      {task.description && <p className="task-desc">{task.description}</p>}

      <div className="task-meta">
        {due && (
          <span className={`chip ${overdue ? "overdue" : ""}`}>
            <CalendarIcon width={13} height={13} />
            {overdue ? "Overdue · " : ""}
            {formatDate(task.dueDate)}
          </span>
        )}
        {showOwner && task.owner?.name && <span className="chip">{task.owner.name}</span>}
      </div>

      <footer className="task-actions">
        <div className="move-group">
          <button type="button" className="icon-btn sm" onClick={() => onMove(task, prev)} disabled={!prev} aria-label="Move to previous column" title="Move back">
            <LeftIcon width={16} height={16} />
          </button>
          <button type="button" className="icon-btn sm" onClick={() => onMove(task, next)} disabled={!next} aria-label="Move to next column" title="Move forward" >
            <RightIcon width={16} height={16} />
          </button>
        </div>
        <div className="move-group">
          <button type="button" className="icon-btn sm" onClick={() => onEdit(task)} aria-label={`Edit ${task.title}`} title="Edit">
            <EditIcon width={16} height={16} />
          </button>
          <button type="button" className="icon-btn sm danger" onClick={() => onDelete(task)} aria-label={`Delete ${task.title}`} title="Delete" >
            <TrashIcon width={16} height={16} />
          </button>
        </div>
      </footer>
    </article>
  );
}