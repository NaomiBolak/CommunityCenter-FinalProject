import api from './api';
import { EventRegistration, RegisteredCourse } from '../types';

export interface UserProfile {
  id: number;
  identityCard: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  birthDate: string;
  joinDate: string;
  role: string;
  events: EventRegistration[];
  courses: RegisteredCourse[];
}

const profileService = {
  getMyProfile: () => api.get<UserProfile>('/Profile'),
};

export default profileService;
