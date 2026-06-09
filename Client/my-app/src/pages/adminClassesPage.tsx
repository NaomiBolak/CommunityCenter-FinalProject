import React, { useState, useEffect } from 'react'
import courseService from '../services/courseService';
import { Class } from '../types';

const DAY_NAMES: Record<number, string> = {
  0: 'ראשון', 1: 'שני', 2: 'שלישי', 3: 'רביעי',
  4: 'חמישי', 5: 'שישי', 6: 'שבת',
};

const th: React.CSSProperties = { padding: '10px 12px', textAlign: 'left' };
const td: React.CSSProperties = { padding: '10px 12px', verticalAlign: 'middle' };

const EMPTY_FORM = {
  name: '', description: '', price: 0, imagePath: '',
  categoryId: 1, employeeId: 1, dayOfWeek: 0,
  startTime: '08:00:00', endTime: '09:00:00',
};

const AdminClassesPage: React.FC = () => {
  const [courses, setCourses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState<(typeof EMPTY_FORM & { id?: number }) | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [registrantsFor, setRegistrantsFor] = useState<{ courseId: number; name: string } | null>(null);
  const [registrants, setRegistrants] = useState<any[]>([]);
  const [registrantsLoading, setRegistrantsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchCourses = async () => {
    try {
      const res = await courseService.getCourses();
      setCourses(res.data ?? res);
    } catch {
      setErrorMessage('שגיאה בטעינת החוגים');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  const openAdd = () => setEditingCourse({ ...EMPTY_FORM });
  const openEdit = (c: Class) => setEditingCourse({
    id: c.id, name: c.name, description: c.description,
    price: c.price, imagePath: c.imagePath ?? '',
    categoryId: c.categoryId, employeeId: c.employeeId,
    dayOfWeek: c.dayOfWeek,
    startTime: c.startTime, endTime: c.endTime,
  });

  const handleSave = async () => {
    if (!editingCourse) return;
    try {
      if (editingCourse.id) {
        const res = await courseService.updateCourse(editingCourse.id, editingCourse);
        const updated = res.data ?? res;
        setCourses(prev => prev.map(c => c.id === updated.id ? updated : c));
        setSuccessMessage('החוג עודכן בהצלחה');
      } else {
        const res = await courseService.addCourse(editingCourse);
        const created = res.data ?? res;
        setCourses(prev => [...prev, created]);
        setSuccessMessage('החוג נוסף בהצלחה');
      }
      setEditingCourse(null);
    } catch {
      setErrorMessage('שגיאה בשמירה, נסי שוב');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await courseService.deleteCourse(id);
      setCourses(prev => prev.filter(c => c.id !== id));
      setConfirmDeleteId(null);
      setSuccessMessage('החוג נמחק בהצלחה');
    } catch {
      setErrorMessage('שגיאה במחיקה');
    }
  };

  const handleViewRegistrants = async (course: Class) => {
    setRegistrantsFor({ courseId: course.id, name: course.name });
    setRegistrantsLoading(true);
    try {
      const res = await courseService.getCourseRegistrants(course.id);
      setRegistrants(res.data ?? res);
    } catch {
      setErrorMessage('שגיאה בטעינת הנרשמים');
    } finally {
      setRegistrantsLoading(false);
    }
  };

  if (loading) return <div className="section-loading">טוען חוגים...</div>;

  return (
    <div className="events-page">
      <h1>ניהול חוגים</h1>

      {successMessage && (
        <div className="alert-success">
          {successMessage}
          <button className="alert-close" onClick={() => setSuccessMessage('')}>✕</button>
        </div>
      )}
      {errorMessage && (
        <div className="alert-error-bar">
          {errorMessage}
          <button className="alert-close" onClick={() => setErrorMessage('')}>✕</button>
        </div>
      )}

      <button className="btn-add-event" onClick={openAdd}>הוספת חוג חדש</button>

      {/* טבלת חוגים */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.92rem' }}>
          <thead>
            <tr style={{ background: 'var(--color-primary-dark)', color: 'white' }}>
              <th style={th}>שם</th>
              <th style={th}>תיאור</th>
              <th style={th}>יום</th>
              <th style={th}>שעות</th>
              <th style={th}>מחיר</th>
              <th style={th}>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid var(--color-stone)' }}>
                <td style={td}>{c.name}</td>
                <td style={td}>{c.description}</td>
                <td style={td}>יום {DAY_NAMES[c.dayOfWeek]}</td>
                <td style={td}>{c.startTime?.slice(0, 5)} - {c.endTime?.slice(0, 5)}</td>
                <td style={td}>{c.price} ₪</td>
                <td style={{ ...td, display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <button className="btn-event edit" onClick={() => openEdit(c)}>עריכה</button>
                  <button className="btn-event report" onClick={() => handleViewRegistrants(c)}>נרשמים</button>
                  <button className="btn-event delete" onClick={() => setConfirmDeleteId(c.id)}>מחיקה</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* מודל עריכה / הוספה */}
      {editingCourse && (
        <>
          <div className="modal-overlay" onClick={() => setEditingCourse(null)} />
          <div className="modal-box">
            <h2>{editingCourse.id ? 'עריכת חוג' : 'הוספת חוג חדש'}</h2>
            <div className="edit-form">
              <div>
                <label>שם החוג</label>
                <input value={editingCourse.name} onChange={e => setEditingCourse({ ...editingCourse, name: e.target.value })} />
              </div>
              <div>
                <label>תיאור</label>
                <input value={editingCourse.description} onChange={e => setEditingCourse({ ...editingCourse, description: e.target.value })} />
              </div>
              <div>
                <label>מחיר (₪)</label>
                <input type="number" value={editingCourse.price} onChange={e => setEditingCourse({ ...editingCourse, price: Number(e.target.value) })} />
              </div>
              <div>
                <label>נתיב תמונה</label>
                <input value={editingCourse.imagePath} onChange={e => setEditingCourse({ ...editingCourse, imagePath: e.target.value })} />
              </div>
              <div>
                <label>יום</label>
                <select value={editingCourse.dayOfWeek} onChange={e => setEditingCourse({ ...editingCourse, dayOfWeek: Number(e.target.value) })}>
                  {Object.entries(DAY_NAMES).map(([val, label]) => (
                    <option key={val} value={val}>יום {label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>שעת התחלה</label>
                <input type="time" value={editingCourse.startTime?.slice(0, 5)} onChange={e => setEditingCourse({ ...editingCourse, startTime: e.target.value + ':00' })} />
              </div>
              <div>
                <label>שעת סיום</label>
                <input type="time" value={editingCourse.endTime?.slice(0, 5)} onChange={e => setEditingCourse({ ...editingCourse, endTime: e.target.value + ':00' })} />
              </div>
              <div className="modal-actions">
                <button className="btn-save" onClick={handleSave}>שמור ✅</button>
                <button className="btn-cancel" onClick={() => setEditingCourse(null)}>ביטול ❌</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* מודל אישור מחיקה */}
      {confirmDeleteId !== null && (
        <>
          <div className="modal-overlay" onClick={() => setConfirmDeleteId(null)} />
          <div className="modal-box">
            <h3>האם למחוק את החוג?</h3>
            <div className="confirm-delete-btns">
              <button className="btn-danger" onClick={() => handleDelete(confirmDeleteId)}>מחק</button>
              <button className="btn-cancel" onClick={() => setConfirmDeleteId(null)}>ביטול</button>
            </div>
          </div>
        </>
      )}

      {/* מודל נרשמים */}
      {registrantsFor && (
        <>
          <div className="modal-overlay" onClick={() => setRegistrantsFor(null)} />
          <div className="modal-box wide">
            <h3>נרשמים ל: {registrantsFor.name}</h3>
            {registrantsLoading ? (
              <p>טוען נרשמים...</p>
            ) : (
              <div style={{ maxHeight: '50vh', overflow: 'auto' }}>
                {registrants.length === 0 ? (
                  <p>אין נרשמים לחוג זה.</p>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={th}>שם</th>
                        <th style={th}>דואר אלקטרוני</th>
                        <th style={th}>טלפון</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrants.map((r: any) => (
                        <tr key={r.id} style={{ borderBottom: '1px solid var(--color-stone)' }}>
                          <td style={td}>{r.firstName} {r.lastName}</td>
                          <td style={td}>{r.email}</td>
                          <td style={td}>{r.phone}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setRegistrantsFor(null)}>סגירה</button>
            </div>
          </div>
        </>
      )}

    </div>
  );
};

export default AdminClassesPage;