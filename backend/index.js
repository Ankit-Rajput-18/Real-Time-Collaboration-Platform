import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import { connectDatabase } from './config/database.js';
import { requestLogger } from './middleware/logger.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import workspaceRoutes from './routes/workspaceRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import channelRoutes from './routes/channelRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import { setupSocketHandlers } from './sockets/socketHandler.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(requestLogger);

await connectDatabase();

app.get('/api/health', (req, res) => {
  res.json({
    status: 'Server Running',
    database: mongoose.connection.name,
    environment: process.env.NODE_ENV || 'development',
    uptime: Math.floor(process.uptime()) + ' seconds',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/analytics', analyticsRoutes);

console.log('All API Routes Loaded');
setupSocketHandlers(io);
app.locals.io = io;

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
