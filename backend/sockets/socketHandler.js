import Message from '../models/Message.js';

export const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join workspace room
    socket.on('join-workspace', (workspaceId) => {
      socket.join(`workspace-${workspaceId}`);
      console.log(`User joined workspace: ${workspaceId}`);
    });

    // Leave workspace room
    socket.on('leave-workspace', (workspaceId) => {
      socket.leave(`workspace-${workspaceId}`);
    });

    // Join channel room
    socket.on('join-channel', (channelId) => {
      socket.join(`channel-${channelId}`);
      socket.emit('user-joined', { channelId });
    });

    // Leave channel room
    socket.on('leave-channel', (channelId) => {
      socket.leave(`channel-${channelId}`);
      socket.emit('user-left', { channelId });
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
          io.to(`user-${data.receiver}`).emit('new-message', message);
        }
      } catch (error) {
        console.error('Message send error:', error);
      }
    });

    // Typing indicator
    socket.on('typing', (data) => {
      if (data.channel) {
        socket.to(`channel-${data.channel}`).emit('user-typing', {
          userId: data.userId,
          userName: data.userName
        });
      }
    });

    // Stop typing
    socket.on('stop-typing', (data) => {
      if (data.channel) {
        socket.to(`channel-${data.channel}`).emit('user-stop-typing', {
          userId: data.userId
        });
      }
    });

    // Update user status
    socket.on('update-status', (data) => {
      io.emit('user-status-changed', {
        userId: data.userId,
        status: data.status
      });
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
