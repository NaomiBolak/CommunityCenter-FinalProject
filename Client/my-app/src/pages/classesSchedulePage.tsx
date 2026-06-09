import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import courseService from '../services/courseService';
import ClassCard from '../components/classes/ClassCard';
import { useAppSelector } from '../store/hooks';
import { Class } from '../types';
import { ROUTES } from '../utils/constants';
import './classesSchedulePage.css';

type DisplayClass = Class & { badge?: string };

const FEATURED_COURSES: DisplayClass[] = [
  {
    id: 1001,
    name: 'חוג תפירה ויצירה משפחתית',
    description: 'לימוד תפירה בסיסית, יצירת חבלים ומתלים, ועיצוב פריטים לבית.',
    price: 80,
    dayOfWeek: 1,
    startTime: '10:00:00',
    endTime: '12:00:00',
    categoryId: 1,
    targetAudienceId: 1,
    locationId: 1,
    employeeId: 1,
    badge: 'חדש',
  },
  {
    id: 1002,
    name: 'שיעור תורה לנשים',
    description: 'מפגש שבועי לדיון בספרי מוסר והלכה, המוגש בצורה מעשית וברורה .',
    price: 90,
    dayOfWeek: 3,
    startTime: '19:30:00',
    endTime: '21:00:00',
    categoryId: 2,
    targetAudienceId: 2,
    locationId: 1,
    employeeId: 2,
    badge: 'מומלץ',
  },
  {
    id: 1003,
    name: 'חוג מוזיקה ושירה חסידית',
    description: 'שירה, נגינה ולימוד שירי חב"ד ושירי חסידות, באווירה מתאימה ומשפחתית.',
    price: 100,
    dayOfWeek: 2,
    startTime: '17:00:00',
    endTime: '18:30:00',
    categoryId: 3,
    targetAudienceId: 3,
    locationId: 1,
    employeeId: 3,
    badge: 'בקרוב',
  },
  {
    id: 1004,
    name: 'חוג בישול ביתי לכל המשפחה',
    description: 'קורס בישול עם דגש על אוכל גורמה, וניהול המטבח.',
    price: 95,
    dayOfWeek: 4,
    startTime: '16:30:00',
    endTime: '18:30:00',
    categoryId: 4,
    targetAudienceId: 2,
    locationId: 1,
    employeeId: 4,
    badge: 'פופולרי',
  },
];

const ClassesSchedulePage: React.FC = () => {
  const [courses, setCourses] = useState<DisplayClass[]>([]);
  const [registeredIds, setRegisteredIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [backendUnavailable, setBackendUnavailable] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { isAuthenticated, user } = useAppSelector(state => state.auth);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const res = await courseService.getCourses();
      const apiCourses = res.data ?? res;

      if (Array.isArray(apiCourses)) {
        if (apiCourses.length > 0) {
          setCourses(apiCourses);
        } else {
          setCourses([]);
          setErrorMessage('כרגע אין חוגים זמינים. בדוק בהמשך.');
        }
      } else {
        throw new Error('נתוני חוגים לא תקינים');
      }
    } catch {
      setErrorMessage('שגיאה בטעינת החוגים — ודא שהשרת רץ');
      setCourses(FEATURED_COURSES);
      setBackendUnavailable(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sortedCourses = useMemo(
    () => [...courses].sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime)),
    [courses],
  );

  const handleRegister = async (courseId: number) => {
    if (!isAuthenticated || !user) {
      navigate(ROUTES.LOGIN);
      return;
    }
    setActionLoading(true);
    try {
      await courseService.registerToCourse(user.id, courseId);
      setRegisteredIds(prev => { const next = new Set(prev); next.add(courseId); return next; });
      setSuccessMessage('הרשמתך בחוג נקלטה בהצלחה!');
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message ?? 'הרישום נכשל, נסה שוב מאוחר יותר');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="section-loading">טוען חוגים...</div>;

  return (
    <div className="classes-page">
      <section className="classes-hero">
        <div>
          <h1>לוח חוגים</h1>
          <p className="classes-intro">
            חוגים מגוונים ושעות נוחות במהלך השבוע. רישום בטוח ושירות מקצועי.
          </p>
        </div>
        <div className="classes-hero-stats">
          <div>
            <strong>22</strong>
            <span>חוגים פעילים השבוע</span>
          </div>
          <div>
            <strong>1,450+</strong>
            <span>משתתפים מרוצים</span>
          </div>
        </div>
      </section>

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
      {backendUnavailable && (
        <div className="alert-error-bar">
          חוגים אלה מוצגים ממקור זמני בלבד. כדי להירשם יש להפעיל את שרת ה-API או להוסיף חוגים למסד הנתונים.
        </div>
      )}
      {!backendUnavailable && courses.length === 0 && (
        <div className="classes-empty">אין חוגים זמינים כרגע.</div>
      )}

      <div className="classes-grid">
        {sortedCourses.map(course => (
          <ClassCard
            key={course.id}
            course={course}
            isRegistered={registeredIds.has(course.id)}
            onRegister={handleRegister}
            loading={actionLoading}
            disabled={backendUnavailable}
            disabledText="אין אפשרות להרשמה כרגע"
          />
        ))}
      </div>
    </div>
  );
};

export default ClassesSchedulePage;