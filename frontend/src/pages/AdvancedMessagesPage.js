import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../hooks/useSocket';
import EnhancedHeader from '../components/EnhancedHeader';
import EnhancedSidebar from '../components/EnhancedSidebar';
import { FiSearch, FiSend, FiSmile, FiPaperclip, FiMoreVertical, FiPhone, FiVideo, FiMic, FiUsers, FiMessageSquare, FiCheckCircle } from 'react-icons/fi';
import { messageService } from '../services/message';
import { workspaceService } from '../services/workspace';
import toast from 'react-hot-toast';

const AdvancedMessagesPage = () => {
  const { user } = useAuth();
  const { socket, connected } = useSocket();
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const emojis = ['😀','😂','😍','🥰','😎','🤔','👍','👏','🎉','❤️','🔥','✅','💯','🚀','⭐','😊','🙌','💪','🎯','✨'];

  useEffect(() => { loadWorkspaceUsers(); }, []);
  useEffect(() => { if (selectedUser) loadMessages(selectedUser._id); }, [selectedUser]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  useEffect(() => {
    if (socket && connected && selectedUser) {
      socket.on('new-message', (msg) => {
        if (msg.sender._id === selectedUser?._id || msg.sender._id === user.id) {
          setMessages(prev => [...prev, msg]);
        }
      });
      socket.on('user-typing', ({ userId, userName }) => {
        if (userId === selectedUser?._id) setTypingUsers(prev => [...new Set([...prev, userName])]);
      });
      socket.on('user-stop-typing', ({ userId }) => {
        if (userId === selectedUser?._id) setTypingUsers([]);
      });
      return () => { socket.off('new-message'); socket.off('user-typing'); socket.off('user-stop-typing'); };
    }
  }, [socket, connected, selectedUser, user]);

  const loadWorkspaceUsers = async () => {
    try {
      const response = await workspaceService.getWorkspaces();
      if (response.data?.length > 0) {
        const allUsers = response.data.flatMap(w => w.members.map(m => m.user)).filter(u => u && u._id !== user.id);
        const unique = Array.from(new Map(allUsers.map(u => [u._id, u])).values());
        setUsers(unique);
      }
    } catch (error) { console.error('Failed to load users:', error); }
  };

  const loadMessages = async (userId) => {
    try {
      const response = await messageService.getDirectMessages(userId);
      setMessages(response.data || []);
    } catch (error) { setMessages([]); }
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!selectedUser || !messageText.trim()) return;
    try {
      const data = { content: messageText, receiver: selectedUser._id, sender: user.id };
      const tempMsg = { _id: Date.now().toString(), content: messageText, sender: { _id: user.id, name: user.name, avatar: user.avatar }, receiver: selectedUser._id, createdAt: new Date().toISOString() };
      setMessages(prev => [...prev, tempMsg]);
      setMessageText('');
      setShowEmojiPicker(false);
      await messageService.sendMessage(data);
      if (socket && connected) socket.emit('send-message', data);
    } catch (error) { toast.error('Failed to send message'); }
  };

  const handleTyping = (e) => {
    setMessageText(e.target.value);
    if (socket && connected && selectedUser) {
      socket.emit('typing', { userId: user.id, userName: user.name, channel: selectedUser._id });
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => socket.emit('stop-typing', { userId: user.id }), 1000);
    }
  };

  const getTime = (date) => new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const filtered = users.filter(u => u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <EnhancedSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <EnhancedHeader />
        <main className="flex-1 flex overflow-hidden">
          <motion.div initial={{ x: -300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="w-80 bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col shadow-lg">
            <div className="p-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <div className="flex items-center space-x-3 mb-4"><FiUsers size={24} /><h2 className="text-xl font-bold">Messages</h2></div>
              <div className="relative">
                <FiSearch className="absolute left-3 top-3 text-blue-200" size={16} />
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search users..." className="w-full pl-10 pr-4 py-2.5 bg-white/20 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none text-sm" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="p-8 text-center text-gray-500"><FiUsers size={48} className="mx-auto mb-4 text-gray-300" /><p>No users found</p></div>
              ) : (
                filtered.map((u, i) => (
                  <motion.div key={u._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} onClick={() => setSelectedUser(u)}
                    className={"p-4 border-b dark:border-gray-700 cursor-pointer transition-all " + (selectedUser?._id === u._id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-600' : 'hover:bg-gray-50 dark:hover:bg-gray-700')}>
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img src={u.avatar || ("https://api.dicebear.com/7.x/avataaars/svg?seed=" + u.email)} alt={u.name} className="w-12 h-12 rounded-full" />
                        <span className={"absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white " + (u.status === 'online' ? 'bg-green-500' : 'bg-gray-400')} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 dark:text-white truncate">{u.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{u.email}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          <div className="flex-1 flex flex-col">
            {selectedUser ? (
              <>
                <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-4 flex items-center justify-between shadow-sm">
                  <div className="flex items-center space-x-3">
                    <img src={selectedUser.avatar || ("https://api.dicebear.com/7.x/avataaars/svg?seed=" + selectedUser.email)} alt={selectedUser.name} className="w-11 h-11 rounded-full ring-2 ring-blue-200" />
                    <div>
                      <h3 className="font-bold text-gray-800 dark:text-white">{selectedUser.name}</h3>
                      <p className="text-sm text-gray-500 flex items-center">
                        {selectedUser.status === 'online' ? <><span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />Active now</> : 'Offline'}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2.5 hover:bg-blue-50 rounded-xl text-blue-600"><FiPhone size={20} /></button>
                    <button className="p-2.5 hover:bg-purple-50 rounded-xl text-purple-600"><FiVideo size={20} /></button>
                    <button className="p-2.5 hover:bg-gray-100 rounded-xl text-gray-600 dark:text-gray-300"><FiMoreVertical size={20} /></button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
                  <AnimatePresence>
                    {messages.map((msg) => {
                      const isOwn = msg.sender._id === user.id || msg.sender === user.id;
                      return (
                        <motion.div key={msg._id} initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} className={"flex " + (isOwn ? 'justify-end' : 'justify-start') + " mb-3"}>
                          <div className="max-w-md">
                            <div className={"px-4 py-3 rounded-2xl shadow-md " + (isOwn ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-none' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-bl-none')}>
                              <p className="text-sm leading-relaxed">{msg.content}</p>
                              <div className={"flex items-center space-x-1 mt-1.5 text-xs " + (isOwn ? 'text-blue-100 justify-end' : 'text-gray-400')}>
                                <span>{getTime(msg.createdAt)}</span>
                                {isOwn && <FiCheckCircle size={12} />}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  {typingUsers.length > 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center space-x-2">
                      <div className="bg-white dark:bg-gray-700 px-4 py-3 rounded-2xl shadow-sm flex space-x-1">
                        {[0,150,300].map((d,i) => <span key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: d + 'ms' }} />)}
                      </div>
                      <span className="text-sm text-gray-500">{selectedUser.name} is typing...</span>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 p-4">
                  <AnimatePresence>
                    {showEmojiPicker && (
                      <motion.div initial={{ opacity: 0, scale: 0.8, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8 }}
                        className="mb-3 p-3 bg-white dark:bg-gray-700 rounded-2xl shadow-2xl border dark:border-gray-600 flex flex-wrap gap-2">
                        {emojis.map(e => <button key={e} onClick={() => setMessageText(prev => prev + e)} className="text-2xl hover:scale-125 transition w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">{e}</button>)}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <form onSubmit={handleSend} className="flex items-end space-x-3">
                    <button type="button" className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-gray-600 dark:text-gray-300 transition"><FiPaperclip size={20} /></button>
                    <div className="flex-1 relative">
                      <textarea value={messageText} onChange={handleTyping}
                        onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                        placeholder="Type a message... (Enter to send)" rows="1"
                        className="w-full border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-2xl px-4 py-3 pr-12 resize-none focus:outline-none focus:border-blue-500 transition"
                        style={{ minHeight: '50px', maxHeight: '120px' }} />
                      <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="absolute right-3 bottom-3 text-yellow-500 hover:scale-110 transition"><FiSmile size={22} /></button>
                    </div>
                    <motion.button type="submit" disabled={!messageText.trim()} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      className="p-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition">
                      <FiSend size={20} />
                    </motion.button>
                    <button type="button" className="p-3.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl text-red-500 transition"><FiMic size={20} /></button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                  <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                    <FiMessageSquare size={64} className="text-blue-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Select a Conversation</h3>
                  <p className="text-gray-500 dark:text-gray-400">Choose a user from the list to start chatting</p>
                </motion.div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdvancedMessagesPage;
