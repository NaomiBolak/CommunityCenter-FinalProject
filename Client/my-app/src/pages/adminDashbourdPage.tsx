import React, { useState } from 'react';
import NewsForm from '../components/admin/NewsForm';
import ContactsList from '../components/admin/ContactsList';
import EventCard from '../components/events/EventCard';
import AdminClassesPage from './adminClassesPage';
import './adminDashboard.css';

type AdminTab = 'news' | 'contacts' | 'events' | 'classes';

const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('events');

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <div>
          <h1>לוח ניהול</h1>
          <p className="admin-subtitle">ניהול אירועים, חדשות, חוגים ופניות ציבור</p>
        </div>
      </div>

      <div className="admin-tabs">
        <button
          onClick={() => setActiveTab('events')}
          className={activeTab === 'events' ? 'active' : ''}
        >
          ניהול אירועים
        </button>
        <button
          onClick={() => setActiveTab('news')}
          className={activeTab === 'news' ? 'active' : ''}
        >
          ניהול חדשות
        </button>
        <button
          onClick={() => setActiveTab('classes')}
          className={activeTab === 'classes' ? 'active' : ''}
        >
          ניהול חוגים
        </button>
        <button
          onClick={() => setActiveTab('contacts')}
          className={activeTab === 'contacts' ? 'active' : ''}
        >
          פניות צור קשר
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'events' && <EventCard />}
        {activeTab === 'news' && <NewsForm />}
        {activeTab === 'classes' && <AdminClassesPage />}
        {activeTab === 'contacts' && <ContactsList />}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
