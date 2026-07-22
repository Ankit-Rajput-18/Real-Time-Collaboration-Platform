import Task from '../models/Task.js';
import Comment from '../models/Comment.js';
import Activity from '../models/Activity.js';
import Workspace from '../models/Workspace.js';

export const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, priority, dueDate } = req.body;
    const { workspaceId } = req.params;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

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
      priority: priority || 'medium',
      dueDate,
      status: 'todo'
    });

    await task.save();
    await task.populate('assignedTo', 'name email avatar');
    await task.populate('createdBy', 'name email avatar');

    // Log activity
    await Activity.create({
      workspace: workspaceId,
      user: req.userId,
      type: 'task_created',
      description: `Created task: ${title}`,
      data: { taskId: task._id }
    });

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
    const { status, priority, assignedTo, page = 1, limit = 10 } = req.query;

    let query = { workspace: workspaceId };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignedTo) query.assignedTo = assignedTo;

    const skip = (page - 1) * limit;

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Task.countDocuments(query);

    res.json({
      tasks,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
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

    // Get comments
    const comments = await Comment.find({ task: req.params.id })
      .populate('author', 'name email avatar')
      .populate('replies.author', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json({
      task,
      comments
    });
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

    const oldStatus = task.status;
    
    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.assignedTo = assignedTo || task.assignedTo;
    task.priority = priority || task.priority;
    task.dueDate = dueDate || task.dueDate;
    task.updatedAt = new Date();

    await task.save();
    await task.populate('assignedTo createdBy');

    // Log activity
    if (oldStatus !== task.status) {
      await Activity.create({
        workspace: task.workspace,
        user: req.userId,
        type: status === 'completed' ? 'task_completed' : 'task_updated',
        description: `Changed status from ${oldStatus} to ${task.status}`,
        data: { taskId: task._id }
      });
    }

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

export const addComment = async (req, res) => {
  try {
    const { content, attachments } = req.body;
    const { taskId } = req.params;

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const comment = new Comment({
      task: taskId,
      author: req.userId,
      content,
      attachments: attachments || []
    });

    await comment.save();
    await comment.populate('author', 'name email avatar');

    res.status(201).json({
      message: 'Comment added',
      comment
    });
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
    const overdue = await Task.countDocuments({
      workspace: workspaceId,
      status: { $ne: 'completed' },
      dueDate: { $lt: new Date() }
    });

    res.json({
      total,
      overdue,
      byStatus: stats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
