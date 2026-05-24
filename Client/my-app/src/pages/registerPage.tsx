import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import api from '../services/api';
import { registerSuccess } from '../store/slices/authSlice';
import { validateRegisterForm } from '../utils/validation';

const RegisterPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
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
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateRegisterForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/Auth/register', { ...form, username: form.email });
      dispatch(registerSuccess({ subscriber: data.user, token: data.token }));
      navigate('/');
    } catch (err) {
      const axiosError = err as AxiosError;
      setError((axiosError.response?.data as any)?.detail || 'שגיאה בהרשמה');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>הרשמה</h1>
      {error && <p style={{ color: '#c62828', backgroundColor: '#ffebee', padding: '8px', borderRadius: '4px' }}>{error}</p>}
      <form onSubmit={handleSubmit} autoComplete="off">
        <input name="identityCard" placeholder="תעודת זהות" onChange={handleChange} required autoComplete="off" />
        <input name="firstName" placeholder="שם פרטי" onChange={handleChange} required autoComplete="off" />
        <input name="lastName" placeholder="שם משפחה" onChange={handleChange} required autoComplete="off" />
        <input name="email" type="email" placeholder="אימייל" onChange={handleChange} required autoComplete="off" />
        <input name="password" type="password" placeholder="סיסמה" onChange={handleChange} required autoComplete="new-password" />
        <input name="phone" placeholder="טלפון" onChange={handleChange} required autoComplete="off" />
        <input name="address" placeholder="כתובת" onChange={handleChange} autoComplete="off" />
        <input name="birthDate" type="date" onChange={handleChange} required autoComplete="off" />
        <button type="submit" disabled={loading}>{loading ? 'נרשם...' : 'הרשמה'}</button>
      </form>
    </div>
  );
};

export default RegisterPage;
