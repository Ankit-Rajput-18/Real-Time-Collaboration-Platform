#!/bin/bash

echo "🚀 Setting up Advanced Features..."

# ============================================
# BACKEND ADVANCED FEATURES
# ============================================

# Rate Limiting Middleware
cat > backend/middleware/rateLimiter.js << 'EOF'
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later.',
});
EOF

# Error Handler Middleware
cat > backend/middleware/errorHandler.js << 'EOF'
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};
EOF

# Logger Middleware
cat > backend/middleware/logger.js << 'EOF'
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`
    );
  });
  
  next();
};
EOF

# Search Controller
cat > backend/controllers/searchController.js << 'EOF'
import Task from '../models/Task.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import Workspace from '../models/Workspace.js';

export const globalSearch = async (req, res) => {
  try {
    const { query, type = 'all' } = req.query;

    if (!query || query.length < 2) {
      return res.status(400).json({ message: 'Search query too short' });
    }

    const searchRegex = new RegExp(query, 'i');
    let results = {};

    if (type === 'all' || type === 'tasks') {
      const tasks = await Task.find({
        $or: [
          { title: searchRegex },
          { description: searchRegex }
        ]
      }).limit(10).populate('assignedTo', 'name email avatar');
      results.tasks = tasks;
    }

    if (type === 'all' || type === 'users') {
      const users = await User.find({
        $or: [
          { name: searchRegex },
          { email: searchRegex }
        ]
      }).select('-password').limit(10);
      results.users = users;
    }

    if (type === 'all' || type === 'workspaces') {
      const workspaces = await Workspace.find({
        name: searchRegex,
        'members.user': req.userId
      }).limit(10);
      results.workspaces = workspaces;
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
EOF

# Analytics Controller
cat > backend/controllers/analyticsController.js << 'EOF'
import Task from '../models/Task.js';
import Message from '../models/Message.js';
import Activity from '../models/Activity.js';

export const getWorkspaceAnalytics = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Task analytics
    const taskStats = await Task.aggregate([
      {
        $match: {
          workspace: require('mongoose').Types.ObjectId(workspaceId),
          ...dateFilter
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Daily activity
    const dailyActivity = await Activity.aggregate([
      {
        $match: {
          workspace: require('mongoose').Types.ObjectId(workspaceId),
          ...dateFilter
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Top performers
    const topPerformers = await Task.aggregate([
      {
        $match: {
          workspace: require('mongoose').Types.ObjectId(workspaceId),
          status: 'completed',
          ...dateFilter
        }
      },
      {
        $group: {
          _id: '$assignedTo',
          completedTasks: { $sum: 1 }
        }
      },
      { $sort: { completedTasks: -1 } },
      { $limit: 5 }
    ]);

    await Task.populate(topPerformers, { path: '_id', select: 'name email avatar' });

    res.json({
      taskStats,
      dailyActivity,
      topPerformers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
EOF

# Search Routes
cat > backend/routes/searchRoutes.js << 'EOF'
import express from 'express';
import { globalSearch } from '../controllers/searchController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, globalSearch);

export default router;
EOF

# Analytics Routes
cat > backend/routes/analyticsRoutes.js << 'EOF'
import express from 'express';
import { getWorkspaceAnalytics } from '../controllers/analyticsController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/workspace/:workspaceId', verifyToken, getWorkspaceAnalytics);

export default router;
EOF

# Update Backend Index.js
cat > backend/index.js << 'EOF'
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import helmet from 'helmet';
import compression from 'compression';

dotenv.config();

import { connectDatabase } from './config/database.js';
import { requestLogger } from './middleware/logger.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';

// Routes
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

// Security & Performance Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(requestLogger);

// Database Connection
await connectDatabase();

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: '✅ Server Running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/workspaces', apiLimiter, workspaceRoutes);
app.use('/api/tasks', apiLimiter, taskRoutes);
app.use('/api/messages', apiLimiter, messageRoutes);
app.use('/api/channels', apiLimiter, channelRoutes);
app.use('/api/files', apiLimiter, fileRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/search', apiLimiter, searchRoutes);
app.use('/api/analytics', analyticsRoutes);

console.log('✅ All API Routes Loaded');

// Socket.IO
setupSocketHandlers(io);
app.locals.io = io;

// Error Handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(\`
╔════════════════════════════════════════════════════╗
║   🚀 ADVANCED COLLABORATION PLATFORM              ║
║   ✅ Server: http://localhost:\${PORT}                       ║
║   📊 Environment: \${process.env.NODE_ENV || 'development'}                 ║
║   🔌 Socket.IO: Active                             ║
║   🗄️  Database: Connected                          ║
║   🚦 Rate Limiting: Enabled                        ║
║   🔒 Security: Helmet Enabled                      ║
╚════════════════════════════════════════════════════╝
  \`);
});

process.on('SIGINT', async () => {
  console.log('\\n👋 Shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});
EOF

# ============================================
# FRONTEND ADVANCED FEATURES
# ============================================

# Dark Mode Context
cat > frontend/src/context/ThemeContext.js << 'EOF'
import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
EOF

# Search Service
cat > frontend/src/services/search.js << 'EOF'
import api from './api';

export const searchService = {
  globalSearch: (query, type = 'all') => api.get(\`/search?query=\${query}&type=\${type}\`),
};
EOF

# Analytics Service
cat > frontend/src/services/analytics.js << 'EOF'
import api from './api';

export const analyticsService = {
  getWorkspaceAnalytics: (workspaceId, params) => 
    api.get(\`/analytics/workspace/\${workspaceId}\`, { params })
};
EOF

# Global Search Component
cat > frontend/src/components/GlobalSearch.js << 'EOF'
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiFile, FiUser, FiBriefcase } from 'react-icons/fi';
import { searchService } from '../services/search';
import { useNavigate } from 'react-router-dom';

const GlobalSearch = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ tasks: [], users: [], workspaces: [] });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (query.length >= 2) {
        handleSearch();
      } else {
        setResults({ tasks: [], users: [], workspaces: [] });
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [query]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await searchService.globalSearch(query);
      setResults(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (type, id) => {
    onClose();
    if (type === 'task') navigate(\`/tasks?id=\${id}\`);
    if (type === 'user') navigate(\`/team?user=\${id}\`);
    if (type === 'workspace') navigate(\`/workspace/\${id}\`);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
    >
      <motion.div
        initial={{ scale: 0.9, y: -20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: -20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
      >
        {/* Search Input */}
        <div className="p-4 border-b dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <FiSearch className="text-gray-400" size={24} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tasks, users, workspaces..."
              className="flex-1 bg-transparent text-lg focus:outline-none dark:text-white"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600">
                <FiX size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : (
            <>
              {results.tasks?.length > 0 && (
                <SearchSection
                  title="Tasks"
                  icon={<FiFile />}
                  items={results.tasks}
                  onItemClick={(id) => handleResultClick('task', id)}
                />
              )}
              {results.users?.length > 0 && (
                <SearchSection
                  title="Users"
                  icon={<FiUser />}
                  items={results.users}
                  onItemClick={(id) => handleResultClick('user', id)}
                />
              )}
              {results.workspaces?.length > 0 && (
                <SearchSection
                  title="Workspaces"
                  icon={<FiBriefcase />}
                  items={results.workspaces}
                  onItemClick={(id) => handleResultClick('workspace', id)}
                />
              )}
              {query.length >= 2 && 
               !loading && 
               results.tasks?.length === 0 && 
               results.users?.length === 0 && 
               results.workspaces?.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No results found for "{query}"
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const SearchSection = ({ title, icon, items, onItemClick }) => (
  <div className="mb-6">
    <div className="flex items-center space-x-2 text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
      {icon}
      <span>{title}</span>
    </div>
    <div className="space-y-2">
      {items.map((item) => (
        <motion.div
          key={item._id}
          whileHover={{ x: 5 }}
          onClick={() => onItemClick(item._id)}
          className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition"
        >
          <p className="font-medium dark:text-white">{item.title || item.name}</p>
          {item.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {item.description}
            </p>
          )}
        </motion.div>
      ))}
    </div>
  </div>
);

export default GlobalSearch;
EOF

# Notification Component
cat > frontend/src/components/NotificationCenter.js << 'EOF'
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiX, FiCheck, FiTrash2 } from 'react-icons/fi';
import { notificationService } from '../services/notification';
import toast from 'react-hot-toast';

const NotificationCenter = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const loadNotifications = async () => {
    try {
      const response = await notificationService.getNotifications();
      setNotifications(response.data);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead([id]);
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, read: true } : n
      ));
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const deleteNotification = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(notifications.filter(n => n._id !== id));
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      message: '💬',
      task: '✅',
      workspace: '🏢',
      activity: '📊'
    };
    return icons[type] || '🔔';
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed right-0 top-0 h-screen w-96 bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold dark:text-white">Notifications</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={\`px-4 py-2 rounded-lg text-sm font-medium transition \${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }\`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={\`px-4 py-2 rounded-lg text-sm font-medium transition \${
              filter === 'unread' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }\`}
          >
            Unread
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {filteredNotifications.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <FiBell size={64} className="mx-auto mb-4 text-gray-300" />
                <p>No notifications</p>
              </div>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <motion.div
                key={notification._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className={\`p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition \${
                  !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }\`}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium dark:text-white">
                      {notification.data?.description || 'New notification'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification._id)}
                        className="text-blue-600 hover:text-blue-700"
                        title="Mark as read"
                      >
                        <FiCheck size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification._id)}
                      className="text-red-600 hover:text-red-700"
                      title="Delete"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default NotificationCenter;
EOF

# Enhanced Header with Search & Notifications
cat > frontend/src/components/EnhancedHeader.js << 'EOF'
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { 
  FiLogOut, FiBell, FiUser, FiSearch, FiMoon, FiSun,
  FiSettings, FiChevronDown
} from 'react-icons/fi';
import GlobalSearch from './GlobalSearch';
import NotificationCenter from './NotificationCenter';

const EnhancedHeader = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40 transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Search */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSearch(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              <FiSearch size={18} className="text-gray-600 dark:text-gray-300" />
              <span className="text-gray-600 dark:text-gray-300">Search...</span>
              <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded text-xs font-mono">
                Ctrl+K
              </kbd>
            </motion.button>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleDarkMode}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                {darkMode ? (
                  <FiSun size={20} className="text-yellow-500" />
                ) : (
                  <FiMoon size={20} className="text-gray-600" />
                )}
              </motion.button>

              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowNotifications(true)}
                className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <FiBell size={20} className="text-gray-600 dark:text-gray-300" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </motion.button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 pl-6 border-l dark:border-gray-700"
                >
                  <img
                    src={user?.avatar || \`https://api.dicebear.com/7.x/avataaars/svg?seed=\${user?.email}\`}
                    alt={user?.name}
                    className="w-10 h-10 rounded-full ring-2 ring-blue-500"
                  />
                  <div className="text-left">
                    <p className="font-semibold text-gray-800 dark:text-white text-sm">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role}</p>
                  </div>
                  <FiChevronDown className="text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border dark:border-gray-700 py-2"
                  >
                    <button
                      onClick={() => {
                        navigate('/settings');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      <FiSettings size={18} />
                      <span className="dark:text-white">Settings</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate('/settings');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      <FiUser size={18} />
                      <span className="dark:text-white">Profile</span>
                    </button>
                    <hr className="my-2 dark:border-gray-700" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                    >
                      <FiLogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <GlobalSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />

      {/* Notification Center */}
      <NotificationCenter 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </>
  );
};

export default EnhancedHeader;
EOF

# Update Sidebar with Dark Mode
cat > frontend/src/components/EnhancedSidebar.js << 'EOF'
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiHome, FiCheckSquare, FiUsers, FiMessageSquare, 
  FiSettings, FiGrid, FiTrendingUp, FiGlobe 
} from 'react-icons/fi';
import { useWorkspace } from '../hooks/useWorkspace';

const EnhancedSidebar = () => {
  const location = useLocation();
  const { workspaces, currentWorkspace } = useWorkspace();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FiHome },
    { path: '/board', label: 'Board', icon: FiGrid },
    { path: '/tasks', label: 'Tasks', icon: FiCheckSquare },
    { path: '/messages', label: 'Messages', icon: FiMessageSquare },
    { path: '/team', label: 'Team', icon: FiUsers },
    { path: '/settings', label: 'Settings', icon: FiSettings },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white h-screen overflow-y-auto sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <Link to="/dashboard" className="flex items-center space-x-3">
          <FiGlobe size={32} className="text-blue-400" />
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            CollabHub
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                whileHover={{ x: 5 }}
                className={\`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all \${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                    : 'hover:bg-gray-700'
                }\`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Workspaces */}
      <div className="px-4 py-6 border-t border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm text-gray-400">WORKSPACES</h3>
          <button className="p-1 hover:bg-gray-700 rounded">
            <FiTrendingUp size={16} />
          </button>
        </div>
        <div className="space-y-2">
          {workspaces.map((workspace) => (
            <motion.div
              key={workspace._id}
              whileHover={{ x: 5 }}
              className={\`px-3 py-2 rounded-lg text-sm truncate cursor-pointer \${
                currentWorkspace?._id === workspace._id
                  ? 'bg-blue-600'
                  : 'hover:bg-gray-700'
              }\`}
              title={workspace.name}
            >
              {workspace.name}
            </motion.div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default EnhancedSidebar;
EOF

# Update Main App.js
cat > frontend/src/App.js << 'EOF'
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdvancedDashboard from './pages/AdvancedDashboard';
import KanbanBoard from './pages/KanbanBoard';
import TasksPage from './pages/TasksPage';
import AdvancedMessagesPage from './pages/AdvancedMessagesPage';
import AdvancedTeamPage from './pages/AdvancedTeamPage';
import SettingsPage from './pages/SettingsPage';

import './styles/App.css';

function App() {
  useEffect(() => {
    // Global keyboard shortcuts
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Trigger search
        document.dispatchEvent(new CustomEvent('openSearch'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '12px',
            padding: '16px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <Router 
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <ThemeProvider>
          <AuthProvider>
            <WorkspaceProvider>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <AdvancedDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/board"
                  element={
                    <ProtectedRoute>
                      <KanbanBoard />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/tasks"
                  element={
                    <ProtectedRoute>
                      <TasksPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/messages"
                  element={
                    <ProtectedRoute>
                      <AdvancedMessagesPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/team"
                  element={
                    <ProtectedRoute>
                      <AdvancedTeamPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </WorkspaceProvider>
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </>
  );
}

export default App;
EOF

# Dark Mode CSS
cat >> frontend/src/styles/App.css << 'EOF'

/* Dark Mode Styles */
.dark {
  --bg-primary: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --text-primary: #ffffff;
  --text-secondary: #a0a0a0;
}

.dark body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

/* Smooth transitions */
* {
  transition: background-color 0.2s ease, color 0.2s ease;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.dark ::-webkit-scrollbar-track {
  background: #2d2d2d;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Animation classes */
@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

/* Custom utilities */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.glass-effect {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
EOF

# Package.json updates for backend
cat > backend/package.json << 'EOF'
{
  "name": "collaboration-platform-backend",
  "version": "2.0.0",
  "description": "Advanced real-time team collaboration platform backend",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "start": "cross-env NODE_ENV=production node index.js",
    "dev": "cross-env NODE_ENV=development nodemon index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": ["collaboration", "real-time", "team", "productivity"],
  "author": "Ankit Rajput",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.2.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "socket.io": "^4.7.0",
    "cloudinary": "^1.35.0",
    "multer": "^1.4.5-lts.1",
    "express-validator": "^7.0.0",
    "nodemailer": "^6.9.3",
    "express-rate-limit": "^6.8.0",
    "helmet": "^7.0.0",
    "compression": "^1.7.4"
  },
  "devDependencies": {
    "nodemon": "^2.0.22",
    "cross-env": "^7.0.3"
  }
}
EOF

echo "✅ All advanced features setup complete!"
echo ""
echo "📦 Now install additional packages:"
echo "   cd backend && npm install"
echo "   cd frontend && npm install"
echo ""
echo "🚀 Then run the project!"

