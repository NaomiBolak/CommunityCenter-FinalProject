import api from './api';

const BASE = '/News';

export const newsService = {
  getAllNews: () => api.get(BASE),
  createNews: (data: any) => api.post(BASE, data),
  deleteNews: (id: number) => api.delete(`${BASE}/${id}`),
};