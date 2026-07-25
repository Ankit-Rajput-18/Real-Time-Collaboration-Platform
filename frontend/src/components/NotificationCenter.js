import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiX, FiCheck, FiTrash2, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const NotificationCenter = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([
    { _id: '1', type: 'task', data: { description: 'You have been assigned a new task: "Design Homepage"' }, read: false, createdAt: new Date(Date.now() - 5 * 60000).toISOString() },
    { _id: '2', type: 'message', data: { description: 'Sarah sent you a message in #general' }, read: false, createdAt: new Date(Date.now() - 30 * 60000).toISOString() },
    { _id: '3', type: 'workspace', data: { description: 'Mike joined the workspace "Project Alpha"' }, read: true, createdAt: new Date(Date.now() - 2 * 3600000).toISOString() },
    { _id: '4', type: 'activity', data: { description: 'Task "API Integration" was marked as completed' }, read: true, createdAt: new Date(Date.now() - 5 * 3600000).toISOString() },
  ]);
  const [filter, setFilter] = useState('all');

  const getIcon = (type) => ({ message: '💬', task: '✅', workspace: '🏢', activity: '📊' }[type] || '🔔');

  const getTimeAgo = (date) => {
    const mins = Math.floor((new Date() - new Date(date)) / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return mins + 'm ago';
    if (mins < 1440) return Math.floor(mins / 60) + 'h ago';
    return Math.floor(mins / 1440) + 'd ago';
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
    toast.success('Marked as read', { duration: 1500 });
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success('All marked as read');
  };

  const deleteNotif = (id) => {
    setNotifications(notifications.filter(n => n._id !== id));
    toast.success('Deleted', { duration: 1500 });
  };

  const clearAll = () => { setNotifications([]); toast.success('All cleared'); };

  const filtered = notifications.filter(n => filter === 'unread' ? !n.read : true);
  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="fixed inset-0 bg-black/30 z-40" />

      <motion.div
        initial={{ opacity: 0, x: 400 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 400 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-screen w-96 bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col"
      >
        <div className="p-6 border-b dark:border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <FiBell size={24} />
              <h3 className="text-xl font-bold">Notifications</h3>
              {unreadCount > 0 && <span className="bg-red-500 text-xs font-bold px-2 py-1 rounded-full">{unreadCount}</span>}
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full"><FiX size={20} /></button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <button onClick={() => setFilter('all')} className={'px-4 py-2 rounded-lg text-sm font-medium ' + (filter === 'all' ? 'bg-white text-blue-600' : 'bg-white/20')}>All</button>
              <button onClick={() => setFilter('unread')} className={'px-4 py-2 rounded-lg text-sm font-medium ' + (filter === 'unread' ? 'bg-white text-blue-600' : 'bg-white/20')}>Unread</button>
            </div>
            <div className="flex space-x-2">
              <button onClick={markAllAsRead} className="p-2 hover:bg-white/20 rounded-lg" title="Mark all read"><FiCheckCircle size={18} /></button>
              <button onClick={clearAll} className="p-2 hover:bg-white/20 rounded-lg" title="Clear all"><FiTrash2 size={18} /></button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <AnimatePresence>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <FiBell size={64} className="mb-4 text-gray-300" />
                <p className="text-lg font-medium">No notifications</p>
                <p className="text-sm mt-1">You're all caught up!</p>
              </div>
            ) : (
              filtered.map((n, i) => (
                <motion.div key={n._id} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: i * 0.05 }}
                  className={'p-5 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition ' + (!n.read ? 'bg-blue-50/50 dark:bg-blue-900/10 border-l-4 border-l-blue-500' : '')}>
                  <div className="flex items-start space-x-4">
                    <span className="text-3xl">{getIcon(n.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-white">{n.data?.description}</p>
                      <p className="text-xs text-gray-500 mt-2">{getTimeAgo(n.createdAt)}</p>
                    </div>
                    <div className="flex space-x-1">
                      {!n.read && <button onClick={() => markAsRead(n._id)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"><FiCheck size={14} /></button>}
                      <button onClick={() => deleteNotif(n._id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full"><FiTrash2 size={14} /></button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
};

export default NotificationCenter;
