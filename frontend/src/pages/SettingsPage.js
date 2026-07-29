import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import EnhancedHeader from '../components/EnhancedHeader';
import EnhancedSidebar from '../components/EnhancedSidebar';
import { FiUser, FiLock, FiBell, FiSettings, FiMoon, FiSun, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  var authCtx = useAuth();
  var user = authCtx ? authCtx.user : null;
  var updateProfile = authCtx ? authCtx.updateProfile : function() { return Promise.resolve({ success: false }); };
  var themeCtx = useTheme();
  var darkMode = themeCtx ? themeCtx.darkMode : false;
  var toggleDarkMode = themeCtx ? themeCtx.toggleDarkMode : function() {};
  var [activeTab, setActiveTab] = useState('profile');
  var [form, setForm] = useState({
    name: (user && user.name) ? user.name : '',
    bio: (user && user.bio) ? user.bio : '',
    avatar: (user && user.avatar) ? user.avatar : ''
  });

  var handleSave = async function() {
    var result = await updateProfile(form);
    if (result && result.success) toast.success('Profile updated!', { icon: '✅' });
    else toast.error('Failed to update profile');
  };

  var tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'security', label: 'Security', icon: FiLock },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'appearance', label: 'Appearance', icon: FiSettings },
  ];

  var avatarUrl = form.avatar || ('https://api.dicebear.com/7.x/avataaars/svg?seed=' + ((user && user.email) ? user.email : 'default'));

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <EnhancedSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <EnhancedHeader />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-6 py-8">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Settings</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage your account and preferences</p>
            </motion.div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="flex space-x-1 px-6 pt-4">
                  {tabs.map(function(tab) {
                    var Icon = tab.icon;
                    return (
                      <button key={tab.id} onClick={function() { setActiveTab(tab.id); }}
                        className={"flex items-center space-x-2 px-5 py-3 rounded-t-xl font-medium transition-all " +
                          (activeTab === tab.id
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700")}>
                        <Icon size={18} /><span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-8">
                {activeTab === 'profile' && (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div className="flex items-center space-x-6 mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
                      <img src={avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full ring-4 ring-blue-500 shadow-xl" />
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">{user ? user.name : 'User'}</h3>
                        <p className="text-gray-500 dark:text-gray-400">{user ? user.email : ''}</p>
                        <span className="mt-2 inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium capitalize">{user ? user.role : 'member'}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                        <input type="text" value={form.name} onChange={function(e) { setForm({ ...form, name: e.target.value }); }}
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl focus:outline-none focus:border-blue-500 transition" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Avatar URL</label>
                        <input type="url" value={form.avatar} onChange={function(e) { setForm({ ...form, avatar: e.target.value }); }} placeholder="https://example.com/avatar.jpg"
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl focus:outline-none focus:border-blue-500 transition" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                      <textarea value={form.bio} onChange={function(e) { setForm({ ...form, bio: e.target.value }); }} rows="4" placeholder="Tell us about yourself..."
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl focus:outline-none focus:border-blue-500 transition resize-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email</label>
                      <input type="email" value={user ? user.email : ''} disabled
                        className="w-full px-4 py-3 border-2 border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-500 rounded-xl cursor-not-allowed" />
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Email cannot be changed</p>
                    </div>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave}
                      className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl font-semibold transition">
                      <FiSave size={18} /><span>Save Changes</span>
                    </motion.button>
                  </motion.div>
                )}

                {activeTab === 'security' && (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Change Password</h3>
                    <div className="space-y-4 max-w-md">
                      {['Current Password', 'New Password', 'Confirm New Password'].map(function(label, i) {
                        return (
                          <div key={i}>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{label}</label>
                            <input type="password" placeholder="Enter password" autoComplete={i === 0 ? 'current-password' : 'new-password'}
                              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl focus:outline-none focus:border-blue-500 transition" />
                          </div>
                        );
                      })}
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={function() { toast.success('Password updated!', { icon: '🔒' }); }}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg font-semibold hover:shadow-xl transition">
                        Update Password
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'notifications' && (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Notification Preferences</h3>
                    {[
                      { label: 'Email Notifications', desc: 'Receive email about your activity', on: true },
                      { label: 'Push Notifications', desc: 'Receive push notifications in browser', on: true },
                      { label: 'Task Assignments', desc: 'Notify when assigned a task', on: true },
                      { label: 'Message Alerts', desc: 'Notify on new messages', on: false },
                      { label: 'Weekly Summary', desc: 'Receive weekly productivity report', on: true },
                    ].map(function(item, i) {
                      return (
                        <div key={i} className="flex items-center justify-between p-5 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-700">
                          <div>
                            <p className="font-semibold text-gray-800 dark:text-white">{item.label}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked={item.on} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      );
                    })}
                  </motion.div>
                )}

                {activeTab === 'appearance' && (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Appearance</h3>

                    <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-lg font-semibold text-gray-800 dark:text-white">Theme Mode</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Choose between light and dark theme</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                          onClick={function() { if (darkMode) toggleDarkMode(); }}
                          className={"p-6 rounded-xl border-2 text-center transition-all " +
                            (!darkMode ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg" : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500")}>
                          <FiSun size={32} className={"mx-auto mb-3 " + (!darkMode ? "text-yellow-500" : "text-gray-400")} />
                          <p className={"font-semibold " + (!darkMode ? "text-blue-700 dark:text-blue-300" : "text-gray-600 dark:text-gray-400")}>Light Mode</p>
                          {!darkMode && <span className="inline-block mt-2 px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-bold">Active</span>}
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                          onClick={function() { if (!darkMode) toggleDarkMode(); }}
                          className={"p-6 rounded-xl border-2 text-center transition-all " +
                            (darkMode ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg" : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500")}>
                          <FiMoon size={32} className={"mx-auto mb-3 " + (darkMode ? "text-blue-400" : "text-gray-400")} />
                          <p className={"font-semibold " + (darkMode ? "text-blue-700 dark:text-blue-300" : "text-gray-600 dark:text-gray-400")}>Dark Mode</p>
                          {darkMode && <span className="inline-block mt-2 px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-bold">Active</span>}
                        </motion.button>
                      </div>
                    </div>

                    <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-200 dark:border-gray-700">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Language</label>
                      <select className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl focus:outline-none focus:border-blue-500 transition">
                        <option>English</option><option>Hindi</option><option>Spanish</option><option>French</option>
                      </select>
                    </div>

                    <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-200 dark:border-gray-700">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Font Size</label>
                      <select className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl focus:outline-none focus:border-blue-500 transition">
                        <option>Small</option><option>Medium (Default)</option><option>Large</option>
                      </select>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
