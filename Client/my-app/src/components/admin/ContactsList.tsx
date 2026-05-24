import React, { useEffect, useState } from 'react';
import { contactService } from '../../services/contactService';

const ContactsList: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await contactService.getAllMessages();
        setMessages(response.data || response);
      } catch {
        setError('שגיאה בטעינת הפניות');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleResolve = async (id: number) => {
    try {
      await contactService.resolveMessage(id);
      setMessages(prev => prev.map(m => m.id === id ? { ...m, status: 'resolved' } : m));
    } catch {
      setError('שגיאה בעדכון סטטוס');
    }
  };

  if (loading) return <div>טוען פניות...</div>;
  if (error) return <div style={{ color: '#c62828' }}>{error}</div>;

  return (
    <div>
      <h2>פניות צור קשר</h2>
      {messages.map(m => (
        <div key={m.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', borderRadius: '6px' }}>
          <p><strong>שם:</strong> {m.name}</p>
          <p><strong>אימייל:</strong> {m.email}</p>
          <p><strong>טלפון:</strong> {m.phone}</p>
          <p><strong>נושא:</strong> {m.subject}</p>
          <p><strong>הודעה:</strong> {m.message}</p>
          <p><strong>סטטוס:</strong>
            <span style={{ color: m.status === 'resolved' ? '#2e7d32' : '#e65100', marginRight: '5px' }}>
              {m.status === 'resolved' ? ' טופל ✅' : ' בטיפול ⏳'}
            </span>
          </p>
          {m.status !== 'resolved' && (
            <button onClick={() => handleResolve(m.id)}>סמן כטופל ✅</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ContactsList;
