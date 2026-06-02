import React, { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { useAppSelector, useAppDispatch } from '../../store/hooks';

import { logout } from '../../store/slices/authSlice';

import { ROUTES } from '../../utils/constants';
import { COMMUNITY_LOGO, SITE_NAME, SITE_TAGLINE } from '../../utils/branding';
import './Header.css';

const Header: React.FC = () => {

  const { isAuthenticated, isAdmin } = useAppSelector(state => state.auth);

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);



  const handleLogout = () => {

    dispatch(logout());

    navigate('/');

    setMenuOpen(false);

  };



  const closeMenu = () => setMenuOpen(false);



  return (

    <header className="site-header">

      <nav className="site-nav">

        <Link to={ROUTES.HOME} className="site-brand" onClick={closeMenu}>

          <img src={COMMUNITY_LOGO} alt={SITE_NAME} className="site-logo-img" />

          <span className="site-brand-text">

            <span className="site-brand-title">{SITE_NAME}</span>

            <span className="site-brand-sub">{SITE_TAGLINE}</span>

          </span>

        </Link>



        <button

          type="button"

          className="nav-toggle"

          aria-label="תפריט"

          aria-expanded={menuOpen}

          onClick={() => setMenuOpen(!menuOpen)}

        >

          <span /><span /><span />

        </button>



        <div className={`site-nav-panel ${menuOpen ? 'open' : ''}`}>

          <div className="site-nav-links">

            <Link to={ROUTES.HOME} onClick={closeMenu}>דף הבית</Link>

            <Link to={ROUTES.EVENTS} onClick={closeMenu}>פעילויות</Link>

            <Link to={ROUTES.CLASSES} onClick={closeMenu}>חוגים</Link>

            <Link to={ROUTES.NEWS} onClick={closeMenu}>מה חדש</Link>

            <Link to={ROUTES.CONTACT} onClick={closeMenu}>צור קשר</Link>

            {isAuthenticated && (

              <Link to={ROUTES.PROFILE} onClick={closeMenu}>אזור אישי</Link>

            )}

            {isAdmin && (

              <Link to={ROUTES.ADMIN} className="nav-admin" onClick={closeMenu}>ניהול</Link>

            )}

          </div>



          <div className="site-nav-auth">

            {!isAuthenticated ? (

              <>

                <Link to={ROUTES.LOGIN} onClick={closeMenu}>

                  <button type="button" className="btn-nav-outline">התחברות</button>

                </Link>

                <Link to={ROUTES.REGISTER} onClick={closeMenu}>

                  <button type="button" className="btn-nav-primary">הרשמה</button>

                </Link>

              </>

            ) : (

              <button type="button" className="btn-nav-outline" onClick={handleLogout}>התנתקות</button>

            )}

          </div>

        </div>

      </nav>

    </header>

  );

};



export default Header;


