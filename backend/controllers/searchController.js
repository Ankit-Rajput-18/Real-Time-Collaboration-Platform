import Task from '../models/Task.js';
import User from '../models/User.js';
import Workspace from '../models/Workspace.js';

export const globalSearch = async (req, res) => {
  try {
    const { query, type = 'all' } = req.query;

    if (!query || query.length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters' });
    }

    const searchRegex = new RegExp(query, 'i');
    let results = {};

    if (type === 'all' || type === 'tasks') {
      const tasks = await Task.find({
        $or: [{ title: searchRegex }, { description: searchRegex }]
      }).limit(10).populate('assignedTo', 'name email avatar').populate('createdBy', 'name email avatar').sort({ createdAt: -1 });
      results.tasks = tasks;
    }

    if (type === 'all' || type === 'users') {
      const users = await User.find({
        $or: [{ name: searchRegex }, { email: searchRegex }, { bio: searchRegex }]
      }).select('-password').limit(10);
      results.users = users;
    }

    if (type === 'all' || type === 'workspaces') {
      const workspaces = await Workspace.find({
        $or: [{ name: searchRegex }, { description: searchRegex }],
        'members.user': req.userId
      }).limit(10).populate('owner', 'name email avatar');
      results.workspaces = workspaces;
    }

    const totalResults = (results.tasks?.length || 0) + (results.users?.length || 0) + (results.workspaces?.length || 0);
    res.json({ query, totalResults, ...results });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
