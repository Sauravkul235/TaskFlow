import { useState, useEffect } from "react";

const EMPTY = { title: "", description: "", priority: "medium", status: "todo", dueDate: "" };

const toInputDate = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "");

export default function TaskForm({ editing, onSubmit, onCancel }) {
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setForm(editing ? { ...EMPTY, ...editing, dueDate: toInputDate(editing.dueDate) } : EMPTY);
  }, [editing]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await onSubmit({
        title: form.title,
        description: form.description,
        priority: form.priority,
        status: form.status,
        dueDate: form.dueDate,
      });
      if (!editing) setForm(EMPTY);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="card task-form" onSubmit={submit}>
      <h2>{editing ? "Edit task" : "New task"}</h2>
      <input name="title" placeholder="Title" value={form.title} onChange={onChange} maxLength={120} required />
      <textarea name="description" placeholder="Description (optional)" value={form.description} onChange={onChange} rows={3} />
      <div className="row">
        <select name="priority" value={form.priority} onChange={onChange}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select name="status" value={form.status} onChange={onChange}>
          <option value="todo">To do</option>
          <option value="in-progress">In progress</option>
          <option value="done">Done</option>
        </select>
        <input type="date" name="dueDate" value={form.dueDate} onChange={onChange} />
      </div>
      <div className="row">
        <button className="primary" disabled={busy}>{editing ? "Save changes" : "Add task"}</button>
        {editing && <button type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
