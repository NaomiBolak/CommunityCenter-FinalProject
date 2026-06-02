import React, { useEffect, useState } from 'react';
import eventService from '../../services/eventService';

interface Registrant {
  registrationId: number;
  fullName: string;
  email: string;
  phone: string;
  placesCount: number;
  registrationDate: string;
  isPaid: boolean;
}

interface Props {
  eventId: number;
  eventName: string;
}

const EventRegistrantsList: React.FC<Props> = ({ eventId, eventName }) => {
  const [registrants, setRegistrants] = useState<Registrant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const response = await eventService.getEventRegistrants(eventId);
        setRegistrants(response.data || response);
      } catch {
        setError('שגיאה בטעינת הנרשמים');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [eventId]);

  if (loading) return <p>טוען נרשמים...</p>;
  if (error) return <p style={{ color: '#c62828' }}>{error}</p>;

  return (
    <div style={{ marginTop: '16px' }}>
      <h4>נרשמים ל"{eventName}" ({registrants.length})</h4>
      {registrants.length === 0 ? (
        <p>אין נרשמים עדיין</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: '8px', textAlign: 'right' }}>שם</th>
              <th style={{ padding: '8px', textAlign: 'right' }}>אימייל</th>
              <th style={{ padding: '8px', textAlign: 'right' }}>כרטיסים</th>
              <th style={{ padding: '8px', textAlign: 'right' }}>תאריך</th>
            </tr>
          </thead>
          <tbody>
            {registrants.map(r => (
              <tr key={r.registrationId} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px' }}>{r.fullName}</td>
                <td style={{ padding: '8px' }}>{r.email}</td>
                <td style={{ padding: '8px' }}>{r.placesCount}</td>
                <td style={{ padding: '8px' }}>{new Date(r.registrationDate).toLocaleDateString('he-IL')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EventRegistrantsList;
