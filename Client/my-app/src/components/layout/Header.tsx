import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { ROUTES } from '../../utils/constants';

const Header: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav>
      <header>
      
      
          {!isAuthenticated ? (
            <>
              <Link to={ROUTES.LOGIN}><button>התחברות</button></Link>
              <Link to={ROUTES.REGISTER}><button>הרשמה</button></Link>
            </>
          ) : (
            <button onClick={handleLogout}>התנתקות</button>
          )}
        
          <Link to={ROUTES.HOME}>דף הבית</Link>
          <Link to={ROUTES.EVENTS}>פעילויות</Link>
          <Link to={ROUTES.CLASSES}>חוגים</Link>
          <Link to={ROUTES.CONTACT}>צור קשר</Link>
          <Link to={ROUTES.NEWS}>מה חדש</Link>

          {isAuthenticated && (
            <Link to={ROUTES.PROFILE}>אזור אישי</Link>
          )}

          {isAdmin && (
            <Link to={ROUTES.ADMIN}>ניהול</Link>
          )}

        
      </header>
    </nav>
  );
};

export default Header;
