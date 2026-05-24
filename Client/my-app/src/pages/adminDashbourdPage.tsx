import React, { useState } from 'react';
import NewsForm from '../components/admin/NewsForm';
import ContactsList from '../components/admin/ContactsList';
import EventCard from '../components/events/EventCard';

type AdminTab = 'news' | 'contacts' | 'events';

const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('news');

  return (
    <div style={{ padding: '20px' }}>
      <h1>לוח ניהול</h1>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('events')}
          style={{ ...tabStyle, backgroundColor: activeTab === 'events' ? '#1976d2' : '#e0e0e0', color: activeTab === 'events' ? 'white' : '#333' }}
        >
          🎟️ ניהול אירועים
        </button>
        <button
          onClick={() => setActiveTab('news')}
          style={{ ...tabStyle, backgroundColor: activeTab === 'news' ? '#1976d2' : '#e0e0e0', color: activeTab === 'news' ? 'white' : '#333' }}
        >
          📰 ניהול חדשות
        </button>
        <button
          onClick={() => setActiveTab('contacts')}
          style={{ ...tabStyle, backgroundColor: activeTab === 'contacts' ? '#1976d2' : '#e0e0e0', color: activeTab === 'contacts' ? 'white' : '#333' }}
        >
          📩 פניות צור קשר
        </button>
      </div>

      <div>
        {activeTab === 'events' && <EventCard />}
        {activeTab === 'news' && <NewsForm />}
        {activeTab === 'contacts' && <ContactsList />}
      </div>
    </div>
  );
};

const tabStyle: React.CSSProperties = { padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '15px' };

export default AdminDashboardPage;
