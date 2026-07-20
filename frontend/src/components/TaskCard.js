import React from 'react';
import { FiEdit2, FiTrash2, FiClock, FiFlag } from 'react-icons/fi';

const TaskCard = ({ task, onEdit, onDelete }) => {
  const getPriorityColor = (priority) => {
    const colors = {
      high: 'text-red-600 bg-red-100',
      medium: 'text-yellow-600 bg-yellow-100',
      low: 'text-green-600 bg-green-100'
    };
    return colors[priority] || colors.medium;
  };

  const getStatusColor = (status) => {
    const colors = {
      todo: 'bg-gray-200 text-gray-800',
      inprogress: 'bg-blue-200 text-blue-800',
      completed: 'bg-green-200 text-green-800'
    };
    return colors[status] || colors.todo;
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-800 flex-1">{task.title}</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(task)}
            className="p-1 hover:bg-blue-100 rounded text-blue-600"
            title="Edit"
          >
            <FiEdit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="p-1 hover:bg-red-100 rounded text-red-600"
            title="Delete"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-gray-600 text-sm mb-3">{task.description}</p>
      )}

      <div className="flex items-center space-x-3 mb-3">
        <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(task.priority)}`}>
          <FiFlag className="inline mr-1" size={12} />
          {task.priority}
        </span>
        <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(task.status)}`}>
          {task.status}
        </span>
      </div>

      {task.dueDate && (
        <div className="flex items-center text-sm text-gray-500">
          <FiClock className="mr-2" size={14} />
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </div>
      )}

      {task.assignedTo && (
        <div className="mt-3 pt-3 border-t">
          <p className="text-xs text-gray-600">
            Assigned to: <span className="font-semibold">{task.assignedTo.name}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
