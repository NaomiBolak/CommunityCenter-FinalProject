import React from 'react';
import ContactForm from '../components/contact/ContactForm';

const ContactUsPage = () => {
  return (
    <div className="contact-page">
      <h1 className="page-title">צור קשר</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 24 }}>
        רחוב קהילות יעקב 10, רמת שלמה · נשמח לשמוע מכם
      </p>
      <ContactForm />
    </div>
  );
};

export default ContactUsPage;