import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import EnhancedHeader from '../components/EnhancedHeader';
import EnhancedSidebar from '../components/EnhancedSidebar';
import {
  FiUsers, FiCheckSquare, FiTrendingUp, FiActivity,
  FiCalendar, FiBarChart2, FiClock, FiTarget,
  FiAward, FiMessageSquare
} from 'react-icons/fi';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const AdvancedDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { icon: <FiCheckSquare size={26} />, title: 'Total Tasks', value: 45, change: '+12%', positive: true, color: 'from-blue-500 to-blue-600' },
    { icon: <FiTrendingUp size={26} />, title: 'Productivity', value: '87%', change: '+5%', positive: true, color: 'from-green-500 to-green-600' },
    { icon: <FiUsers size={26} />, title: 'Active Members', value: 12, change: '+3', positive: true, color: 'from-purple-500 to-purple-600' },
    { icon: <FiMessageSquare size={26} />, title: 'Messages', value: 234, change: '+45', positive: true, color: 'from-pink-500 to-pink-600' },
  ];

  const weeklyData = [
    { day: 'Mon', tasks: 12, messages: 45 },
    { day: 'Tue', tasks: 19, messages: 52 },
    { day: 'Wed', tasks: 15, messages: 38 },
    { day: 'Thu', tasks: 25, messages: 67 },
    { day: 'Fri', tasks: 22, messages: 58 },
    { day: 'Sat', tasks: 8, messages: 23 },
    { day: 'Sun', tasks: 5, messages: 15 },
  ];

  const taskDist = [
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

  const activities = [
    { id: 1, icon: '✅', user: 'John Doe', desc: 'Completed "Design Homepage"', time: '5 min ago' },
    { id: 2, icon: '💬', user: 'Sarah Smith', desc: 'Sent a message in #general', time: '12 min ago' },
    { id: 3, icon: '✏️', user: 'Mike Johnson', desc: 'Created new task "API Integration"', time: '1 hour ago' },
    { id: 4, icon: '👤', user: 'Emma Wilson', desc: 'Joined the workspace', time: '2 hours ago' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <EnhancedSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <EnhancedHeader />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">Here's what's happening with your team today.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }} whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className={"p-3 rounded-xl bg-gradient-to-br " + stat.color + " text-white shadow-lg"}>{stat.icon}</div>
                    <span className={"text-sm font-semibold px-3 py-1 rounded-full " + (stat.positive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700")}>{stat.change}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">Weekly Activity</h3>
                  <FiBarChart2 className="text-blue-500" size={24} />
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                    <Legend />
                    <Bar dataKey="tasks" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Tasks" />
                    <Bar dataKey="messages" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Messages" />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">Task Distribution</h3>
                  <FiTarget className="text-purple-500" size={24} />
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={taskDist} cx="50%" cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => name + ' ' + (percent * 100).toFixed(0) + '%'}
                      outerRadius={100} dataKey="value">
                      {taskDist.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Productivity Trend</h3>
                <FiTrendingUp className="text-green-500" size={24} />
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={productivityTrend}>
                  <defs>
                    <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                  <Area type="monotone" dataKey="productivity" stroke="#10b981" fillOpacity={1} fill="url(#colorProd)" name="Productivity %" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
                className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                    <FiActivity className="mr-2 text-blue-500" size={22} />Recent Activity
                  </h3>
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">View All</button>
                </div>
                <div className="space-y-3">
                  {activities.map((a, i) => (
                    <motion.div key={a.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }}
                      className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition border border-gray-100 dark:border-gray-700">
                      <span className="text-2xl">{a.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{a.user}</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-0.5">{a.desc}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 flex items-center">
                          <FiClock className="mr-1" size={11} />{a.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
                className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
                <div className="space-y-3">
                  {[
                    { icon: <FiCheckSquare />, label: 'Create Task' },
                    { icon: <FiMessageSquare />, label: 'Send Message' },
                    { icon: <FiUsers />, label: 'Invite Member' },
                    { icon: <FiCalendar />, label: 'Schedule Meeting' },
                  ].map((action, i) => (
                    <motion.button key={i} whileHover={{ scale: 1.05, x: 5 }} whileTap={{ scale: 0.95 }}
                      className="w-full flex items-center space-x-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 transition text-left">
                      <span className="text-xl">{action.icon}</span>
                      <span className="font-medium">{action.label}</span>
                    </motion.button>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-white/20">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <FiAward className="mb-3" size={28} />
                    <p className="text-sm font-medium mb-1">Daily Motivation</p>
                    <p className="text-xs opacity-90">"The only way to do great work is to love what you do." - Steve Jobs</p>
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

export default AdvancedDashboard;
