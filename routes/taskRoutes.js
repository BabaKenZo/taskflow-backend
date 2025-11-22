import express from "express";
import { createTask, getTasks, updateTask, deleteTask } from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js"; // protect routes (requires login)

const router = express.Router();

// apply protect middleware to all task routes
router.use(protect);

router.get("/", getTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
