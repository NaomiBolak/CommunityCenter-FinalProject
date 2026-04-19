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
      // שליחת הבקשה לנתיב שיצרת ב-C#
      const { data } = await api.post('/Auth/login', { email, password });
      
      // שמירת פרטי המשתמש ב-Redux
      dispatch(loginSuccess(data.user));
      
      alert('ברוך הבא, ' + data.user.firstName);
      navigate('/'); // המלצה: מעבר לדף הבית לאחר הצלחה
    } catch (err: any) {
      const axiosError = err as AxiosError;
      // התיקון כאן: גישה ל-detail במקום ה-data הגולמי
      setError((axiosError.response?.data as any)?.detail || 'שגיאה בהתחברות');
    }
  };

  return (
    <div>
      <h2>התחברות</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="אימייל" onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="סיסמה" onChange={e => setPassword(e.target.value)} required />
        <button type="submit">כניסה</button>
      </form>
    </div>
  );
};

export default LoginPage;