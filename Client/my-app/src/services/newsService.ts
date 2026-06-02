import api from './api';

const BASE = '/News';

export const newsService = {
  getAllNews: () => api.get(BASE),
  getLatestNews: (count = 3) => api.get(`${BASE}/latest`, { params: { count } }),
  createNews: (data: { title: string; content: string; imagePath?: string }) =>
    api.post(BASE, { ...data, imagePath: data.imagePath || '' }),
  deleteNews: (id: number) => api.delete(`${BASE}/${id}`),
};