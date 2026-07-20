import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useWorkspace } from '../hooks/useWorkspace';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiUsers, FiCheckSquare, FiTrendingUp, FiPlus } from 'react-icons/fi';

const DashboardPage = () => {
  const { user } = useAuth();
  const { workspaces, fetchWorkspaces, loading } = useWorkspace();
  const [stats, setStats] = useState({
    totalWorkspaces: 0,
    totalMembers: 0,
    totalTasks: 0
  });

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchWorkspaces();
      if (data) {
        setStats({
          totalWorkspaces: data.length,
          totalMembers: data.reduce((acc, w) => acc + w.members.length, 0),
          totalTasks: 0 // You can calculate this from tasks
        });
      }
    };
    loadData();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        {loading ? (
          <LoadingSpinner fullScreen />
        ) : (
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 py-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Welcome, {user?.name}! 👋</h2>

              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Workspaces</p>
                      <p className="text-3xl font-bold text-gray-800">{stats.totalWorkspaces}</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <FiTrendingUp className="text-blue-600" size={24} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Team Members</p>
                      <p className="text-3xl font-bold text-gray-800">{stats.totalMembers}</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <FiUsers className="text-green-600" size={24} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Active Tasks</p>
                      <p className="text-3xl font-bold text-gray-800">{stats.totalTasks}</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <FiCheckSquare className="text-purple-600" size={24} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Workspaces List */}
              <div className="bg-white rounded-lg shadow">
                <div className="flex items-center justify-between p-6 border-b">
                  <h3 className="text-xl font-bold text-gray-800">My Workspaces</h3>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <FiPlus size={18} />
                    <span>New Workspace</span>
                  </button>
                </div>

                {workspaces.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <p>No workspaces yet. Create one to get started!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                    {workspaces.map((workspace) => (
                      <div
                        key={workspace._id}
                        className="border rounded-lg p-4 hover:shadow-lg transition cursor-pointer"
                      >
                        <h4 className="font-semibold text-gray-800 mb-2">{workspace.name}</h4>
                        <p className="text-sm text-gray-600 mb-4">{workspace.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{workspace.members.length} members</span>
                          <span>{workspace.channels?.length || 0} channels</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </main>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
