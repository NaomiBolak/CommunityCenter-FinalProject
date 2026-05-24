import React, { useState } from 'react';
import { contactService } from '../../services/contactService';

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await contactService.sendContactMessage(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      setError('משהו השתבש, נסה שוב מאוחר יותר.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (success) return <div style={{ color: '#2e7d32', padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '6px' }}>ההודעה נשלחה בהצלחה! נחזור אליך בהקדם האפשר.</div>;

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: '#c62828', backgroundColor: '#ffebee', padding: '8px', borderRadius: '4px' }}>{error}</p>}
      <input name="name" placeholder="שם מלא" value={formData.name} onChange={handleChange} required />
      <input name="email" type="email" placeholder="אימייל" value={formData.email} onChange={handleChange} required />
      <input name="phone" placeholder="טלפון" value={formData.phone} onChange={handleChange} required />
      <input name="subject" placeholder="נושא" value={formData.subject} onChange={handleChange} required />
      <textarea name="message" placeholder="הודעה" value={formData.message} onChange={handleChange} required />
      <button type="submit" disabled={loading}>{loading ? 'שולח...' : 'שלח'}</button>
    </form>
  );
};

export default ContactForm;
