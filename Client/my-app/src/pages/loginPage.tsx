import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/slices/authSlice';
import { AxiosError } from 'axios';
import { ROUTES } from '../utils/constants';
import { COMMUNITY_LOGO, SITE_NAME } from '../utils/branding';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/Auth/login', { email, password });
      dispatch(loginSuccess({
        subscriber: data.user,
        isAdmin: data.user.role?.toLowerCase() === 'admin',
        token: data.token
      }));
      navigate('/');
    } catch (err) {
      const axiosError = err as AxiosError;
      setError((axiosError.response?.data as any)?.detail || 'שגיאה בהתחברות');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <img src={COMMUNITY_LOGO} alt="" className="auth-logo" aria-hidden />
        <h2>התחברות</h2>
        <p className="auth-subtitle">כניסה לאזור האישי — {SITE_NAME}</p>
        {error && <p className="alert-error">{error}</p>}
        <form className="auth-form" onSubmit={handleLogin}>
          <input type="email" placeholder="אימייל" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
          <input type="password" placeholder="סיסמה" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'מתחבר...' : 'כניסה'}</button>
        </form>
        <p className="auth-footer-link">
          אין לך חשבון? <Link to={ROUTES.REGISTER}>הירשמי כאן</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
