import Channel from '../models/Channel.js';
import Workspace from '../models/Workspace.js';

export const createChannel = async (req, res) => {
  try {
    const { name, description, isPrivate } = req.body;
    const { workspaceId } = req.params;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    const channel = new Channel({
      name,
      description,
      workspace: workspaceId,
      createdBy: req.userId,
      members: [req.userId],
      isPrivate
    });

    await channel.save();
    workspace.channels.push(channel._id);
    await workspace.save();

    await channel.populate('createdBy', 'name email avatar');
    await channel.populate('members', 'name email avatar');

    res.status(201).json({
      message: 'Channel created',
      channel
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWorkspaceChannels = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const channels = await Channel.find({ workspace: workspaceId })
      .populate('createdBy', 'name email avatar')
      .populate('members', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json(channels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getChannelById = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id)
      .populate('createdBy', 'name email avatar')
      .populate('members', 'name email avatar')
      .populate('workspace');

    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    res.json(channel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateChannel = async (req, res) => {
  try {
    const { name, description } = req.body;

    const channel = await Channel.findById(req.params.id);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    if (channel.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    channel.name = name || channel.name;
    channel.description = description || channel.description;

    await channel.save();
    await channel.populate('createdBy members');

    res.json({
      message: 'Channel updated',
      channel
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    if (channel.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Channel.deleteOne({ _id: req.params.id });

    await Workspace.findByIdAndUpdate(
      channel.workspace,
      { $pull: { channels: channel._id } }
    );

    res.json({ message: 'Channel deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addMember = async (req, res) => {
  try {
    const { userId } = req.body;

    const channel = await Channel.findById(req.params.id);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    if (channel.members.includes(userId)) {
      return res.status(400).json({ message: 'User already a member' });
    }

    channel.members.push(userId);
    await channel.save();
    await channel.populate('members', 'name email avatar');

    res.json({
      message: 'Member added to channel',
      channel
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { userId } = req.body;

    const channel = await Channel.findById(req.params.id);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    channel.members = channel.members.filter(id => id.toString() !== userId);
    await channel.save();
    await channel.populate('members', 'name email avatar');

    res.json({
      message: 'Member removed from channel',
      channel
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
