import Workspace from '../models/Workspace.js';
import User from '../models/User.js';

export const createWorkspace = async (req, res) => {
  try {
    const { name, description } = req.body;

    const workspace = new Workspace({
      name,
      description,
      owner: req.userId,
      members: [{ user: req.userId, role: 'admin' }]
    });

    await workspace.save();
    await workspace.populate('owner members.user');

    // Add workspace to user
    await User.findByIdAndUpdate(
      req.userId,
      { $push: { workspaces: workspace._id } }
    );

    res.status(201).json({
      message: 'Workspace created',
      workspace
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      'members.user': req.userId
    })
      .populate('owner')
      .populate('members.user')
      .populate('channels');

    res.json(workspaces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWorkspaceById = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id)
      .populate('owner')
      .populate('members.user')
      .populate('channels');

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    res.json(workspace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateWorkspace = async (req, res) => {
  try {
    const { name, description } = req.body;
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    if (workspace.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    workspace.name = name || workspace.name;
    workspace.description = description || workspace.description;
    workspace.updatedAt = new Date();

    await workspace.save();
    await workspace.populate('owner members.user');

    res.json({
      message: 'Workspace updated',
      workspace
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    if (workspace.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Workspace.deleteOne({ _id: req.params.id });

    // Remove workspace from all users
    await User.updateMany(
      { workspaces: req.params.id },
      { $pull: { workspaces: req.params.id } }
    );

    res.json({ message: 'Workspace deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addMember = async (req, res) => {
  try {
    const { email, role } = req.body;
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    if (workspace.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const memberExists = workspace.members.some(
      m => m.user.toString() === user._id.toString()
    );

    if (memberExists) {
      return res.status(400).json({ message: 'User already a member' });
    }

    workspace.members.push({ user: user._id, role: role || 'member' });
    await workspace.save();

    if (!user.workspaces.includes(workspace._id)) {
      user.workspaces.push(workspace._id);
      await user.save();
    }

    await workspace.populate('members.user');

    res.json({
      message: 'Member added',
      workspace
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    if (workspace.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    workspace.members = workspace.members.filter(
      m => m.user.toString() !== userId
    );
    await workspace.save();

    await User.findByIdAndUpdate(
      userId,
      { $pull: { workspaces: workspace._id } }
    );

    await workspace.populate('members.user');

    res.json({
      message: 'Member removed',
      workspace
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMemberRole = async (req, res) => {
  try {
    const { userId, role } = req.body;
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    if (workspace.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const member = workspace.members.find(m => m.user.toString() === userId);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    member.role = role;
    await workspace.save();

    await workspace.populate('members.user');

    res.json({
      message: 'Member role updated',
      workspace
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
