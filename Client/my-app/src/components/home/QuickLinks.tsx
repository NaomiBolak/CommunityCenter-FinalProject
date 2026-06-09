import React from 'react';

import { Link } from 'react-router-dom';

import { ROUTES } from '../../utils/constants';

import './QuickLinks.css';



const links = [
  { to: ROUTES.EVENTS, label: 'אירועים ופעילויות', desc: 'כרטיסים ורישום' },
  { to: ROUTES.NEWS, label: 'חדשות ועדכונים', desc: 'מה חדש בקהילה' },
  { to: ROUTES.CLASSES, label: 'לוח חוגים', desc: 'חוגים וסדנאות' },
  { to: ROUTES.CONTACT, label: 'צור קשר', desc: 'נשמח לעזור' },
  { to: ROUTES.PROFILE, label: 'אזור אישי', desc: 'הכרטיסים שלי' },
];



const QuickLinks: React.FC = () => (

  <section className="quick-links">

    <h2 className="section-title">גישה מהירה</h2>

    <div className="quick-links-grid">

      {links.map((link, i) => (

        <Link

          key={link.to}

          to={link.to}

          className="quick-link-card"

          style={{ animationDelay: `${i * 0.08}s` }}

        >


          <span className="quick-link-label">{link.label}</span>

          <span className="quick-link-desc">{link.desc}</span>

        </Link>

      ))}

    </div>

  </section>

);



export default QuickLinks;


