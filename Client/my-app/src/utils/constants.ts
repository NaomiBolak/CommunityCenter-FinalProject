export const ROUTES = {
  HOME: '/',
  EVENTS: '/activities',
  CLASSES: '/classes',
  CONTACT: '/contact',
  NEWS: '/news',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  ADMIN: '/admin',
  ADMIN_EVENTS: '/admin/events',
  ADMIN_CLASSES: '/admin/classes',
  ADMIN_CONTACTS: '/admin/contacts',
  ADMIN_NEWS: '/admin/news',
};

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost:7134/api';
