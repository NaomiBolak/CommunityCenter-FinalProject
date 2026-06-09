import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AxiosError } from 'axios';
import api from '../services/api';
import { registerSuccess } from '../store/slices/authSlice';
import { validateRegisterForm } from '../utils/validation';
import { ROUTES } from '../utils/constants';
import { COMMUNITY_LOGO, SITE_NAME } from '../utils/branding';

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
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <img src={COMMUNITY_LOGO} alt="" className="auth-logo" aria-hidden />
        <h2>הרשמה לקהילה</h2>
        <p className="auth-subtitle">הצטרפו ל{SITE_NAME}</p>
        {error && <p className="alert-error">{error}</p>}
        <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
          <input name="identityCard" value={form.identityCard} placeholder="תעודת זהות" onChange={handleChange} required autoComplete="off" />
          <div className="auth-row">
            <input name="firstName" value={form.firstName} placeholder="שם פרטי" onChange={handleChange} required autoComplete="off" />
            <input name="lastName" value={form.lastName} placeholder="שם משפחה" onChange={handleChange} required autoComplete="off" />
          </div>
          <input name="email" type="email" value={form.email} placeholder="אימייל" onChange={handleChange} required autoComplete="off" />
          <input name="password" type="password" value={form.password} placeholder="סיסמה" onChange={handleChange} required autoComplete="new-password" />
          <input name="phone" value={form.phone} placeholder="טלפון" onChange={handleChange} required autoComplete="off" />
          <input name="address" value={form.address} placeholder="כתובת" onChange={handleChange} autoComplete="off" />
          <label className="input-label" htmlFor="birthDate">תאריך לידה</label>
          <input id="birthDate" name="birthDate" type="date" value={form.birthDate} onChange={handleChange} required autoComplete="off" />
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'נרשם...' : 'הרשמה'}</button>
        </form>
        <p className="auth-footer-link">
          כבר רשומים? <Link to={ROUTES.LOGIN}>התחברות</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
