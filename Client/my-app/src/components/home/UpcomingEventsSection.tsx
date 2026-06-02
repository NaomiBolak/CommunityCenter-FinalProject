import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import eventService from '../../services/eventService';
import { Event } from '../../types';
import { ROUTES } from '../../utils/constants';
import './UpcomingEventsSection.css';

const UpcomingEventsSection: React.FC<{ limit?: number }> = ({ limit = 3 }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await eventService.getUpcomingEvents(limit);
        setEvents(response.data || response);
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [limit]);

  if (loading) return <div className="section-loading">טוען אירועים...</div>;
  if (events.length === 0) return null;

  return (
    <section className="upcoming-events">
      <div className="section-header">
        <h2 className="section-title" style={{ margin: 0 }}>אירועים קרובים</h2>
        <Link to={ROUTES.EVENTS} className="section-link">לכל האירועים ←</Link>
      </div>
      <div className="events-grid">
        {events.map(ev => (
          <article key={ev.id} className="event-preview-card">
            <div className="event-preview-image">
              {ev.imagePath ? (
                <img src={ev.imagePath} alt={ev.description} />
              ) : (
                <span>🎭</span>
              )}
            </div>
            <div className="event-preview-body">
              <h3>{ev.description}</h3>
              <p className="event-date">{new Date(ev.date).toLocaleDateString('he-IL')}</p>
              <p className="event-price">{ev.unitPrice} ₪</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default UpcomingEventsSection;
