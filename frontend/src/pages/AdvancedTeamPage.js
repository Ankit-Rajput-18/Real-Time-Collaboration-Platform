import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EnhancedHeader from '../components/EnhancedHeader';
import EnhancedSidebar from '../components/EnhancedSidebar';
import Modal from '../components/Modal';
import { FiUserPlus, FiTrash2, FiEdit2, FiUsers, FiAward, FiTrendingUp, FiClock, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdvancedTeamPage = () => {
  const [members, setMembers] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    setMembers([
      { _id: '1', user: { _id: '1', name: 'John Doe', email: 'john@example.com', avatar: 'https://i.pravatar.cc/150?img=1', status: 'online', bio: 'Full Stack Developer' }, role: 'admin', joinedAt: '2024-01-01', tasksCompleted: 45, productivity: 92, lastActive: '2 min ago' },
      { _id: '2', user: { _id: '2', name: 'Sarah Smith', email: 'sarah@example.com', avatar: 'https://i.pravatar.cc/150?img=2', status: 'online', bio: 'UI/UX Designer' }, role: 'manager', joinedAt: '2024-01-05', tasksCompleted: 38, productivity: 88, lastActive: '5 min ago' },
      { _id: '3', user: { _id: '3', name: 'Mike Johnson', email: 'mike@example.com', avatar: 'https://i.pravatar.cc/150?img=3', status: 'away', bio: 'Backend Engineer' }, role: 'member', joinedAt: '2024-01-10', tasksCompleted: 31, productivity: 85, lastActive: '1 hour ago' },
      { _id: '4', user: { _id: '4', name: 'Emma Wilson', email: 'emma@example.com', avatar: 'https://i.pravatar.cc/150?img=4', status: 'offline', bio: 'Frontend Developer' }, role: 'member', joinedAt: '2024-01-12', tasksCompleted: 27, productivity: 82, lastActive: '2 days ago' },
    ]);
  }, []);

  const handleInvite = () => {
    if (!inviteEmail) { toast.error('Please enter an email'); return; }
    toast.success('Invitation sent to ' + inviteEmail + '!', { icon: '✉️' });
    setShowInviteModal(false);
    setInviteEmail('');
    setInviteRole('member');
  };

  const handleRemove = (id, name) => {
    if (window.confirm('Remove ' + name + ' from team?')) {
      setMembers(members.filter(m => m._id !== id));
      toast.success('Member removed', { icon: '🗑️' });
    }
  };

  const getRoleColor = (role) => ({ admin: 'from-red-500 to-pink-500', manager: 'from-blue-500 to-purple-500', member: 'from-gray-500 to-gray-600' }[role] || 'from-gray-500 to-gray-600');
  const getStatusColor = (s) => ({ online: 'bg-green-500', away: 'bg-yellow-500', offline: 'bg-gray-400' }[s] || 'bg-gray-400');

  const filtered = members.filter(m => {
    var s = m.user.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    var r = filterRole === 'all' || m.role === filterRole;
    var st = filterStatus === 'all' || m.user.status === filterStatus;
    return s && r && st;
  });

  var stats = {
    total: members.length,
    online: members.filter(m => m.user.status === 'online').length,
    admins: members.filter(m => m.role === 'admin').length,
    avgProd: members.length ? Math.round(members.reduce((a, m) => a + m.productivity, 0) / members.length) : 0
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <EnhancedSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <EnhancedHeader />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Team Members</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage your team and track productivity</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {[
                { icon: <FiUsers size={24} />, label: 'Total', value: stats.total, color: 'from-blue-500 to-blue-600' },
                { icon: <FiAward size={24} />, label: 'Online', value: stats.online, color: 'from-green-500 to-green-600' },
                { icon: <FiAward size={24} />, label: 'Admins', value: stats.admins, color: 'from-purple-500 to-purple-600' },
                { icon: <FiTrendingUp size={24} />, label: 'Avg Prod.', value: stats.avgProd + '%', color: 'from-pink-500 to-pink-600' },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -5 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <div className={"w-12 h-12 bg-gradient-to-r " + s.color + " rounded-xl flex items-center justify-center text-white mb-4 shadow-md"}>{s.icon}</div>
                  <p className="text-3xl font-bold text-gray-800 dark:text-white mb-1">{s.value}</p>
                  <p className="text-gray-600 dark:text-gray-400">{s.label}</p>
                </motion.div>
              ))}
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-80">
                  <FiSearch className="absolute left-4 top-3.5 text-gray-400" size={18} />
                  <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search members..."
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:border-blue-500" />
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:border-blue-500">
                    <option value="all">All Roles</option><option value="admin">Admin</option><option value="manager">Manager</option><option value="member">Member</option>
                  </select>
                  <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:border-blue-500">
                    <option value="all">All Status</option><option value="online">Online</option><option value="away">Away</option><option value="offline">Offline</option>
                  </select>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowInviteModal(true)}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl font-semibold">
                    <FiUserPlus size={18} /><span>Invite Member</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {filtered.map((member, index) => (
                  <motion.div key={member._id} initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }} whileHover={{ y: -5 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-20 relative">
                      <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
                        <div className="relative">
                          <img src={member.user.avatar} alt={member.user.name} className="w-20 h-20 rounded-full border-4 border-white shadow-xl" />
                          <span className={"absolute bottom-1 right-1 w-5 h-5 " + getStatusColor(member.user.status) + " rounded-full border-2 border-white shadow-md"} />
                        </div>
                      </div>
                    </div>
                    <div className="pt-14 p-5 text-center">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">{member.user.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{member.user.email}</p>
                      <p className="text-xs text-gray-400 italic mb-3">{member.user.bio}</p>
                      <div className="flex justify-center mb-4">
                        <span className={"px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r " + getRoleColor(member.role) + " shadow-md"}>{member.role.toUpperCase()}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <div className="text-center"><p className="text-xl font-bold text-blue-600">{member.tasksCompleted}</p><p className="text-xs text-gray-500 dark:text-gray-400">Tasks Done</p></div>
                        <div className="text-center"><p className="text-xl font-bold text-green-600">{member.productivity}%</p><p className="text-xs text-gray-500 dark:text-gray-400">Productivity</p></div>
                      </div>
                      <div className="flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 mb-4"><FiClock className="mr-1" size={12} />Active: {member.lastActive}</div>
                      <div className="flex items-center space-x-2">
                        <button className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium text-sm hover:shadow-lg transition">View Profile</button>
                        <button className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl text-gray-600 dark:text-gray-300 transition"><FiEdit2 size={14} /></button>
                        <button onClick={() => handleRemove(member._id, member.user.name)} className="p-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 rounded-xl text-red-600 transition"><FiTrash2 size={14} /></button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16"><FiUsers size={64} className="mx-auto mb-4 text-gray-300" /><p className="text-gray-500 dark:text-gray-400 text-lg">No members found</p></div>
            )}
          </div>
        </main>

        <AnimatePresence>
          {showInviteModal && (
            <Modal isOpen={showInviteModal} title="Invite Team Member" onClose={() => setShowInviteModal(false)} onSubmit={handleInvite} submitText="Send Invite">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                  <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="colleague@example.com"
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Role</label>
                  <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:border-blue-500">
                    <option value="member">Member - View and edit tasks</option>
                    <option value="manager">Manager - Manage team members</option>
                    <option value="admin">Admin - Full access</option>
                  </select>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-300">An invitation email will be sent with join instructions.</p>
                </div>
              </div>
            </Modal>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdvancedTeamPage;
