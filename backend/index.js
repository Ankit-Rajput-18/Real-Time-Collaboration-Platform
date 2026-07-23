import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Database
import { connectDatabase } from './config/database.js';

console.log('\n' + '='.repeat(60));
console.log('🔧 ENVIRONMENT CONFIGURATION');
console.log('='.repeat(60));
console.log('📌 NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('📌 PORT:', process.env.PORT || 5000);
console.log('📌 FRONTEND_URL:', process.env.FRONTEND_URL || 'http://localhost:3000');
console.log('='.repeat(60) + '\n');

// Routes
import authRoutes from './routes/authRoutes.js';
import workspaceRoutes from './routes/workspaceRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import channelRoutes from './routes/channelRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import activityRoutes from './routes/activityRoutes.js';

// Socket Handler
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

// ==================== MIDDLEWARE ====================
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ==================== DATABASE CONNECTION ====================
await connectDatabase();

// ==================== ROUTES ====================
console.log('📍 Loading API Routes...\n');

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: '✅ Server Running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/activity', activityRoutes);

console.log('✅ All API Routes Loaded\n');

// ==================== SOCKET.IO ====================
console.log('🔌 Setting up Socket.IO...\n');
setupSocketHandlers(io);
app.locals.io = io;

// ==================== ERROR HANDLERS ====================
app.use((req, res) => {
  res.status(404).json({
    message: '❌ Route not found',
    path: req.url,
    method: req.method
  });
});

app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

// ==================== START SERVER ====================
const PORT = process.env.PORT || 5000;
const ENV = process.env.NODE_ENV || 'development';

httpServer.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║                                                    ║
║   🚀 REAL-TIME COLLABORATION PLATFORM             ║
║                                                    ║
║   ✅ Server Running on Port ${PORT}                      ║
║   📊 Environment: ${ENV.toUpperCase().padEnd(30)}     ║
║   🌐 Frontend: http://localhost:3000               ║
║   💻 Backend: http://localhost:${PORT}                       ║
║   🔌 Socket.IO: Active                             ║
║   🗄️  Database: Connected ✅                       ║
║                                                    ║
║   Ready to accept requests! 🎉                     ║
║                                                    ║
╚════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\n👋 Shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});
