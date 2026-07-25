import api from './api';

export const analyticsService = {
  getWorkspaceAnalytics: (workspaceId, params) => api.get('/analytics/workspace/' + workspaceId, { params }),
  getUserAnalytics: () => api.get('/analytics/user')
};
