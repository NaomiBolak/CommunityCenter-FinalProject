import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store';
import { loadUserFromStorage } from './store/slices/authSlice';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import HomePage from './pages/homePage';
import ActivitiesPage from './pages/activitiesPage';
import ClassesSchedulePage from './pages/classesSchedulePage';
import ContactUsPage from './pages/contactUsPage';
import NewsPage from './pages/newsPage';
import LoginPage from './pages/loginPage';
import RegisterPage from './pages/registerPage';
import PersonalProfilePage from './pages/personalProfilePage';
import AdminDashboardPage from './pages/adminDashbourdPage';
import AdminClassesPage from './pages/adminClassesPage';
import { ROUTES } from './utils/constants';

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    // טעינת המשתמש והטוקן מה-Storage לתוך ה-State של Redux בזמן רענון (F5)
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  return (
    <Router>
      <Layout>
        <Routes>
          {/* נתיבים ציבוריים */}
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.EVENTS} element={<ActivitiesPage />} />
          <Route path={ROUTES.CLASSES} element={<ClassesSchedulePage />} />
          <Route path={ROUTES.CONTACT} element={<ContactUsPage />} />
          <Route path={ROUTES.NEWS} element={<NewsPage />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          
          {/* נתיב מוגן למשתמשים רשומים */}
          <Route path={ROUTES.PROFILE} element={
            <ProtectedRoute>
              <PersonalProfilePage />
            </ProtectedRoute>
          } />
          
          {/* נתיב מוגן למנהלים בלבד */}
          <Route path={ROUTES.ADMIN} element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          } />
          <Route path={ROUTES.ADMIN_CLASSES} element={
            <AdminRoute>
              <AdminClassesPage />
            </AdminRoute>
          } />
        </Routes>
      </Layout>
    </Router>
  );
}

function App() {
  return (
    // ה-Provider עוטף מלמעלה פעם אחת בלבד ומנגיש את ה-Store לכל הרכיבים באפליקציה
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;