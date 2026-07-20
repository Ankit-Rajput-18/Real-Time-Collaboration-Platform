import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiCheckSquare, FiUsers, FiMessageSquare, FiSettings, FiPlus } from 'react-icons/fi';
import { useWorkspace } from '../hooks/useWorkspace';

const Sidebar = () => {
  const { workspaces, currentWorkspace } = useWorkspace();

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen overflow-y-auto sticky top-0">
      <div className="p-4 border-b border-gray-700">
        <Link to="/dashboard" className="flex items-center space-x-2 hover:text-blue-400">
          <FiHome size={20} />
          <span className="font-semibold">Dashboard</span>
        </Link>
      </div>

      <nav className="p-4 space-y-2">
        <Link
          to="/tasks"
          className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          <FiCheckSquare />
          <span>Tasks</span>
        </Link>
        <Link
          to="/messages"
          className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          <FiMessageSquare />
          <span>Messages</span>
        </Link>
        <Link
          to="/team"
          className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          <FiUsers />
          <span>Team</span>
        </Link>
        <Link
          to="/settings"
          className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          <FiSettings />
          <span>Settings</span>
        </Link>
      </nav>

      <div className="px-4 py-4 border-t border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">Workspaces</h3>
          <button className="p-1 hover:bg-gray-800 rounded" title="Create workspace">
            <FiPlus size={18} />
          </button>
        </div>
        <div className="space-y-2">
          {workspaces.map((workspace) => (
            <Link
              key={workspace._id}
              to={`/workspace/${workspace._id}`}
              className={`block px-3 py-2 rounded-lg text-sm truncate ${
                currentWorkspace?._id === workspace._id
                  ? 'bg-blue-600'
                  : 'hover:bg-gray-800'
              }`}
              title={workspace.name}
            >
              {workspace.name}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
