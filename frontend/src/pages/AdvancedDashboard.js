import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useWorkspace } from '../hooks/useWorkspace';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  FiUsers, FiCheckSquare, FiTrendingUp, FiActivity, 
  FiCalendar, FiBarChart2, FiClock, FiTarget,
  FiAward, FiZap, FiMessageSquare, FiAlertCircle
} from 'react-icons/fi';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { format, subDays } from 'date-fns';

const AdvancedDashboard = () => {
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspace();
  const [stats, setStats] = useState({
    totalTasks: 45,
    completedTasks: 32,
    inProgressTasks: 8,
    overdueTasks: 5,
    totalMessages: 234,
    activeMembers: 12,
    productivity: 87
  });

  const [activities, setActivities] = useState([
    { id: 1, type: 'task_completed', user: 'John Doe', description: 'Completed "Design Homepage"', time: '5 min ago', icon: '✅' },
    { id: 2, type: 'message_sent', user: 'Sarah Smith', description: 'Sent a message in #general', time: '12 min ago', icon: '💬' },
    { id: 3, type: 'task_created', user: 'Mike Johnson', description: 'Created new task "API Integration"', time: '1 hour ago', icon: '✏️' },
    { id: 4, type: 'user_joined', user: 'Emma Wilson', description: 'Joined the workspace', time: '2 hours ago', icon: '👤' },
  ]);

  // Chart Data
  const weeklyData = [
    { day: 'Mon', tasks: 12, messages: 45 },
    { day: 'Tue', tasks: 19, messages: 52 },
    { day: 'Wed', tasks: 15, messages: 38 },
    { day: 'Thu', tasks: 25, messages: 67 },
    { day: 'Fri', tasks: 22, messages: 58 },
    { day: 'Sat', tasks: 8, messages: 23 },
    { day: 'Sun', tasks: 5, messages: 15 },
  ];

  const taskDistribution = [
    { name: 'Completed', value: 32, color: '#10b981' },
    { name: 'In Progress', value: 8, color: '#3b82f6' },
    { name: 'To Do', value: 5, color: '#f59e0b' },
  ];

  const productivityTrend = [
    { month: 'Jan', productivity: 65 },
    { month: 'Feb', productivity: 72 },
    { month: 'Mar', productivity: 68 },
    { month: 'Apr', productivity: 78 },
    { month: 'May', productivity: 85 },
    { month: 'Jun', productivity: 87 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-gray-600 text-lg">Here's what's happening with your team today.</p>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              <StatCard
                icon={<FiCheckSquare size={28} />}
                title="Total Tasks"
                value={stats.totalTasks}
                change="+12%"
                changeType="positive"
                color="blue"
                variants={itemVariants}
              />
              <StatCard
                icon={<FiTrendingUp size={28} />}
                title="Productivity"
                value={`${stats.productivity}%`}
                change="+5%"
                changeType="positive"
                color="green"
                variants={itemVariants}
              />
              <StatCard
                icon={<FiUsers size={28} />}
                title="Active Members"
                value={stats.activeMembers}
                change="+3"
                changeType="positive"
                color="purple"
                variants={itemVariants}
              />
              <StatCard
                icon={<FiMessageSquare size={28} />}
                title="Messages"
                value={stats.totalMessages}
                change="+45"
                changeType="positive"
                color="pink"
                variants={itemVariants}
              />
            </motion.div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Weekly Activity Chart */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Weekly Activity</h3>
                  <FiBarChart2 className="text-blue-500" size={24} />
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="tasks" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="messages" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Task Distribution */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Task Distribution</h3>
                  <FiTarget className="text-purple-500" size={24} />
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={taskDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {taskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Productivity Trend */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300 lg:col-span-2"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Productivity Trend</h3>
                  <FiTrendingUp className="text-green-500" size={24} />
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={productivityTrend}>
                    <defs>
                      <linearGradient id="colorProductivity" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="productivity" 
                      stroke="#10b981" 
                      fillOpacity={1} 
                      fill="url(#colorProductivity)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* Activity Feed & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    <FiActivity className="mr-2 text-blue-500" size={24} />
                    Recent Activity
                  </h3>
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {activities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200 border border-gray-100"
                    >
                      <span className="text-3xl">{activity.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.user}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-1 flex items-center">
                          <FiClock className="mr-1" size={12} />
                          {activity.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white"
              >
                <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
                <div className="space-y-3">
                  <QuickActionButton
                    icon={<FiCheckSquare />}
                    label="Create Task"
                    onClick={() => {}}
                  />
                  <QuickActionButton
                    icon={<FiMessageSquare />}
                    label="Send Message"
                    onClick={() => {}}
                  />
                  <QuickActionButton
                    icon={<FiUsers />}
                    label="Invite Member"
                    onClick={() => {}}
                  />
                  <QuickActionButton
                    icon={<FiCalendar />}
                    label="Schedule Meeting"
                    onClick={() => {}}
                  />
                </div>

                {/* Motivational Quote */}
                <div className="mt-8 pt-6 border-t border-white/20">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <FiAward className="mb-3" size={32} />
                    <p className="text-sm font-medium mb-2">Today's Motivation</p>
                    <p className="text-xs opacity-90">
                      "The only way to do great work is to love what you do." - Steve Jobs
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, change, changeType, color, variants }) => {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    pink: 'from-pink-500 to-pink-600',
  };

  return (
    <motion.div
      variants={variants}
      whileHover={{ scale: 1.05, y: -5 }}
      className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border border-gray-100"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colors[color]} text-white shadow-lg`}>
          {icon}
        </div>
        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
          changeType === 'positive' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {change}
        </span>
      </div>
      <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </motion.div>
  );
};

const QuickActionButton = ({ icon, label, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.05, x: 5 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="w-full flex items-center space-x-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 transition-all duration-200"
  >
    <span className="text-xl">{icon}</span>
    <span className="font-medium">{label}</span>
  </motion.button>
);

export default AdvancedDashboard;
