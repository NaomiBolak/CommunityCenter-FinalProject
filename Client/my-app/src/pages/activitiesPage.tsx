import React from 'react';
import EventCard from '../components/events/EventCard';
const ActivitiesPage = () => {
    return (
        <div>
            <h2>הפעילויות שלנו</h2>
            <EventCard /> {/* הוספתי את ה-EventCard כאן כדי להציג את רשימת האירועים */ }
        </div>
    );
};

export default ActivitiesPage;