import React, { useEffect, useState } from 'react';
import { contactService } from '../../services/contactService';

interface ContactMessageItem {
  id: number;
  name?: string;
  senderName?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message: string;
  status?: string;
  isHandled?: boolean;
}

const ContactsList: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessageItem[]>([]);
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

  const getStatus = (message: ContactMessageItem) =>
    message.status || (message.isHandled ? 'resolved' : 'pending');

  const getName = (message: ContactMessageItem) =>
    message.name || message.senderName || 'לא צוין';

  const handleResolve = async (id: number) => {
    try {
      await contactService.resolveMessage(id);
      setMessages(prev =>
        prev.map(m => (m.id === id ? { ...m, status: 'resolved', isHandled: true } : m))
      );
    } catch {
      setError('שגיאה בעדכון סטטוס');
    }
  };

  if (loading) return <div>טוען פניות...</div>;
  if (error) return <div style={{ color: '#c62828' }}>{error}</div>;

  return (
    <div>
      <h2>פניות צור קשר</h2>
      {messages.map(m => {
        const status = getStatus(m);
        return (
          <div key={m.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', borderRadius: '6px' }}>
            <p><strong>שם:</strong> {getName(m)}</p>
            <p><strong>אימייל:</strong> {m.email || 'לא צוין'}</p>
            <p><strong>טלפון:</strong> {m.phone || 'לא צוין'}</p>
            <p><strong>נושא:</strong> {m.subject || 'לא צוין'}</p>
            <p><strong>הודעה:</strong> {m.message}</p>
            <p><strong>סטטוס:</strong>
              <span style={{ color: status === 'resolved' ? '#2e7d32' : '#e65100', marginRight: '5px' }}>
                {status === 'resolved' ? ' טופל ✅' : ' בטיפול ⏳'}
              </span>
            </p>
            {status !== 'resolved' && (
              <button onClick={() => handleResolve(m.id)}>סמן כטופל ✅</button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ContactsList;
