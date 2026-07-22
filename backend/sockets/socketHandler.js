import Message from '../models/Message.js';
import User from '../models/User.js';

export const setupSocketHandlers = (io) => {
  // Store active users
  const activeUsers = new Map();

  io.on('connection', (socket) => {
    console.log('👤 User connected:', socket.id);

    // User joins
    socket.on('user-login', async (userId) => {
      activeUsers.set(userId, socket.id);
      await User.findByIdAndUpdate(userId, { status: 'online', lastSeen: new Date() });
      io.emit('user-status-changed', { userId, status: 'online' });
      console.log('✅ User online:', userId);
    });

    // Join workspace
    socket.on('join-workspace', (workspaceId) => {
      socket.join(`workspace-${workspaceId}`);
      socket.emit('workspace-joined', { workspaceId });
      io.to(`workspace-${workspaceId}`).emit('user-joined-workspace', {
        userId: socket.id,
        message: 'A user joined'
      });
    });

    // Join channel
    socket.on('join-channel', (channelId) => {
      socket.join(`channel-${channelId}`);
      io.to(`channel-${channelId}`).emit('user-joined-channel', { channelId });
    });

    // Send message
    socket.on('send-message', async (data) => {
      try {
        const message = new Message(data);
        await message.save();
        await message.populate('sender', 'name email avatar status');

        if (data.channel) {
          io.to(`channel-${data.channel}`).emit('new-message', message);
        } else if (data.receiver) {
          const receiverSocket = activeUsers.get(data.receiver);
          if (receiverSocket) {
            io.to(receiverSocket).emit('new-message', message);
          }
        }
      } catch (error) {
        console.error('Message error:', error);
      }
    });

    // Typing indicator
    socket.on('typing', (data) => {
      io.to(`channel-${data.channel}`).emit('user-typing', {
        userId: data.userId,
        userName: data.userName
      });
    });

    // Stop typing
    socket.on('stop-typing', (data) => {
      io.to(`channel-${data.channel}`).emit('user-stop-typing', {
        userId: data.userId
      });
    });

    // Update user status
    socket.on('update-status', async (data) => {
      await User.findByIdAndUpdate(data.userId, { status: data.status });
      io.emit('user-status-changed', {
        userId: data.userId,
        status: data.status
      });
    });

    // Disconnect
    socket.on('disconnect', async () => {
      console.log('👤 User disconnected:', socket.id);
      for (let [userId, socketId] of activeUsers) {
        if (socketId === socket.id) {
          activeUsers.delete(userId);
          await User.findByIdAndUpdate(userId, { 
            status: 'offline',
            lastSeen: new Date()
          });
          io.emit('user-status-changed', { userId, status: 'offline' });
          break;
        }
      }
    });
  });
};
