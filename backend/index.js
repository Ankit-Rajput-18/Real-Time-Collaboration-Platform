import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';

console.log('\n🔍 Environment Check:');
console.log('   MONGODB_URI:', process.env.MONGODB_URI ? '✅' : '❌');
console.log('   NODE_ENV:', process.env.NODE_ENV || 'development');

// Routes
import authRoutes from './routes/authRoutes.js';
import workspaceRoutes from './routes/workspaceRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import channelRoutes from './routes/channelRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import activityRoutes from './routes/activityRoutes.js';

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

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Database
console.log('\n📡 Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected -', mongoose.connection.name);
  })
  .catch(err => {
    console.error('❌ MongoDB Error:', err.message);
    process.exit(1);
  });

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: '✅ Running',
    db: mongoose.connection.name,
    timestamp: new Date()
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

console.log('\n📍 Routes Loaded ✅\n');

// Socket.IO
setupSocketHandlers(io);
app.locals.io = io;

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({ message: err.message });
});

// Start Server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   🚀 ADVANCED COLLABORATION PLATFORM   ║
║   ✅ Running on Port ${PORT}              ║
║   🗄️  Database Connected               ║
║   🔌 Socket.IO Active                  ║
║   Ready! 🎉                            ║
╚════════════════════════════════════════╝
  `);
});
