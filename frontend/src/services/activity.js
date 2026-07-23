import api from './api';

export const activityService = {
  getWorkspaceActivity: (workspaceId, params) => api.get(`/activity/workspace/${workspaceId}`, { params }),
  getUserActivity: (userId, params) => api.get(`/activity/user/${userId}`, { params })
};
