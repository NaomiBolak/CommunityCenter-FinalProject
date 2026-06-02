export interface Subscriber {
  id: number;
  identityCard: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  birthDate: string;
  joinDate: string;
  isActive: boolean;
  role?: string;
}

export interface Event {
  id: number;
  description: string;
  unitPrice: number;
  maxPlaces: number;
  locationId: number;
  date: string;
  imagePath: string;
  categoryId?: number;
  targetAudienceId?: number;
  employeeId?: number;
  currentRegistrations?: number;
}

export interface Class {
  id: number;
  name: string;
  description: string;
  price: number;
  day: string;
  time: string;
  domainId: number;
  targetAudienceId: number;
  locationId: number;
  employeeId: number;
}

export interface News {
  id: number;
  title: string;
  content: string;
  date: string;
  imageUrl?: string;
}

export interface Employee {
  id: number;
  name: string;
  role: string;
  phone: string;
}

export interface Location {
  id: number;
  name: string;
}

export interface Domain {
  id: number;
  name: string;
}

export interface TargetAudience {
  id: number;
  description: string;
}

export interface ClassRegistration {
  id: number;
  classId: number;
  userId: string;
}

export interface EventRegistration {
  registrationId: number;
  eventId: number;
  eventDescription: string;
  eventDate: string;
  placesCount: number;
  totalPrice: number;
  registrationDate: string;
  isPaid: boolean;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'pending' | 'in-progress' | 'resolved';
  createdAt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  identityCard: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  address?: string;
  birthDate: string;
}

export interface PaymentData {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}
