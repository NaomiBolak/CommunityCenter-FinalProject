import React, { useState } from 'react';
import { contactService } from '../../services/contactService';

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await contactService.sendContactMessage(formData);
      alert('ההודעה נשלחה בהצלחה!');
      setFormData({ name: '', email: '', message: '' }); // איפוס הטופס
    } catch (error) {
      alert('משהו השתבש, נסה שוב מאוחר יותר.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>שלחו לנו הודעה</h3>
      <input 
        placeholder="שם מלא" 
        value={formData.name} 
        onChange={(e) => setFormData({...formData, name: e.target.value})} 
        required 
      />
      <input 
        placeholder="אימייל" 
        type="email"
        value={formData.email} 
        onChange={(e) => setFormData({...formData, email: e.target.value})} 
        required 
      />
      <textarea 
        placeholder="הודעה" 
        value={formData.message} 
        onChange={(e) => setFormData({...formData, message: e.target.value})} 
        required 
      />
      <button type="submit">שלח</button>
    </form>
  );
};

export default ContactForm;