import { useEffect, useState } from "react";
import { CloseIcon } from "./Icons.jsx";

const EMPTY = { title: "", description: "", priority: "medium", status: "todo", dueDate: "" };

const toInputDate = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "");

// `task` is null when creating, or the task being edited.
// `onSubmit` resolves true when saved (the parent then closes the modal).
export default function TaskModal({ task, onSubmit, onClose }) {
  const [form, setForm] = useState(
    task ? { ...EMPTY, ...task, dueDate: toInputDate(task.dueDate) } : EMPTY
  );
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await onSubmit({
        title: form.title.trim(),
        description: form.description,
        priority: form.priority,
        status: form.status,
        dueDate: form.dueDate,
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="overlay" onMouseDown={onClose}>
      <form
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
        onMouseDown={(e) => e.stopPropagation()}
        onSubmit={submit}
      >
        <div className="modal-head">
          <h2 id="task-modal-title">{task ? "Edit task" : "New task"}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        <label className="field">
          <span>Title</span>
          <input
            name="title"
            value={form.title}
            onChange={onChange}
            maxLength={120}
            placeholder="What needs to be done?"
            autoFocus
            required
          />
        </label>

        <label className="field">
          <span>Description</span>
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            rows={3}
            maxLength={1000}
            placeholder="Add a few details (optional)"
          />
        </label>

        <div className="grid-3">
          <label className="field">
            <span>Priority</span>
            <select name="priority" value={form.priority} onChange={onChange}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
          <label className="field">
            <span>Status</span>
            <select name="status" value={form.status} onChange={onChange}>
              <option value="todo">To do</option>
              <option value="in-progress">In progress</option>
              <option value="done">Done</option>
            </select>
          </label>
          <label className="field">
            <span>Due date</span>
            <input type="date" name="dueDate" value={form.dueDate} onChange={onChange} />
          </label>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" disabled={busy || !form.title.trim()}>
            {busy ? "Saving…" : task ? "Save changes" : "Create task"}
          </button>
        </div>
      </form>
    </div>
  );
}
