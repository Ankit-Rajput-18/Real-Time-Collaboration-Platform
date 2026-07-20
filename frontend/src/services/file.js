import api from './api';

export const fileService = {
  uploadFile: (formData) => api.post('/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteFile: (publicId) => api.delete('/files', { data: { publicId } }),
  getFiles: () => api.get('/files')
};
