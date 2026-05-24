import api from './api';

const BASE = '/Contact';

export const contactService = {
  sendContactMessage: (data: { name: string; email: string; phone: string; subject: string; message: string }) =>
    api.post(BASE, data),
  getAllMessages: () => api.get(BASE),
  resolveMessage: (id: number) => api.patch(`${BASE}/${id}`),
};