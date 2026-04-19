import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
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
import { ROUTES } from './utils/constants';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.EVENTS} element={<ActivitiesPage />} />
            <Route path={ROUTES.CLASSES} element={<ClassesSchedulePage />} />
            <Route path={ROUTES.CONTACT} element={<ContactUsPage />} />
            <Route path={ROUTES.NEWS} element={<NewsPage />} />
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
            <Route path={ROUTES.PROFILE} element={
              <ProtectedRoute><PersonalProfilePage /></ProtectedRoute>
            } />
            <Route path={ROUTES.ADMIN} element={
              <AdminRoute><AdminDashboardPage /></AdminRoute>
            } />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;
