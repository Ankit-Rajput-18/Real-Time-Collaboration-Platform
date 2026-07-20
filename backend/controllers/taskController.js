import Task from '../models/Task.js';
import Workspace from '../models/Workspace.js';

export const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, priority, dueDate } = req.body;
    const { workspaceId } = req.params;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    const task = new Task({
      title,
      description,
      workspace: workspaceId,
      assignedTo,
      createdBy: req.userId,
      priority,
      dueDate
    });

    await task.save();
    await task.populate('assignedTo createdBy');

    res.status(201).json({
      message: 'Task created',
      task
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWorkspaceTasks = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const tasks = await Task.find({ workspace: workspaceId })
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo')
      .populate('createdBy')
      .populate('workspace');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { title, description, status, assignedTo, priority, dueDate } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.createdBy.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.assignedTo = assignedTo || task.assignedTo;
    task.priority = priority || task.priority;
    task.dueDate = dueDate || task.dueDate;
    task.updatedAt = new Date();

    await task.save();
    await task.populate('assignedTo createdBy');

    res.json({
      message: 'Task updated',
      task
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.createdBy.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Task.deleteOne({ _id: req.params.id });

    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTaskStats = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const stats = await Task.aggregate([
      { $match: { workspace: require('mongoose').Types.ObjectId(workspaceId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const total = await Task.countDocuments({ workspace: workspaceId });

    res.json({
      total,
      byStatus: stats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
