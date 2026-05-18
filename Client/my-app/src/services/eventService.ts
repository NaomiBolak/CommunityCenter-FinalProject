import api from './api';

const BASE = '/Events';

const eventService = {

  getEvents: () => api.get(BASE),

  getEventById: (id: number) =>
    api.get(`${BASE}/${id}`),

  addEvent: (data: any) =>
    api.post(BASE, data),

  updateEvent: (id: number, data: any) =>
    api.put(`${BASE}/${id}`, data),

  removeEvent: (id: number) =>
    api.delete(`${BASE}/${id}`),

  getLocations: () =>
    api.get(`${BASE}/locations`),

  getCategories: () =>
    api.get(`${BASE}/categories`),

  gettargetadience: () =>
    api.get(`${BASE}/targetAudience`),

  getEmployees: () =>
    api.get(`${BASE}/employees`),

  addLocation: (data: any) =>
    api.post(`${BASE}/locations`, data),

  addcategory: (data: any) =>
    api.post(`${BASE}/category`, data),

  addemployee: (data: any) =>
    api.post(`${BASE}/employee`, data),

  addtargetAudience: (data: any) =>
    api.post(`${BASE}/targetAudience`, data),

  howmanyRegisterstoEvent: (id: number) =>
    api.get(`${BASE}/registers/count/${id}`)

};

export default eventService;