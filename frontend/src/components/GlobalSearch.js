import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiFile, FiUser, FiBriefcase } from 'react-icons/fi';
import { searchService } from '../services/search';
import { useNavigate } from 'react-router-dom';

const GlobalSearch = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ tasks: [], users: [], workspaces: [] });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setResults({ tasks: [], users: [], workspaces: [] });
    }
  }, [isOpen]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (query.length >= 2) handleSearch();
      else setResults({ tasks: [], users: [], workspaces: [] });
    }, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await searchService.globalSearch(query);
      setResults(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (type, id) => {
    onClose();
    if (type === 'task') navigate('/tasks?id=' + id);
    if (type === 'user') navigate('/team?user=' + id);
    if (type === 'workspace') navigate('/dashboard');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-24"
      >
        <motion.div
          initial={{ scale: 0.9, y: -20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: -20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border dark:border-gray-700"
        >
          <div className="p-5 border-b dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <FiSearch className="text-blue-500" size={24} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tasks, users, workspaces..."
                className="flex-1 bg-transparent text-lg focus:outline-none dark:text-white placeholder-gray-400"
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600">
                  <FiX size={20} />
                </button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto p-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-3"></div>
                <p className="text-gray-500">Searching...</p>
              </div>
            ) : (
              <>
                {results.tasks?.length > 0 && (
                  <div className="mb-6">
                    <h4 className="flex items-center space-x-2 text-sm font-bold text-gray-500 mb-3 uppercase">
                      <FiFile size={14} /><span>Tasks ({results.tasks.length})</span>
                    </h4>
                    {results.tasks.map((task) => (
                      <motion.div key={task._id} whileHover={{ x: 5 }}
                        onClick={() => handleClick('task', task._id)}
                        className="p-3 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 mb-1">
                        <p className="font-semibold dark:text-white">{task.title}</p>
                        {task.description && <p className="text-sm text-gray-500 truncate mt-1">{task.description}</p>}
                      </motion.div>
                    ))}
                  </div>
                )}
                {results.users?.length > 0 && (
                  <div className="mb-6">
                    <h4 className="flex items-center space-x-2 text-sm font-bold text-gray-500 mb-3 uppercase">
                      <FiUser size={14} /><span>Users ({results.users.length})</span>
                    </h4>
                    {results.users.map((u) => (
                      <motion.div key={u._id} whileHover={{ x: 5 }}
                        onClick={() => handleClick('user', u._id)}
                        className="flex items-center space-x-3 p-3 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 mb-1">
                        <img src={u.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + u.email} alt={u.name} className="w-10 h-10 rounded-full" />
                        <div>
                          <p className="font-semibold dark:text-white">{u.name}</p>
                          <p className="text-sm text-gray-500">{u.email}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
                {results.workspaces?.length > 0 && (
                  <div className="mb-6">
                    <h4 className="flex items-center space-x-2 text-sm font-bold text-gray-500 mb-3 uppercase">
                      <FiBriefcase size={14} /><span>Workspaces ({results.workspaces.length})</span>
                    </h4>
                    {results.workspaces.map((w) => (
                      <motion.div key={w._id} whileHover={{ x: 5 }}
                        onClick={() => handleClick('workspace', w._id)}
                        className="p-3 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 mb-1">
                        <p className="font-semibold dark:text-white">{w.name}</p>
                      </motion.div>
                    ))}
                  </div>
                )}
                {query.length >= 2 && !loading && (results.tasks?.length || 0) + (results.users?.length || 0) + (results.workspaces?.length || 0) === 0 && (
                  <div className="text-center py-12">
                    <FiSearch size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No results found for "{query}"</p>
                  </div>
                )}
                {query.length < 2 && (
                  <div className="text-center py-12">
                    <FiSearch size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">Type at least 2 characters to search</p>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GlobalSearch;
