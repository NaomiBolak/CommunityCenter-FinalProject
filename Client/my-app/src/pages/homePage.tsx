import React from 'react';
import NewsSection from '../components/home/NewsSection'; // תוודאי שהנתיב נכון לפי התיקיות שלך

const homePage = () => {
  return (
    <div className="news-page">
      <h1>חדשות המרכז הקהילתי</h1>
      <hr />
      <NewsSection limit={3} />
    </div>
  );
};

export default homePage;