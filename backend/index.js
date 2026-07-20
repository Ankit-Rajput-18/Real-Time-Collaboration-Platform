import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';

dotenv.config();

console.log('\n' + '='.repeat(60));
console.log('🔍 ENVIRONMENT CHECK');
console.log('='.repeat(60));
console.log('✅ NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('✅ PORT:', process.env.PORT || 5000);
console.log('✅ MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : 'NOT SET ❌');
console.log('✅ JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET ❌');
console.log('='.repeat(60) + '\n');

// Import Routes
import authRoutes from './routes/authRoutes.js';
import workspaceRoutes from './routes/workspaceRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import channelRoutes from './routes/channelRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

// Import Socket Handler
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
console.log('📡 Connecting to MongoDB Atlas...\n');

// IMPORTANT: सिर्फ environment variable use करो, localhost नहीं!
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error('\n❌ CRITICAL ERROR: MONGODB_URI is not set in .env file');
  console.error('Please add: MONGODB_URI=mongodb+srv://... in your .env file\n');
  process.exit(1);
}

console.log('📍 Connection String (masked):');
console.log('   ' + mongoUri.substring(0, 30) + '...[hidden]...' + mongoUri.substring(mongoUri.length - 20));
console.log('');

mongoose.connect(mongoUri)
  .then(() => {
    const dbName = mongoose.connection.name;
    const dbHost = mongoose.connection.host;
    
    console.log('✅ MongoDB Connected Successfully!');
    console.log('   Database: ' + dbName);
    console.log('   Host: ' + dbHost);
    console.log('');
  })
  .catch(err => {
    console.error('\n❌ MongoDB Connection Failed!');
    console.error('Error:', err.message);
    console.error('\nPossible causes:');
    console.error('  1. MONGODB_URI is incorrect');
    console.error('  2. Username/Password is wrong');
    console.error('  3. IP Address not whitelisted in Atlas');
    console.error('  4. Network connectivity issue\n');
    process.exit(1);
  });

// ==================== ROUTES ====================
console.log('📍 Loading API Routes...\n');

// Health check endpoint
app.get('/api/health', (req, res) => {
  const connected = mongoose.connection.readyState === 1;
  const dbName = mongoose.connection.name || 'Not Connected';
  const dbHost = mongoose.connection.host || 'Not Connected';
  
  res.json({ 
    status: '✅ Server Running',
    database: {
      connected: connected,
      name: dbName,
      host: dbHost
    },
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

console.log('✅ All API Routes Loaded\n');

// ==================== SOCKET.IO ====================
console.log('🔌 Setting up Socket.IO...\n');
setupSocketHandlers(io);
app.locals.io = io;

// ==================== ERROR HANDLERS ====================
app.use((req, res) => {
  console.log(`⚠️  404 Not Found: ${req.method} ${req.url}`);
  res.status(404).json({ 
    message: 'Route not found',
    path: req.url,
    method: req.method
  });
});

app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
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
║   🗄️  Database: MongoDB Atlas Connected             ║
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
