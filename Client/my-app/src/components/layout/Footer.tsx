import React from 'react';

import { Link } from 'react-router-dom';

import { ROUTES } from '../../utils/constants';
import { COMMUNITY_LOGO, SITE_NAME } from '../../utils/branding';
import './Footer.css';

const Footer: React.FC = () => (

  <footer className="site-footer">

    <div className="footer-grid">

      <div className="footer-brand">

        <img src={COMMUNITY_LOGO} alt="" className="footer-logo" aria-hidden />

        <div>

          <strong>{SITE_NAME}</strong>

          <p>קהילה, תרבות ופנאי בלב ירושלים</p>

        </div>

      </div>



      <div className="footer-links">

        <h4>ניווט מהיר</h4>

        <Link to={ROUTES.EVENTS}>פעילויות ואירועים</Link>

        <Link to={ROUTES.NEWS}>חדשות</Link>

        <Link to={ROUTES.CONTACT}>צור קשר</Link>

        <Link to={ROUTES.CLASSES}>לוח חוגים</Link>

      </div>



      <div className="footer-contact">

        <h4>יצירת קשר</h4>

        <p>📍 רחוב קהילות יעקב 10, רמת שלמה, ירושלים</p>

        <p>📞 073-3986308</p>

        <p>🕐 א׳–ה׳ 08:00–20:00 | ו׳ 08:00–14:00</p>

      </div>

    </div>

    <div className="footer-bottom">

      <p>© {new Date().getFullYear()} מינהל קהילתי רמת שלמה · כל הזכויות שמורות</p>

    </div>

  </footer>

);



export default Footer;


