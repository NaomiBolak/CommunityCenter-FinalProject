import React from 'react';
import NewsSection from '../components/home/NewsSection';

const NewsPage: React.FC = () => {
  return (
    <div className="container">
      <h1 className="page-title">חדשות ועדכונים</h1>
      <NewsSection />
    </div>
  );
};

export default NewsPage;
