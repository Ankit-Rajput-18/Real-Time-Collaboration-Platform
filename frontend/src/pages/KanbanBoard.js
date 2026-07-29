import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EnhancedHeader from '../components/EnhancedHeader';
import EnhancedSidebar from '../components/EnhancedSidebar';
import { FiPlus, FiMoreVertical, FiClock, FiFlag } from 'react-icons/fi';
import toast from 'react-hot-toast';

const KanbanBoard = () => {
  const [columns, setColumns] = useState({
    todo: {
      id: 'todo', title: 'To Do', color: 'gray', emoji: '📋',
      tasks: [
        { id: '1', title: 'Design Homepage', description: 'Create mockups for the new homepage', priority: 'high', assignee: { name: 'John', avatar: 'https://i.pravatar.cc/150?img=1' }, dueDate: '2024-01-20', labels: ['Design', 'UI'] },
        { id: '2', title: 'Write Documentation', description: 'Update API documentation', priority: 'medium', assignee: { name: 'Sarah', avatar: 'https://i.pravatar.cc/150?img=2' }, dueDate: '2024-01-22', labels: ['Docs'] },
      ]
    },
    inprogress: {
      id: 'inprogress', title: 'In Progress', color: 'blue', emoji: '⚡',
      tasks: [
        { id: '3', title: 'API Integration', description: 'Integrate payment gateway', priority: 'high', assignee: { name: 'Mike', avatar: 'https://i.pravatar.cc/150?img=3' }, dueDate: '2024-01-18', labels: ['Backend', 'API'] },
      ]
    },
    review: {
      id: 'review', title: 'In Review', color: 'yellow', emoji: '👀',
      tasks: [
        { id: '4', title: 'Code Review', description: 'Review pull request #234', priority: 'medium', assignee: { name: 'Emma', avatar: 'https://i.pravatar.cc/150?img=4' }, dueDate: '2024-01-19', labels: ['Review'] },
      ]
    },
    completed: {
      id: 'completed', title: 'Completed', color: 'green', emoji: '✅',
      tasks: [
        { id: '5', title: 'Setup CI/CD', description: 'Configure GitHub Actions', priority: 'low', assignee: { name: 'Alex', avatar: 'https://i.pravatar.cc/150?img=5' }, dueDate: '2024-01-15', labels: ['DevOps'] },
      ]
    }
  });

  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);

  const handleDragStart = (e, task, columnId) => {
    setDragging({ task, columnId });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e, targetColumnId) => {
    e.preventDefault();
    if (!dragging || dragging.columnId === targetColumnId) {
      setDragging(null);
      setDragOver(null);
      return;
    }
    const sourceCol = { ...columns[dragging.columnId] };
    const targetCol = { ...columns[targetColumnId] };
    sourceCol.tasks = sourceCol.tasks.filter(t => t.id !== dragging.task.id);
    targetCol.tasks = [...targetCol.tasks, dragging.task];
    setColumns({ ...columns, [dragging.columnId]: sourceCol, [targetColumnId]: targetCol });
    toast.success('Task moved to ' + targetCol.title + '!', { icon: '✅', duration: 2000 });
    setDragging(null);
    setDragOver(null);
  };

  const getPriorityColor = (p) => ({
    high: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400',
    medium: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400',
    low: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400'
  }[p] || 'text-gray-600 bg-gray-100');

  const getColStyle = (c) => ({
    gray: 'border-gray-300 dark:border-gray-600',
    blue: 'border-blue-300 dark:border-blue-700',
    yellow: 'border-yellow-300 dark:border-yellow-700',
    green: 'border-green-300 dark:border-green-700'
  }[c] || 'border-gray-300');

  const getColBg = (c) => ({
    gray: 'bg-gray-50 dark:bg-gray-800/50',
    blue: 'bg-blue-50 dark:bg-blue-900/20',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20',
    green: 'bg-green-50 dark:bg-green-900/20'
  }[c] || 'bg-gray-50');

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <EnhancedSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <EnhancedHeader />
        <main className="flex-1 overflow-hidden">
          <div className="h-full p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Task Board</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Drag and drop tasks to update status</p>
              </div>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl font-semibold">
                <FiPlus size={20} /><span>New Task</span>
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-[calc(100%-80px)] overflow-auto">
              {Object.values(columns).map((col) => (
                <div key={col.id} className="flex flex-col min-w-[280px]"
                  onDragOver={(e) => { e.preventDefault(); setDragOver(col.id); }}
                  onDrop={(e) => handleDrop(e, col.id)}
                  onDragLeave={() => setDragOver(null)}>
                  <div className={"border-2 rounded-t-xl p-4 border-b-0 " + getColBg(col.color) + " " + getColStyle(col.color)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{col.emoji}</span>
                        <h3 className="font-bold text-gray-800 dark:text-white">{col.title}</h3>
                        <span className="bg-white/70 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs font-bold shadow-sm">{col.tasks.length}</span>
                      </div>
                      <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <FiMoreVertical size={16} />
                      </button>
                    </div>
                  </div>

                  <div className={"flex-1 border-2 border-t-0 rounded-b-xl p-3 space-y-3 overflow-y-auto transition-all " + getColBg(col.color) + " " + getColStyle(col.color) + (dragOver === col.id ? " ring-2 ring-blue-400 ring-inset" : "")}>
                    <AnimatePresence>
                      {col.tasks.map((task) => (
                        <motion.div key={task.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                          draggable onDragStart={(e) => handleDragStart(e, task, col.id)}
                          whileHover={{ scale: 1.02, y: -2 }}
                          className={"bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-xl transition-all cursor-grab active:cursor-grabbing border border-gray-200 dark:border-gray-700 " + (dragging?.task.id === task.id ? "opacity-50 rotate-2" : "")}>
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-gray-800 dark:text-white text-sm flex-1">{task.title}</h4>
                            <button className="text-gray-400 hover:text-gray-600 ml-2"><FiMoreVertical size={14} /></button>
                          </div>
                          {task.description && <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{task.description}</p>}
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {task.labels.map((label, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md text-xs font-medium">{label}</span>
                            ))}
                          </div>
                          <span className={"inline-flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-semibold mb-3 " + getPriorityColor(task.priority)}>
                            <FiFlag size={10} /><span className="capitalize ml-1">{task.priority}</span>
                          </span>
                          <div className="flex items-center justify-between pt-3 border-t dark:border-gray-700">
                            <div className="flex items-center space-x-2">
                              <img src={task.assignee.avatar} alt={task.assignee.name} className="w-6 h-6 rounded-full" />
                              <span className="text-xs text-gray-600 dark:text-gray-400">{task.assignee.name}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-gray-400 text-xs">
                              <FiClock size={11} /><span>{task.dueDate}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <button className="w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-500 transition flex items-center justify-center space-x-2 text-sm">
                      <FiPlus size={16} /><span>Add Task</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default KanbanBoard;
