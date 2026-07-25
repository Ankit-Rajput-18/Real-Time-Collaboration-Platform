import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiBell, FiUser, FiSearch, FiMoon, FiSun, FiSettings, FiChevronDown } from 'react-icons/fi';
import GlobalSearch from './GlobalSearch';
import NotificationCenter from './NotificationCenter';

const EnhancedHeader = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setShowSearch(true); }
      if (e.key === 'Escape') { setShowSearch(false); setShowNotifications(false); setShowUserMenu(false); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <>
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40 transition-colors">
        <div className="px-6">
          <div className="flex items-center justify-between h-16">
            <motion.button whileHover={{ scale: 1.02 }} onClick={() => setShowSearch(true)}
              className="flex items-center space-x-3 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition w-80">
              <FiSearch size={18} className="text-gray-400" />
              <span className="text-gray-500 dark:text-gray-400 text-sm">Search...</span>
              <kbd className="ml-auto px-2 py-0.5 bg-white dark:bg-gray-600 rounded text-xs font-mono text-gray-400">Ctrl+K</kbd>
            </motion.button>

            <div className="flex items-center space-x-3">
              <motion.button whileHover={{ scale: 1.1, rotate: 15 }} onClick={toggleDarkMode}
                className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                {darkMode ? <FiSun size={20} className="text-yellow-500" /> : <FiMoon size={20} className="text-gray-600" />}
              </motion.button>

              <motion.button whileHover={{ scale: 1.1 }} onClick={() => setShowNotifications(true)}
                className="relative p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <FiBell size={20} className="text-gray-600 dark:text-gray-300" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-800"></span>
              </motion.button>

              <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>

              <div className="relative">
                <button onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl px-3 py-2 transition">
                  <img src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (user?.email || 'default')}
                    alt={user?.name} className="w-9 h-9 rounded-full ring-2 ring-blue-500" />
                  <div className="text-left hidden md:block">
                    <p className="font-semibold text-gray-800 dark:text-white text-sm">{user?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
                  </div>
                  <FiChevronDown size={16} className="text-gray-400 hidden md:block" />
                </button>

                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 mt-2 w-60 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border dark:border-gray-700 py-2 z-50">
                      <div className="px-4 py-3 border-b dark:border-gray-700">
                        <p className="font-bold text-gray-800 dark:text-white">{user?.name}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                      <button onClick={() => { navigate('/settings'); setShowUserMenu(false); }}
                        className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                        <FiUser size={18} /><span>Profile</span>
                      </button>
                      <button onClick={() => { navigate('/settings'); setShowUserMenu(false); }}
                        className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                        <FiSettings size={18} /><span>Settings</span>
                      </button>
                      <hr className="my-2 dark:border-gray-700" />
                      <button onClick={() => { logout(); navigate('/login'); }}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                        <FiLogOut size={18} /><span>Logout</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <GlobalSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
      <NotificationCenter isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
    </>
  );
};

export default EnhancedHeader;
