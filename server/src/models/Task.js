import mongoose from "mongoose";

export const STATUSES = ["todo", "in-progress", "done"];
export const PRIORITIES = ["low", "medium", "high"];

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 1000, default: "" },
    status: { type: String, enum: STATUSES, default: "todo" },
    priority: { type: String, enum: PRIORITIES, default: "medium" },
    dueDate: { type: Date, default: null },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

taskSchema.index({ owner: 1, status: 1, createdAt: -1 });

export default mongoose.model("Task", taskSchema);
