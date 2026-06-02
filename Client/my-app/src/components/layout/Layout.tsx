import React from 'react';
import Header from './Header';
import Footer from './Footer';
import ApiStatusBanner from './ApiStatusBanner';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div>
    <ApiStatusBanner />
    <Header />
    <main>{children}</main>
    <Footer />
  </div>
);

export default Layout;
