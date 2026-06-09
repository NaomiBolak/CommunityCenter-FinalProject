import api from './api';
const BASE = '/Courses';

const courseService = {
  getCourses: () => api.get(BASE),

  addCourse: (data: any) => api.post(BASE, data),

  updateCourse: (id: number, data: any) => api.put(`${BASE}/${id}`, data),

  deleteCourse: (id: number) => api.delete(`${BASE}/${id}`),

  registerToCourse: (userId: number, courseId: number) =>
    api.post(`${BASE}/register`, null, { params: { userId, courseId } }),

  getCourseRegistrants: (courseId: number) =>
    api.get(`${BASE}/${courseId}/registrants`),
};

export default courseService;
