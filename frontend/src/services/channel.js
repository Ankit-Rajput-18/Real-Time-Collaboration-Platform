import api from './api';

export const channelService = {
  createChannel: (workspaceId, data) => api.post(`/channels/${workspaceId}/channels`, data),
  getChannels: (workspaceId) => api.get(`/channels/${workspaceId}/channels`),
  getChannelById: (id) => api.get(`/channels/channel/${id}`),
  updateChannel: (id, data) => api.put(`/channels/channel/${id}`, data),
  deleteChannel: (id) => api.delete(`/channels/channel/${id}`),
  addMember: (id, data) => api.post(`/channels/channel/${id}/members`, data),
  removeMember: (id, data) => api.delete(`/channels/channel/${id}/members`, { data })
};
