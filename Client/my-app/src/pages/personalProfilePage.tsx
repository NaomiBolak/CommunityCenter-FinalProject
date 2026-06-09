import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import profileService, { UserProfile } from '../services/profileService';
import TicketCard from '../components/events/TicketCard';
import { EventRegistration, RegisteredCourse } from '../types';
import './personalProfilePage.css';

const DAY_NAMES: Record<number, string> = {
  0: 'ראשון',
  1: 'שני',
  2: 'שלישי',
  3: 'רביעי',
  4: 'חמישי',
  5: 'שישי',
  6: 'שבת',
};

const formatTime = (time: string) => time?.slice(0, 5) ?? '';

const PersonalProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await profileService.getMyProfile();
        setProfile(data);
      } catch {
        setError('שגיאה בטעינת הפרופיל');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="profile-page"><p>טוען...</p></div>;
  if (error) return <div className="profile-page"><p className="profile-error">{error}</p></div>;
  if (!profile) return null;

  const tickets: EventRegistration[] = profile.events || [];
  const courses: RegisteredCourse[] = profile.courses || [];

  return (
    <div className="profile-page">
      <h1>אזור אישי</h1>

      <section className="profile-card">
        <h2>פרטים אישיים</h2>
        <div className="profile-details">
          <p><strong>שם:</strong> {profile.firstName} {profile.lastName}</p>
          <p><strong>ת.ז:</strong> {profile.identityCard || '—'}</p>
          <p><strong>אימייל:</strong> {profile.email}</p>
          <p><strong>טלפון:</strong> {profile.phone || '—'}</p>
          <p><strong>כתובת:</strong> {profile.address || '—'}</p>
          <p><strong>תאריך הצטרפות:</strong> {new Date(profile.joinDate).toLocaleDateString('he-IL')}</p>
        </div>
      </section>

      <section className="profile-tickets">
        <h2>הכרטיסים שלי ({tickets.length})</h2>
        {tickets.length === 0 ? (
          <p className="profile-empty">עדיין לא רכשת כרטיסים לאירועים. <Link to="/activities">לצפייה באירועים</Link></p>
        ) : (
          tickets.map(ticket => <TicketCard key={ticket.registrationId} ticket={ticket} />)
        )}
      </section>

      <section className="profile-classes">
        <h2>החוגים שלי ({courses.length})</h2>
        {courses.length === 0 ? (
          <p className="profile-empty">עדיין לא נרשמת לחוגים. <Link to="/classes">לצפייה בחוגים</Link></p>
        ) : (
          <div className="classes-list">
            {courses.map(course => (
              <div key={course.registrationId} className="class-item">
                <div>
                  <h3>{course.courseName}</h3>
                  <p>יום {DAY_NAMES[course.dayOfWeek]} • {formatTime(course.startTime)} - {formatTime(course.endTime)}</p>
                </div>
                <div className="class-meta">
                  <span>נרשמת ב: {new Date(course.registrationDate).toLocaleDateString('he-IL')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default PersonalProfilePage;
