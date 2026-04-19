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
    if (!/^05\d{8}$/.test(form.phone)) return 'מספר טלפון לא תקין (לדוגמה: 0501234567)';
    if (!form.birthDate) return 'יש להזין תאריך לידה';
    const age = new Date().getFullYear() - new Date(form.birthDate).getFullYear();
    if (age < 5 || age > 120) return 'תאריך לידה לא תקין';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    setError('');
    try {
      const { data } = await api.post('/Auth/register', form);
      dispatch(registerSuccess(data));
      navigate('/');
    } catch(error) {
      const axiosError = error as AxiosError;
      // התיקון כאן: גישה ל-detail במקום message
      setError((axiosError.response?.data as any)?.detail || 'ההרשמה נכשלה, אנא נסה שנית');
    }
  };

  return (
    <div >
      <h1>הרשמה</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>תעודת זהות</label>
          <input name="identityCard" value={form.identityCard} onChange={handleChange} required />
        </div>
        <div>
          <label>שם פרטי</label>
          <input name="firstName" value={form.firstName} onChange={handleChange} required />
        </div>
        <div>
          <label>שם משפחה</label>
          <input name="lastName" value={form.lastName} onChange={handleChange} required />
        </div>
        <div>
          <label>אימייל</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required autoComplete="off"/>
        </div>
        <div>
          <label>סיסמה</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} required autoComplete="new-password" />
        </div>
        <div>
          <label>טלפון</label>
          <input name="phone" value={form.phone} onChange={handleChange} required />
        </div>
        <div>
          <label>כתובת</label>
          <input name="address" value={form.address} onChange={handleChange} />
        </div>
        <div>
          <label>תאריך לידה</label>
          <input name="birthDate" type="date" value={form.birthDate} onChange={handleChange} required />
        </div>
        <button type="submit">הרשמה</button>
      </form>
    </div>
  );
};

export default RegisterPage;