import { Router } from "express";
import {
  listTasks,
  getStats,
  createTask,
  getTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.get("/stats", getStats); // must be declared before "/:id"
router.route("/").get(listTasks).post(createTask);
router.route("/:id").get(getTask).put(updateTask).delete(deleteTask);

export default router;
