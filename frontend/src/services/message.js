import api from './api';

export const messageService = {
  sendMessage: (data) => api.post('/messages', data),
  getDirectMessages: (userId) => api.get(`/messages/direct/${userId}`),
  getChannelMessages: (channelId) => api.get(`/messages/channel/${channelId}`),
  markAsRead: (messageIds) => api.put('/messages/mark-read', { messageIds }),
  deleteMessage: (id) => api.delete(`/messages/${id}`)
};
