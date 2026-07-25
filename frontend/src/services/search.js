import api from './api';

export const searchService = {
  globalSearch: (query, type) => api.get('/search?query=' + query + '&type=' + (type || 'all')),
};
