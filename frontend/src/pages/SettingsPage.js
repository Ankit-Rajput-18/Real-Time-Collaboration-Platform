import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { FiUser, FiLock, FiBell, FiSettings } from 'react-icons/fi';

const SettingsPage = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateProfile(formData);
    if (result.success) {
      alert('Profile updated successfully!');
    } else {
      alert('Failed to update profile');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Settings</h1>

            <div className="bg-white rounded-lg shadow">
              {/* Tabs */}
              <div className="border-b">
                <div className="flex space-x-8 px-6">
                  {[
                    { id: 'profile', label: 'Profile', icon: FiUser },
                    { id: 'security', label: 'Security', icon: FiLock },
                    { id: 'notifications', label: 'Notifications', icon: FiBell },
                    { id: 'preferences', label: 'Preferences', icon: FiSettings }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 border-b-2 transition ${
                        activeTab === tab.id
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      <tab.icon size={18} />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {activeTab === 'profile' && (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        rows="4"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Avatar URL
                      </label>
                      <input
                        type="url"
                        value={formData.avatar}
                        onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://example.com/avatar.jpg"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Save Changes
                    </button>
                  </form>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <input
                          type="password"
                          placeholder="Current Password"
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                        <input
                          type="password"
                          placeholder="New Password"
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                        <input
                          type="password"
                          placeholder="Confirm New Password"
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                          Update Password
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-500">Receive email about your activity</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-gray-500">Receive push notifications</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                )}

                {activeTab === 'preferences' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Theme
                      </label>
                      <select className="w-full px-4 py-2 border rounded-lg">
                        <option>Light</option>
                        <option>Dark</option>
                        <option>Auto</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language
                      </label>
                      <select className="w-full px-4 py-2 border rounded-lg">
                        <option>English</option>
                        <option>Hindi</option>
                      </select>
                    </div>
                  </div>
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
