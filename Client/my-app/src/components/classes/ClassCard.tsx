import React from 'react';
import { Class } from '../../types';


import './ClassCard.css';

interface Props {
  course: Class & { badge?: string };
  isRegistered: boolean;
  onRegister: (courseId: number) => void;
  loading: boolean;
  disabled?: boolean;
  disabledText?: string;
}

const DAY_NAMES: Record<number, string> = {
  0: 'ראשון',
  1: 'שני',
  2: 'שלישי',
  3: 'רביעי',
  4: 'חמישי',
  5: 'שישי',
  
};

const formatTime = (time: string) => time?.slice(0, 5) ?? '';

const ClassCard: React.FC<Props> = ({ course, isRegistered, onRegister, loading, disabled = false, disabledText }) => {
  const dayHebrew = DAY_NAMES[course.dayOfWeek] ?? String(course.dayOfWeek);
  const actionLabel = isRegistered
    ? 'רשום ✓'
    : disabled
      ? disabledText ?? 'לא זמין להרשמה'
      : 'הרשמה לחוג';
  const actionClass = isRegistered ? 'unregister' : disabled ? 'disabled' : 'register';
  const buttonDisabled = loading || disabled || isRegistered;

  return (
    <div className={`class-card ${isRegistered ? 'class-card--registered' : ''}`}>
      <div className="class-card-header">
        <div>
          <h3 className="class-card-title">{course.name}</h3>
          {course.badge && <span className="class-card-badge">{course.badge}</span>}
        </div>
      </div>
      {course.imagePath ? (
        <div className="class-card-image">
          <img src={course.imagePath} alt={course.name} />
        </div>
      ) : null}
      <div className="class-card-body">
        <p className="class-card-desc">{course.description}</p>
        <div className="class-card-meta">
          <span>יום {dayHebrew}</span>
          <span>{formatTime(course.startTime)} - {formatTime(course.endTime)}</span>
          <span>{course.price} ₪</span>
        </div>
      </div>
      <div className="class-card-footer">
        <button
          className={`btn-class ${actionClass}`}
          onClick={() => onRegister(course.id)}
          disabled={buttonDisabled}
          aria-label={isRegistered ? 'מחובר לחוג' : disabled ? 'חוג לא זמין להרשמה' : 'הרשמה לחוג'}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
};

export default React.memo(ClassCard);