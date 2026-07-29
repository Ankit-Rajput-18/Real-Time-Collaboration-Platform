import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiCheckSquare, FiUsers, FiMessageSquare, FiSettings, FiGrid, FiPlus, FiGlobe } from 'react-icons/fi';
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
    <aside className="w-64 bg-gray-900 text-white h-screen overflow-y-auto sticky top-0 flex flex-col flex-shrink-0">
      <div className="p-6 border-b border-gray-700/50">
        <Link to="/dashboard" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <FiGlobe size={22} />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            CollabHub
          </span>
        </Link>
      </div>

      <nav className="p-4 space-y-1.5 flex-1">
        {menuItems.map((item) => {
          var Icon = item.icon;
          var isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}
                className={"flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 " +
                  (isActive ? "bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/25" : "hover:bg-white/10")}>
                <Icon size={20} className={isActive ? "text-white" : "text-gray-400"} />
                <span className={"font-medium " + (isActive ? "text-white" : "text-gray-300")}>{item.label}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-5 border-t border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-xs text-gray-400 uppercase tracking-wider">Workspaces</h3>
          <motion.button whileHover={{ scale: 1.1, rotate: 90 }} className="p-1.5 hover:bg-white/10 rounded-lg transition">
            <FiPlus size={16} className="text-gray-400" />
          </motion.button>
        </div>
        <div className="space-y-1.5">
          {(!workspaces || workspaces.length === 0) ? (
            <p className="text-xs text-gray-500 text-center py-2">No workspaces yet</p>
          ) : (
            workspaces.map((w) => (
              <motion.div key={w._id} whileHover={{ x: 3 }}
                className={"px-3 py-2.5 rounded-lg text-sm truncate cursor-pointer transition-all duration-200 " +
                  (currentWorkspace?._id === w._id ? "bg-blue-600/20 text-blue-400 border border-blue-500/30" : "hover:bg-white/5 text-gray-400 hover:text-gray-300")}>
                <div className="flex items-center space-x-2">
                  <div className={"w-2 h-2 rounded-full " + (currentWorkspace?._id === w._id ? "bg-blue-400" : "bg-gray-600")} />
                  <span className="truncate">{w.name}</span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <div className="p-4 border-t border-gray-700/50">
        <div className="flex items-center space-x-3 px-3 py-2 bg-white/5 rounded-xl">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-gray-400">System Online</span>
        </div>
      </div>
    </aside>
  );
};

export default EnhancedSidebar;
