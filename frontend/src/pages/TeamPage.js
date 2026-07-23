import React, { useEffect, useState } from 'react';
import { useWorkspace } from '../hooks/useWorkspace';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import { FiMail, FiUserPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';

const TeamPage = () => {
  const { currentWorkspace, selectWorkspace } = useWorkspace();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');

  useEffect(() => {
    if (currentWorkspace) {
      setMembers(currentWorkspace.members || []);
    }
  }, [currentWorkspace]);

  const handleInvite = () => {
    // TODO: Implement invite logic
    console.log('Inviting:', inviteEmail, inviteRole);
    setShowInviteModal(false);
    setInviteEmail('');
    setInviteRole('member');
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      manager: 'bg-blue-100 text-blue-800',
      member: 'bg-gray-100 text-gray-800'
    };
    return colors[role] || colors.member;
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
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Team Members</h1>
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <FiUserPlus size={18} />
                  <span>Invite Member</span>
                </button>
              </div>

              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Member
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {members.map((member) => (
                      <tr key={member.user?._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={member.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.user?.email}`}
                              alt={member.user?.name}
                              className="w-10 h-10 rounded-full"
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {member.user?.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {member.user?.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(member.role)}`}>
                            {member.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            member.user?.status === 'online' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            <span className={`w-2 h-2 rounded-full mr-1 ${
                              member.user?.status === 'online' ? 'bg-green-600' : 'bg-gray-600'
                            }`}></span>
                            {member.user?.status || 'offline'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(member.joinedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">
                            <FiEdit2 size={16} />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <FiTrash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {members.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    <p>No team members yet. Invite someone to get started!</p>
                  </div>
                )}
              </div>
            </div>
          </main>
        )}

        {/* Invite Modal */}
        <Modal
          isOpen={showInviteModal}
          title="Invite Team Member"
          onClose={() => setShowInviteModal(false)}
          onSubmit={handleInvite}
          submitText="Send Invite"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="colleague@example.com"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="member">Member</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default TeamPage;
