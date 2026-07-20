import api from './api';

export const workspaceService = {
  createWorkspace: (data) => api.post('/workspaces', data),
  getWorkspaces: () => api.get('/workspaces'),
  getWorkspaceById: (id) => api.get(`/workspaces/${id}`),
  updateWorkspace: (id, data) => api.put(`/workspaces/${id}`, data),
  deleteWorkspace: (id) => api.delete(`/workspaces/${id}`),
  addMember: (id, data) => api.post(`/workspaces/${id}/members`, data),
  removeMember: (id, data) => api.delete(`/workspaces/${id}/members`, { data }),
  updateMemberRole: (id, data) => api.put(`/workspaces/${id}/members`, data)
};
