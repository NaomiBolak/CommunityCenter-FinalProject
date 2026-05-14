import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import api from '../services/api';
import { registerSuccess } from '../store/slices/authSlice';
import { RegisterData } from '../types';

const RegisterPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState<RegisterData>({
    identityCard: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    birthDate: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validate = (): string => {
    if (!/^\d{9}$/.test(form.identityCard)) return 'תעודת זהות חייבת להכיל 9 ספרות';
    if (!/^05\d{8}$/.test(form.phone)) return 'מספר טלפון לא תקין';
    if (!form.birthDate) return 'יש להזין תאריך לידה';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const { data } = await api.post('/Auth/register', form);

      dispatch(registerSuccess(data));

      navigate('/');
    } catch (err) {
      const axiosError = err as AxiosError;
      setError((axiosError.response?.data as any)?.detail || 'שגיאה בהרשמה');
    }
  };

  return (
    <div>
      <h1>הרשמה</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input name="identityCard" placeholder="תעודת זהות" onChange={handleChange} required />
        <input name="firstName" placeholder="שם פרטי" onChange={handleChange} required />
        <input name="lastName" placeholder="שם משפחה" onChange={handleChange} required />
        <input name="email" type="email" placeholder="אימייל" onChange={handleChange} required />
        <input name="password" type="password" placeholder="סיסמה" onChange={handleChange} required />
        <input name="phone" placeholder="טלפון" onChange={handleChange} required />
        <input name="address" placeholder="כתובת" onChange={handleChange} />
        <input name="birthDate" type="date" onChange={handleChange} required />

        <button type="submit">הרשמה</button>
      </form>
    </div>
  );
};

export default RegisterPage;