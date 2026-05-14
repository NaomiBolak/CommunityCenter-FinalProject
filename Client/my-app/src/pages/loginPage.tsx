import React, { useState } from 'react';
import api from '../services/api';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/slices/authSlice';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await api.post('/Auth/login', { email, password });

      // 🔐 שמירת טוקן
      localStorage.setItem('token', data.token);

      // 🧠 שמירת משתמש
      dispatch(loginSuccess({
        subscriber: data.user,
        isAdmin: data.user.role === "Admin"
      }));

      navigate('/');
    } catch (err) {
      const axiosError = err as AxiosError;
      setError((axiosError.response?.data as any)?.detail || 'שגיאה בהתחברות');
    }
  };

  return (
    <div>
      <h2>התחברות</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="אימייל"
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="סיסמה"
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button type="submit">כניסה</button>
      </form>
    </div>
  );
};

export default LoginPage;