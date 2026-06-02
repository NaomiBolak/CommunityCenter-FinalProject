import React from 'react';
import EventCard from '../components/events/EventCard';

const ActivitiesPage: React.FC = () => (
  <div className="container">
    <h1 className="page-title">אירועים ופעילויות</h1>
    <EventCard />
  </div>
);

export default ActivitiesPage;
