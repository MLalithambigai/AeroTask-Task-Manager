const Task = require('../models/Task');

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate: dueDate || null,
      user: req.user.id
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Error creating task", error: err.message });
  }
};

// Get all tasks for the logged-in user (with search, filter, sort, pagination)
exports.getTasks = async (req, res) => {
  try {
    const { status, priority, search, sortBy, page = 1, limit = 10 } = req.query;

    const query = { user: req.user.id };

    // Filtering by status
    if (status && status !== 'all') {
      query.status = status;
    }

    // Filtering by priority
    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    // Searching
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Sorting
    let sortObj = {};
    if (sortBy) {
      const parts = sortBy.split(':');
      const field = parts[0];
      const order = parts[1] === 'desc' ? -1 : 1;
      sortObj[field] = order;
    } else {
      sortObj['createdAt'] = -1; // default sort is newest first
    }

    // Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const tasks = await Task.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    const totalTasks = await Task.countDocuments(query);

    res.status(200).json({
      tasks,
      page: pageNum,
      pages: Math.ceil(totalTasks / limitNum),
      totalTasks
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks", error: err.message });
  }
};

// Get a single task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: "Error fetching task", error: err.message });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    let task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate || null;

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: "Error updating task", error: err.message });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting task", error: err.message });
  }
};

// Update task status (Patch)
exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !['pending', 'completed'].includes(status)) {
      return res.status(400).json({ message: "Valid status ('pending' or 'completed') is required" });
    }

    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.status = status;
    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: "Error updating task status", error: err.message });
  }
};
