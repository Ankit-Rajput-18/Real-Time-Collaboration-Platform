import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useWorkspace } from '../hooks/useWorkspace';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiUsers, FiCheckSquare, FiTrendingUp, FiActivity, FiCalendar, FiBarChart2 } from 'react-icons/fi';

const AdvancedDashboard = () => {
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspace();
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    overdueTasks: 0
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentWorkspace?._id) {
      loadDashboardData();
    }
  }, [currentWorkspace]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch stats
      // const statsResponse = await taskService.getTaskStats(currentWorkspace._id);
      
      // Fetch activities
      // const activitiesResponse = await activityService.getWorkspaceActivity(currentWorkspace._id);
      
      // setStats(statsResponse.data);
      // setActivities(activitiesResponse.data.activities);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

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
              <h1 className="text-4xl font-bold text-gray-800 mb-8">
                Dashboard 📊
              </h1>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  icon={<FiCheckSquare size={28} />}
                  title="Total Tasks"
                  value={stats.totalTasks}
                  color="blue"
                />
                <StatCard
                  icon={<FiTrendingUp size={28} />}
                  title="In Progress"
                  value={stats.inProgressTasks}
                  color="yellow"
                />
                <StatCard
                  icon={<FiBarChart2 size={28} />}
                  title="Completed"
                  value={stats.completedTasks}
                  color="green"
                />
                <StatCard
                  icon={<FiCalendar size={28} />}
                  title="Overdue"
                  value={stats.overdueTasks}
                  color="red"
                />
              </div>

              {/* Activities */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b flex items-center space-x-3">
                  <FiActivity size={24} className="text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
                </div>
                <div className="divide-y">
                  {activities.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      No activities yet
                    </div>
                  ) : (
                    activities.map((activity) => (
                      <ActivityItem key={activity._id} activity={activity} />
                    ))
                  )}
                </div>
              </div>
            </div>
          </main>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const ActivityItem = ({ activity }) => {
  const getActivityIcon = (type) => {
    const icons = {
      task_created: '✏️',
      task_updated: '🔄',
      task_completed: '✅',
      message_sent: '💬',
      user_joined: '👤',
      file_uploaded: '📁'
    };
    return icons[type] || '📌';
  };

  return (
    <div className="p-4 hover:bg-gray-50 transition">
      <div className="flex items-start space-x-4">
        <span className="text-2xl">{getActivityIcon(activity.type)}</span>
        <div className="flex-1">
          <p className="text-gray-800 font-medium">{activity.description}</p>
          <p className="text-sm text-gray-500 mt-1">
            by {activity.user?.name || 'Unknown'} • {new Date(activity.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdvancedDashboard;
