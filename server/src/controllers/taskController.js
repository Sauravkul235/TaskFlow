import Task, { STATUSES, PRIORITIES } from "../models/Task.js";
import { asyncHandler } from "../middleware/error.js";

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Admins may act on any task; regular users only on their own.
const scopeFilter = (req) => (req.user.role === "admin" ? {} : { owner: req.user._id });

const pick = (body) => {
  const out = {};
  for (const key of ["title", "description", "status", "priority", "dueDate"]) {
    if (body[key] !== undefined) out[key] = body[key];
  }
  if (out.dueDate === "") out.dueDate = null;
  return out;
};

export const listTasks = asyncHandler(async (req, res) => {
  const { status, priority, q, page = 1, limit = 50 } = req.query;
  const filter = scopeFilter(req);

  if (status && STATUSES.includes(status)) filter.status = status;
  if (priority && PRIORITIES.includes(priority)) filter.priority = priority;
  if (q) filter.title = { $regex: escapeRegex(String(q)), $options: "i" };

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(100, Math.max(1, Number(limit) || 50));

  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .populate("owner", "name email")
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Task.countDocuments(filter),
  ]);

  res.json({ tasks, total, page: pageNum, pages: Math.ceil(total / limitNum) });
});

export const getStats = asyncHandler(async (req, res) => {
  const rows = await Task.aggregate([
    { $match: scopeFilter(req) },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  const stats = { todo: 0, "in-progress": 0, done: 0, total: 0 };
  for (const r of rows) {
    stats[r._id] = r.count;
    stats.total += r.count;
  }
  res.json(stats);
});

export const createTask = asyncHandler(async (req, res) => {
  const data = pick(req.body);
  if (!data.title) return res.status(400).json({ message: "Title is required" });
  const task = await Task.create({ ...data, owner: req.user._id });
  res.status(201).json(task);
});

export const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, ...scopeFilter(req) });
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, ...scopeFilter(req) },
    pick(req.body),
    { new: true, runValidators: true }
  );
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, ...scopeFilter(req) });
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json({ message: "Task deleted" });
});
