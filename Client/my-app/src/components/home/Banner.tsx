import React from 'react';

import { Link } from 'react-router-dom';

import { ROUTES } from '../../utils/constants';
import { COMMUNITY_LOGO, SITE_NAME } from '../../utils/branding';
import './Banner.css';

const Banner: React.FC = () => (

  <section className="hero-banner">
    <div className="hero-inner">

      <img src={COMMUNITY_LOGO} alt={SITE_NAME} className="hero-logo" />

      <div className="hero-content">

        <span className="hero-badge">ירושלים</span>

        <h1 className="hero-title">
          <span className="hero-title-main">מינהל קהילתי</span>
          <span className="hero-title-sub">רמת שלמה</span>
        </h1>

        <p>

          מרכז החיים הקהילתיים של השכונה — אירועים, חוגים, פעילויות תרבות

          וחברתיות לכל המשפחה

        </p>

        <div className="hero-actions">

          <Link to={ROUTES.EVENTS} className="hero-btn primary">גלו את הפעילויות</Link>

          <Link to={ROUTES.CONTACT} className="hero-btn secondary">דברו איתנו</Link>

        </div>

      </div>

    </div>

  </section>

);



export default Banner;


