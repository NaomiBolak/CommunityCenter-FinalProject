import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { ROUTES } from '../utils/constants';

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAppSelector(state => state.auth);

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} />;
  }

  return isAdmin ? <>{children}</> : <Navigate to={ROUTES.HOME} />;
};

export default AdminRoute;
