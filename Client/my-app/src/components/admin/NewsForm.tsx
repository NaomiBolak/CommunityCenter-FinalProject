import React, { useEffect, useState } from 'react';
import { newsService } from '../../services/newsService';

const NewsForm: React.FC = () => {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', imagePath: '' });

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await newsService.getAllNews();
        setNewsList(response.data || response);
      } catch {
        setError('שגיאה בטעינת החדשות');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const response = await newsService.createNews(form);
      setNewsList(prev => [...prev, response.data || response]);
      setForm({ title: '', content: '', imagePath: '' });
      setSuccess('החדשה נוספה בהצלחה!');
    } catch {
      setError('שגיאה בהוספת החדשה');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await newsService.deleteNews(id);
      setNewsList(prev => prev.filter(n => n.id !== id));
      setSuccess('החדשה נמחקה בהצלחה');
    } catch {
      setError('שגיאה במחיקת החדשה');
    }
  };

  if (loading) return <div>טוען חדשות...</div>;

  return (
    <div>
      <h2>ניהול חדשות</h2>

      {success && (
        <div style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '10px', borderRadius: '6px', marginBottom: '10px' }}>
          {success}
          <button onClick={() => setSuccess('')} style={{ float: 'left', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
        </div>
      )}
      {error && (
        <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '6px', marginBottom: '10px' }}>
          {error}
          <button onClick={() => setError('')} style={{ float: 'left', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      <form onSubmit={handleCreate} style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>הוספת חדשה</h3>
        <input name="title" placeholder="כותרת" value={form.title} onChange={handleChange} required style={inputStyle} />
        <textarea name="content" placeholder="תוכן" value={form.content} onChange={handleChange} required style={inputStyle} />
        <input name="imagePath" placeholder="קישור לתמונה (אופציונלי)" value={form.imagePath} onChange={handleChange} style={inputStyle} />
        <button type="submit" disabled={saving} style={btnStyle}>{saving ? 'שומר...' : 'הוסף חדשה ➕'}</button>
      </form>

      <h3>חדשות קיימות</h3>
      {newsList.length === 0 && <p>אין חדשות להצגה</p>}
      {newsList.map(n => (
        <div key={n.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <strong>{n.title}</strong>
            <p style={{ margin: '5px 0', color: '#555' }}>{n.content}</p>
          </div>
          <button onClick={() => handleDelete(n.id)} style={{ ...btnStyle, backgroundColor: '#f44336', whiteSpace: 'nowrap' }}>מחק 🗑️</button>
        </div>
      ))}
    </div>
  );
};

const inputStyle: React.CSSProperties = { display: 'block', width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc' };
const btnStyle: React.CSSProperties = { backgroundColor: '#4CAF50', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' };

export default NewsForm;
