import api from './api';

export const notificationService = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (notificationIds) => api.put('/notifications/mark-read', { notificationIds }),
  deleteNotification: (id) => api.delete(`/notifications/${id}`)
};
