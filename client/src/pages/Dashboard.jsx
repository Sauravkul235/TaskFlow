import { useCallback, useEffect, useState } from "react";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import TaskForm from "../components/TaskForm.jsx";
import TaskCard, { NEXT } from "../components/TaskCard.jsx";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ todo: 0, "in-progress": 0, done: 0, total: 0 });
  const [filters, setFilters] = useState({ q: "", status: "", priority: "" });
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [list, s] = await Promise.all([api.listTasks(filters), api.stats()]);
      setTasks(list.tasks);
      setStats(s);
      setError("");
    } catch (err) {
      if (err.status === 401) logout();
      else setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters, logout]);

  // Debounce so typing in the search box doesn't fire a request per keystroke.
  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  const handleSubmit = async (data) => {
    try {
      if (editing) {
        await api.updateTask(editing._id, data);
        setEditing(null);
      } else {
        await api.createTask(data);
      }
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const advance = async (task) => {
    try {
      await api.updateTask(task._id, { status: NEXT[task.status] });
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (task) => {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    try {
      await api.deleteTask(task._id);
      if (editing?._id === task._id) setEditing(null);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const setFilter = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  return (
    <div className="layout">
      <nav className="topbar">
        <strong>TaskFlow</strong>
        <div className="row">
          <span className="muted small">
            {user.name} {user.role === "admin" && <span className="badge high">admin</span>}
          </span>
          <button onClick={logout}>Log out</button>
        </div>
      </nav>

      <section className="stats">
        <div className="card"><b>{stats.total}</b><span>Total</span></div>
        <div className="card"><b>{stats.todo}</b><span>To do</span></div>
        <div className="card"><b>{stats["in-progress"]}</b><span>In progress</span></div>
        <div className="card"><b>{stats.done}</b><span>Done</span></div>
      </section>

      <div className="columns">
        <aside>
          <TaskForm editing={editing} onSubmit={handleSubmit} onCancel={() => setEditing(null)} />
        </aside>

        <main>
          <div className="row filters">
            <input name="q" placeholder="Search title…" value={filters.q} onChange={setFilter} />
            <select name="status" value={filters.status} onChange={setFilter}>
              <option value="">All statuses</option>
              <option value="todo">To do</option>
              <option value="in-progress">In progress</option>
              <option value="done">Done</option>
            </select>
            <select name="priority" value={filters.priority} onChange={setFilter}>
              <option value="">All priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {error && <p className="error">{error}</p>}
          {loading ? (
            <p className="muted">Loading tasks…</p>
          ) : tasks.length === 0 ? (
            <p className="muted">No tasks found. Add your first one!</p>
          ) : (
            tasks.map((t) => (
              <TaskCard
                key={t._id}
                task={t}
                showOwner={user.role === "admin"}
                onAdvance={advance}
                onEdit={setEditing}
                onDelete={remove}
              />
            ))
          )}
        </main>
      </div>
    </div>
  );
}
