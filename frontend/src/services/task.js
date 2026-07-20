import api from './api';

export const taskService = {
  createTask: (workspaceId, data) => api.post(`/tasks/${workspaceId}/tasks`, data),
  getTasks: (workspaceId) => api.get(`/tasks/${workspaceId}/tasks`),
  getTaskById: (id) => api.get(`/tasks/task/${id}`),
  updateTask: (id, data) => api.put(`/tasks/task/${id}`, data),
  deleteTask: (id) => api.delete(`/tasks/task/${id}`),
  getTaskStats: (workspaceId) => api.get(`/tasks/${workspaceId}/tasks/stats`)
};
