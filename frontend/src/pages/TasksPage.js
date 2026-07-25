import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EnhancedHeader from '../components/EnhancedHeader';
import EnhancedSidebar from '../components/EnhancedSidebar';
import Modal from '../components/Modal';
import { FiPlus, FiFlag, FiClock, FiEdit2, FiTrash2, FiFilter } from 'react-icons/fi';
import { taskService } from '../services/task';
import { useWorkspace } from '../hooks/useWorkspace';
import toast from 'react-hot-toast';

const TasksPage = () => {
  const { currentWorkspace } = useWorkspace();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', priority: 'medium', status: 'todo', dueDate: '' });
  const [filter, setFilter] = useState('all');

  useEffect(() => { if (currentWorkspace?._id) loadTasks(); }, [currentWorkspace]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getTasks(currentWorkspace._id);
      setTasks(response.data?.tasks || response.data || []);
    } catch (error) { console.error('Failed to load tasks:', error); }
    finally { setLoading(false); }
  };

  const handleCreateTask = async () => {
    if (!formData.title) { toast.error('Title is required'); return; }
    try {
      await taskService.createTask(currentWorkspace._id, formData);
      setShowModal(false);
      setFormData({ title: '', description: '', priority: 'medium', status: 'todo', dueDate: '' });
      loadTasks();
      toast.success('Task created!', { icon: '✅' });
    } catch (error) { toast.error('Failed to create task'); }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Delete this task?')) {
      try {
        await taskService.deleteTask(taskId);
        loadTasks();
        toast.success('Task deleted', { icon: '🗑️' });
      } catch (error) { toast.error('Failed to delete'); }
    }
  };

  const getPriorityColor = (p) => ({ high: 'text-red-600 bg-red-100', medium: 'text-yellow-600 bg-yellow-100', low: 'text-green-600 bg-green-100' }[p] || 'text-gray-600 bg-gray-100');
  const getStatusColor = (s) => ({ todo: 'bg-gray-200 text-gray-800', inprogress: 'bg-blue-200 text-blue-800', completed: 'bg-green-200 text-green-800' }[s] || 'bg-gray-200 text-gray-800');

  const filteredTasks = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <EnhancedSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <EnhancedHeader />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-8">
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Tasks</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage and track your tasks</p>
              </motion.div>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowModal(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl font-semibold">
                <FiPlus size={20} /><span>New Task</span>
              </motion.button>
            </div>

            <div className="flex space-x-3 mb-6 overflow-x-auto pb-2">
              {['all', 'todo', 'inprogress', 'completed'].map(status => (
                <motion.button key={status} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setFilter(status)}
                  className={"px-5 py-2.5 rounded-xl transition font-medium text-sm whitespace-nowrap " + (filter === status ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border dark:border-gray-700')}>
                  {status === 'all' ? 'All Tasks' : status === 'todo' ? 'To Do' : status === 'inprogress' ? 'In Progress' : 'Completed'}
                </motion.button>
              ))}
            </div>

            {loading ? (
              <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredTasks.map((task, i) => (
                    <motion.div key={task._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: i * 0.05 }} whileHover={{ y: -5 }}
                      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 border border-gray-100 dark:border-gray-700">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold text-gray-800 dark:text-white flex-1 text-lg">{task.title}</h3>
                        <div className="flex space-x-1 ml-2">
                          <button className="p-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg text-blue-600 transition"><FiEdit2 size={14} /></button>
                          <button onClick={() => handleDeleteTask(task._id)} className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-red-600 transition"><FiTrash2 size={14} /></button>
                        </div>
                      </div>
                      {task.description && <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{task.description}</p>}
                      <div className="flex items-center space-x-2 mb-3">
                        <span className={"px-2.5 py-1 rounded-lg text-xs font-semibold " + getPriorityColor(task.priority)}><FiFlag className="inline mr-1" size={10} />{task.priority}</span>
                        <span className={"px-2.5 py-1 rounded-lg text-xs font-semibold " + getStatusColor(task.status)}>{task.status}</span>
                      </div>
                      {task.dueDate && (
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400"><FiClock className="mr-2" size={14} />Due: {new Date(task.dueDate).toLocaleDateString()}</div>
                      )}
                      {task.assignedTo && (
                        <div className="mt-3 pt-3 border-t dark:border-gray-700 flex items-center space-x-2">
                          <img src={task.assignedTo.avatar || ("https://api.dicebear.com/7.x/avataaars/svg?seed=" + task.assignedTo.email)} alt="" className="w-6 h-6 rounded-full" />
                          <p className="text-xs text-gray-600 dark:text-gray-400">Assigned to: <span className="font-semibold">{task.assignedTo.name}</span></p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {!loading && filteredTasks.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                <FiFilter size={64} className="mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 dark:text-gray-400 text-lg">No tasks found. Create one to get started!</p>
              </motion.div>
            )}
          </div>
        </main>

        <Modal isOpen={showModal} title="Create New Task" onClose={() => setShowModal(false)} onSubmit={handleCreateTask} submitText="Create Task">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Title</label>
              <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Task title"
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Task description" rows="3"
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:border-blue-500 resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Priority</label>
                <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:border-blue-500">
                  <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Due Date</label>
                <input type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:border-blue-500" />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default TasksPage;
