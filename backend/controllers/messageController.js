import Message from '../models/Message.js';
import Channel from '../models/Channel.js';
import User from '../models/User.js';

export const sendMessage = async (req, res) => {
  try {
    const { content, receiver, channel, attachments } = req.body;

    if (!content && !attachments) {
      return res.status(400).json({ message: 'Message content required' });
    }

    const message = new Message({
      sender: req.userId,
      receiver,
      channel,
      content,
      attachments: attachments || []
    });

    await message.save();
    await message.populate('sender', 'name email avatar status');

    res.status(201).json({
      message: 'Message sent',
      data: message
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDirectMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: req.userId, receiver: userId },
        { sender: userId, receiver: req.userId }
      ]
    })
      .populate('sender', 'name email avatar status')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getChannelMessages = async (req, res) => {
  try {
    const { channelId } = req.params;

    const messages = await Message.find({ channel: channelId })
      .populate('sender', 'name email avatar status')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { messageIds } = req.body;

    await Message.updateMany(
      { _id: { $in: messageIds } },
      { isRead: true }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.sender.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Message.deleteOne({ _id: req.params.id });

    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
