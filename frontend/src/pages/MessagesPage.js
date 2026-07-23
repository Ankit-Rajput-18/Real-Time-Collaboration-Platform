import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../hooks/useSocket';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MessageBox from '../components/MessageBox';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiSearch, FiUsers } from 'react-icons/fi';
import { messageService } from '../services/message';
import { workspaceService } from '../services/workspace';

const MessagesPage = () => {
  const { user } = useAuth();
  const { socket, connected } = useSocket();
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadWorkspaceUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      loadMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (socket && connected) {
      socket.on('new-message', (message) => {
        if (
          (message.sender._id === selectedUser?._id && message.receiver === user.id) ||
          (message.sender._id === user.id && message.receiver === selectedUser?._id)
        ) {
          setMessages(prev => [...prev, message]);
        }
      });

      return () => {
        socket.off('new-message');
      };
    }
  }, [socket, connected, selectedUser, user]);

  const loadWorkspaceUsers = async () => {
    try {
      setLoading(true);
      const response = await workspaceService.getWorkspaces();
      if (response.data && response.data.length > 0) {
        const allUsers = response.data.flatMap(w => 
          w.members.map(m => m.user).filter(u => u._id !== user.id)
        );
        const uniqueUsers = Array.from(new Set(allUsers.map(u => u._id)))
          .map(id => allUsers.find(u => u._id === id));
        setUsers(uniqueUsers);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (userId) => {
    try {
      setLoading(true);
      const response = await messageService.getDirectMessages(userId);
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to load messages:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (content) => {
    if (!selectedUser || !content.trim()) return;

    try {
      const messageData = {
        content,
        receiver: selectedUser._id,
        sender: user.id
      };

      await messageService.sendMessage(messageData);

      if (socket && connected) {
        socket.emit('send-message', {
          ...messageData,
          sender: { _id: user.id, name: user.name, email: user.email, avatar: user.avatar }
        });
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        {loading && !selectedUser ? (
          <LoadingSpinner fullScreen />
        ) : (
          <main className="flex-1 flex overflow-hidden">
            {/* Users List Sidebar */}
            <div className="w-80 bg-white border-r flex flex-col">
              <div className="p-4 border-b">
                <div className="flex items-center space-x-3 mb-4">
                  <FiUsers size={24} className="text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-800">Messages</h2>
                </div>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search users..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {filteredUsers.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <p>No users found</p>
                  </div>
                ) : (
                  filteredUsers.map(u => (
                    <div
                      key={u._id}
                      onClick={() => setSelectedUser(u)}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition ${
                        selectedUser?._id === u._id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img
                            src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.email}`}
                            alt={u.name}
                            className="w-12 h-12 rounded-full"
                          />
                          <span 
                            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                              u.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 truncate">{u.name}</p>
                          <p className="text-sm text-gray-500 truncate">{u.email}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-gray-50">
              {selectedUser ? (
                <>
                  {/* Chat Header */}
                  <div className="bg-white border-b p-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={selectedUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.email}`}
                        alt={selectedUser.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-800">{selectedUser.name}</h3>
                        <p className="text-sm text-gray-500">
                          {selectedUser.status === 'online' ? '🟢 Online' : '⚫ Offline'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 p-4">
                    <MessageBox
                      messages={messages}
                      onSendMessage={handleSendMessage}
                      currentUser={user}
                      isLoading={loading}
                    />
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <FiUsers size={64} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">Select a user to start chatting</p>
                  </div>
                </div>
              )}
            </div>
          </main>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
