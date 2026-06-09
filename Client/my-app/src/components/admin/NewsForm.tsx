import React, { useEffect, useState } from 'react';
import { newsService } from '../../services/newsService';
import './NewsForm.css';

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

  if (loading) {
    return (
      <div className="news-form-container">
        <div className="section-loading">
          <div className="spinner"></div>
          טוען חדשות...
        </div>
      </div>
    );
  }

  return (
    <div className="news-form-container">
      <h2 className="news-form-title">ניהול חדשות</h2>

      {success && (
        <div className="alert-success">
          {success}
          <button className="alert-close" onClick={() => setSuccess('')}>×</button>
        </div>
      )}
      {error && (
        <div className="alert-error">
          {error}
          <button className="alert-close" onClick={() => setError('')}>×</button>
        </div>
      )}

      <form onSubmit={handleCreate} className="news-form">
        <h3>הוספת חדשה</h3>
        <div className="input-group">
          <label htmlFor="title">כותרת</label>
          <input id="title" name="title" placeholder="כותרת החדשה" value={form.title} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label htmlFor="content">תוכן</label>
          <textarea id="content" name="content" placeholder="תוכן החדשה" value={form.content} onChange={handleChange} required></textarea>
        </div>
        <div className="input-group">
          <label htmlFor="imagePath">קישור לתמונה (אופציונלי)</label>
          <input id="imagePath" name="imagePath" placeholder="https://example.com/image.jpg" value={form.imagePath} onChange={handleChange} />
        </div>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? (
            <>
              <span className="spinner"></span>
              שומר...
            </>
          ) : (
            'הוסף חדשה'
          )}
        </button>
      </form>

      <div className="news-list">
        <h3>חדשות קיימות</h3>
        {newsList.length === 0 ? (
          <div className="empty-state">
            <p>אין חדשות להצגה כרגע</p>
          </div>
        ) : (
          <div className="news-items">
            {newsList.map(n => (
              <div key={n.id} className="news-item">
                <div className="news-content">
                  <h4>{n.title}</h4>
                  <p>{n.content}</p>
                </div>
                <button className="btn-delete" onClick={() => handleDelete(n.id)}>מחק</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsForm;
