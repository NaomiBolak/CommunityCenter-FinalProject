import { RegisterData } from '../types';

export const validateRegisterForm = (form: RegisterData): string => {
  if (!/^\d{9}$/.test(form.identityCard)) return 'תעודת זהות חייבת להכיל 9 ספרות';
  if (!/^05\d{8}$/.test(form.phone)) return 'מספר טלפון לא תקין';
  if (!form.birthDate) return 'יש להזין תאריך לידה';
  return '';
};
