import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { ROUTES } from '../utils/constants';

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useAppSelector(state => state.auth);
  return isAdmin ? <>{children}</> : <Navigate to={ROUTES.HOME} />;
};

export default AdminRoute;
