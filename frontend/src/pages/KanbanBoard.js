import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { 
  FiPlus, FiMoreVertical, FiClock, FiUser, 
  FiFlag, FiX, FiEdit2, FiTrash2, FiEye 
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const KanbanBoard = () => {
  const [columns, setColumns] = useState({
    todo: {
      id: 'todo',
      title: 'To Do',
      color: 'gray',
      tasks: [
        { 
          id: '1', 
          title: 'Design Homepage', 
          description: 'Create mockups for the new homepage',
          priority: 'high',
          assignee: { name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1' },
          dueDate: '2024-01-20',
          labels: ['Design', 'UI']
        },
        { 
          id: '2', 
          title: 'Write Documentation', 
          description: 'Update API documentation',
          priority: 'medium',
          assignee: { name: 'Sarah Smith', avatar: 'https://i.pravatar.cc/150?img=2' },
          dueDate: '2024-01-22',
          labels: ['Docs']
        },
      ]
    },
    inprogress: {
      id: 'inprogress',
      title: 'In Progress',
      color: 'blue',
      tasks: [
        { 
          id: '3', 
          title: 'API Integration', 
          description: 'Integrate payment gateway API',
          priority: 'high',
          assignee: { name: 'Mike Johnson', avatar: 'https://i.pravatar.cc/150?img=3' },
          dueDate: '2024-01-18',
          labels: ['Backend', 'API']
        },
      ]
    },
    review: {
      id: 'review',
      title: 'In Review',
      color: 'yellow',
      tasks: [
        { 
          id: '4', 
          title: 'Code Review', 
          description: 'Review pull request #234',
          priority: 'medium',
          assignee: { name: 'Emma Wilson', avatar: 'https://i.pravatar.cc/150?img=4' },
          dueDate: '2024-01-19',
          labels: ['Review']
        },
      ]
    },
    completed: {
      id: 'completed',
      title: 'Completed',
      color: 'green',
      tasks: [
        { 
          id: '5', 
          title: 'Setup CI/CD', 
          description: 'Configure GitHub Actions',
          priority: 'low',
          assignee: { name: 'Alex Brown', avatar: 'https://i.pravatar.cc/150?img=5' },
          dueDate: '2024-01-15',
          labels: ['DevOps']
        },
      ]
    }
  });

  const [showTaskModal, setShowTaskModal] = useState(false);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceTasks = [...sourceColumn.tasks];
    const destTasks = source.droppableId === destination.droppableId ? sourceTasks : [...destColumn.tasks];

    const [removed] = sourceTasks.splice(source.index, 1);
    destTasks.splice(destination.index, 0, removed);

    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        tasks: sourceTasks
      },
      [destination.droppableId]: {
        ...destColumn,
        tasks: destTasks
      }
    });

    toast.success('Task moved successfully!', {
      icon: '✅',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-700 border-red-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      low: 'bg-green-100 text-green-700 border-green-200'
    };
    return colors[priority] || colors.medium;
  };

  const getColumnColor = (color) => {
    const colors = {
      gray: 'bg-gray-100 border-gray-300',
      blue: 'bg-blue-100 border-blue-300',
      yellow: 'bg-yellow-100 border-yellow-300',
      green: 'bg-green-100 border-green-300'
    };
    return colors[color];
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-hidden">
          <div className="h-full p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Task Board</h1>
                <p className="text-gray-600 mt-1">Manage your tasks with drag and drop</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowTaskModal(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <FiPlus size={20} />
                <span className="font-semibold">New Task</span>
              </motion.button>
            </div>

            {/* Kanban Board */}
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-[calc(100%-80px)] overflow-x-auto pb-6">
                {Object.values(columns).map((column) => (
                  <div key={column.id} className="flex flex-col min-w-[300px]">
                    {/* Column Header */}
                    <div className={`${getColumnColor(column.color)} rounded-t-xl p-4 border-2 border-b-0`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-gray-800">{column.title}</h3>
                          <span className="bg-white/50 text-gray-700 px-2 py-1 rounded-full text-xs font-semibold">
                            {column.tasks.length}
                          </span>
                        </div>
                        <button className="text-gray-600 hover:text-gray-800">
                          <FiMoreVertical size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Droppable Area */}
                    <Droppable droppableId={column.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`flex-1 bg-white/50 rounded-b-xl border-2 border-t-0 ${getColumnColor(column.color)} p-4 space-y-3 overflow-y-auto ${
                            snapshot.isDraggingOver ? 'bg-blue-50' : ''
                          }`}
                        >
                          <AnimatePresence>
                            {column.tasks.map((task, index) => (
                              <Draggable key={task.id} draggableId={task.id} index={index}>
                                {(provided, snapshot) => (
                                  <motion.div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    whileHover={{ scale: 1.02 }}
                                    className={`bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-200 border border-gray-200 ${
                                      snapshot.isDragging ? 'shadow-2xl ring-2 ring-blue-400' : ''
                                    }`}
                                  >
                                    {/* Task Header */}
                                    <div className="flex items-start justify-between mb-3">
                                      <h4 className="font-semibold text-gray-800 flex-1">{task.title}</h4>
                                      <button className="text-gray-400 hover:text-gray-600">
                                        <FiMoreVertical size={16} />
                                      </button>
                                    </div>

                                    {/* Task Description */}
                                    {task.description && (
                                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                        {task.description}
                                      </p>
                                    )}

                                    {/* Labels */}
                                    <div className="flex flex-wrap gap-2 mb-3">
                                      {task.labels.map((label, idx) => (
                                        <span
                                          key={idx}
                                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium"
                                        >
                                          {label}
                                        </span>
                                      ))}
                                    </div>

                                    {/* Priority */}
                                    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-semibold border mb-3 ${getPriorityColor(task.priority)}`}>
                                      <FiFlag size={12} />
                                      <span className="capitalize">{task.priority}</span>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-3 border-t">
                                      <div className="flex items-center space-x-2">
                                        <img
                                          src={task.assignee.avatar}
                                          alt={task.assignee.name}
                                          className="w-6 h-6 rounded-full"
                                        />
                                        <span className="text-xs text-gray-600">{task.assignee.name}</span>
                                      </div>
                                      <div className="flex items-center space-x-1 text-gray-500">
                                        <FiClock size={12} />
                                        <span className="text-xs">{task.dueDate}</span>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </Draggable>
                            ))}
                          </AnimatePresence>
                          {provided.placeholder}

                          {/* Add Task Button */}
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full p-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors duration-200 flex items-center justify-center space-x-2"
                          >
                            <FiPlus size={16} />
                            <span className="text-sm font-medium">Add Task</span>
                          </motion.button>
                        </div>
                      )}
                    </Droppable>
                  </div>
                ))}
              </div>
            </DragDropContext>
          </div>
        </main>
      </div>
    </div>
  );
};

export default KanbanBoard;
