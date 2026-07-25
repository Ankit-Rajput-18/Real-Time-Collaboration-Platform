import Task from '../models/Task.js';
import Message from '../models/Message.js';
import Activity from '../models/Activity.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

export const getWorkspaceAnalytics = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const objectId = new mongoose.Types.ObjectId(workspaceId);

    const taskStats = await Task.aggregate([
      { $match: { workspace: objectId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const priorityStats = await Task.aggregate([
      { $match: { workspace: objectId } },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    const dailyTasks = await Task.aggregate([
      { $match: { workspace: objectId } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          created: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 30 }
    ]);

    const topPerformers = await Task.aggregate([
      { $match: { workspace: objectId, status: 'completed' } },
      { $group: { _id: '$assignedTo', completedTasks: { $sum: 1 } } },
      { $sort: { completedTasks: -1 } },
      { $limit: 5 }
    ]);

    await User.populate(topPerformers, { path: '_id', select: 'name email avatar' });

    const totalTasks = await Task.countDocuments({ workspace: workspaceId });
    const completedTasks = await Task.countDocuments({ workspace: workspaceId, status: 'completed' });
    const overdueTasks = await Task.countDocuments({
      workspace: workspaceId, status: { $ne: 'completed' }, dueDate: { $lt: new Date() }
    });
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.json({
      summary: { totalTasks, completedTasks, overdueTasks, completionRate },
      taskStats, priorityStats, dailyTasks,
      topPerformers: topPerformers.map(p => ({ user: p._id, completedTasks: p.completedTasks }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserAnalytics = async (req, res) => {
  try {
    const userId = req.userId;
    const tasksCreated = await Task.countDocuments({ createdBy: userId });
    const tasksCompleted = await Task.countDocuments({ assignedTo: userId, status: 'completed' });
    const tasksInProgress = await Task.countDocuments({ assignedTo: userId, status: 'inprogress' });
    const messagesSent = await Message.countDocuments({ sender: userId });

    res.json({
      tasksCreated, tasksCompleted, tasksInProgress, messagesSent,
      productivity: tasksCreated > 0 ? Math.round((tasksCompleted / tasksCreated) * 100) : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
