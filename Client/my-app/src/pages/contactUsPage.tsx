import React from 'react';
import ContactForm from '../components/common/ContactForm'; // תעדכני את הנתיב לפי המיקום של הקובץ

const ContactUsPage = () => {
  return (
    <div className="contact-page">
      <h1>צור קשר</h1>
      <ContactForm />
    </div>
  );
};

export default ContactUsPage;