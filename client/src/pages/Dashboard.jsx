import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import TaskCard from "../components/TaskCard.jsx";
import TaskModal from "../components/TaskModal.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";
import { PlusIcon, SearchIcon, LogoutIcon, CheckIcon } from "../components/Icons.jsx";

const COLUMNS = [
  { key: "todo", label: "To do" },
  { key: "in-progress", label: "In progress" },
  { key: "done", label: "Done" },
];

const EMPTY_STATS = { todo: 0, "in-progress": 0, done: 0, total: 0 };

export default function Dashboard() {
  const { user, logout } = useAuth();
  const toast = useToast();

  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(EMPTY_STATS);
  const [filters, setFilters] = useState({ q: "", priority: "" });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [modal, setModal] = useState(null); 
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [dragOver, setDragOver] = useState(null);

  const load = useCallback(async () => {
    try {
      const [list, s] = await Promise.all([
        api.listTasks({ q: filters.q, priority: filters.priority, limit: 100 }),
        api.stats(),
      ]);
      setTasks(list.tasks);
      setStats(s);
      setLoadError("");
    } catch (err) {
      if (err.status === 401) logout();
      else setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters, logout]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  const refreshStats = () =>
    api
      .stats()
      .then(setStats)
      .catch(() => { });

  const grouped = useMemo(() => {
    const g = { todo: [], "in-progress": [], done: [] };
    for (const t of tasks) (g[t.status] || g.todo).push(t);
    return g;
  }, [tasks]);

  const saveTask = async (data) => {
    try {
      if (modal.task) {
        await api.updateTask(modal.task._id, data);
        toast.success("Task updated");
      } else {
        await api.createTask(data);
        toast.success("Task created");
      }
      setModal(null);
      await load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const moveTask = async (task, status) => {
    if (!status || task.status === status) return;
    const previous = tasks;
    setTasks((list) => list.map((t) => (t._id === task._id ? { ...t, status } : t)));
    try {
      await api.updateTask(task._id, { status });
      refreshStats();
    } catch (err) {
      setTasks(previous);
      toast.error(err.message);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api.deleteTask(toDelete._id);
      toast.success("Task deleted");
      setToDelete(null);
      await load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const onDrop = (e, status) => {
    e.preventDefault();
    setDragOver(null);
    const id = e.dataTransfer.getData("text/plain");
    const task = tasks.find((t) => t._id === id);
    if (task) moveTask(task, status);
  };

  const setFilter = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });
  const filtersActive = filters.q || filters.priority;
  const firstName = user.name.split(" ")[0];

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark"><CheckIcon width={18} height={18} /></span>
          TaskFlow
        </div>
        <div className="topbar-right">
          <span className="user-pill">
            <span className="avatar">{user.name.charAt(0).toUpperCase()}</span>
            <span className="user-name">{user.name}</span>
            {user.role === "admin" && <span className="badge high">admin</span>}
          </span>
          <ThemeToggle />
          <button type="button" className="icon-btn" onClick={logout} aria-label="Log out" title="Log out">
            <LogoutIcon />
          </button>
        </div>
      </header>

      <main className="content">
        <section className="page-head">
          <div>
            <h1>Hi, {firstName}</h1>
            <p className="muted">
              {stats.total === 0
                ? "Create your first task to get started."
                : `${stats.done} of ${stats.total} tasks completed.`}
            </p>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => setModal({ task: null })}>
            <PlusIcon width={16} height={16} /> New task
          </button>
        </section>

        <section className="stats">
          <div className="stat"><span className="stat-label">Total</span><b>{stats.total}</b></div>
          <div className="stat"><span className="stat-label"><i className="dot todo" />To do</span><b>{stats.todo}</b></div>
          <div className="stat"><span className="stat-label"><i className="dot in-progress" />In progress</span><b>{stats["in-progress"]}</b></div>
          <div className="stat"><span className="stat-label"><i className="dot done" />Done</span><b>{stats.done}</b></div>
        </section>

        <section className="toolbar">
          <label className="search">
            <SearchIcon width={16} height={16} />
            <input name="q" value={filters.q} onChange={setFilter} placeholder="Search tasks…" aria-label="Search tasks" />
          </label>
          <select name="priority" value={filters.priority} onChange={setFilter} aria-label="Filter by priority">
            <option value="">All priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {filtersActive && (
            <button type="button" className="btn btn-ghost" onClick={() => setFilters({ q: "", priority: "" })}>
              Clear filters
            </button>
          )}
        </section>

        {loadError && (
          <div className="banner-error" role="alert">
            {loadError}
            <button type="button" className="link-btn" onClick={load}>Retry</button>
          </div>
        )}

        <section className="board">
          {COLUMNS.map((col) => (
            <div key={col.key} className={`column ${dragOver === col.key ? "drag-over" : ""}`} onDragOver={(e) => {
                e.preventDefault();
                setDragOver(col.key);
              }} onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) setDragOver(null);
              }} onDrop={(e) => onDrop(e, col.key)}>

              <header className="column-head">
                <h2><i className={`dot ${col.key}`} />{col.label}</h2>
                <span className="count">{loading ? "–" : grouped[col.key].length}</span>
              </header>

              <div className="column-body">
                {loading ? (
                  <>
                    <div className="skeleton" />
                    <div className="skeleton short" />
                  </>
                ) : grouped[col.key].length === 0 ? (
                  <div className="empty">
                    {filtersActive ? "No matching tasks" : "Nothing here yet"}
                    {col.key === "todo" && !filtersActive && (
                      <button type="button" className="link-btn" onClick={() => setModal({ task: null })}>
                        Add a task
                      </button>
                    )}
                  </div>
                ) : ( grouped[col.key].map((t) => (
                    <TaskCard key={t._id} task={t} showOwner={user.role === "admin"} onMove={moveTask} onEdit={(task) => setModal({ task })} onDelete={setToDelete} />
                  ))
                )}
              </div>
            </div>
          ))}
        </section>
      </main>
      {modal && <TaskModal task={modal.task} onSubmit={saveTask} onClose={() => setModal(null)} />}

      {toDelete && (
        <ConfirmModal title="Delete this task?" message={`"${toDelete.title}" will be permanently removed.`} busy={deleting} onConfirm={confirmDelete} onCancel={() => setToDelete(null)}/>
      )}
    </div>
  );
}