import Task from "../models/taskModel.js";

// create a new task
export const createTask = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id; // extract user id from JWT middleware
    if (!userId) return res.status(401).json({ message: "Unauthorized: no user ID" });

    const { title, status, description } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const newTask = await Task.create({
      title,
      description: description || "",
      status: status || "pending",
      userId: userId,
    });

    res.status(201).json(newTask);
  } catch (err) {
    console.error("❌ Error creating task:", err);
    res.status(500).json({ message: "Server error creating task" });
  }
};

// get all tasks for the logged-in user
export const getTasks = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const tasks = await Task.find({ userId: userId });
    res.json(tasks);
  } catch (err) {
    console.error("❌ Error fetching tasks:", err);
    res.status(500).json({ message: "Server error fetching tasks" });
  }
};

// update a task
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || req.user?._id;

    const task = await Task.findOneAndUpdate(
      { _id: id, userId: userId },
      req.body,
      { new: true }
    );

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (err) {
    console.error("❌ Error updating task:", err);
    res.status(500).json({ message: "Server error updating task" });
  }
};

// delete a task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || req.user?._id;

    const task = await Task.findOneAndDelete({ _id: id, userId: userId });
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("❌ Error deleting task:", err);
    res.status(500).json({ message: "Server error deleting task" });
  }
};
