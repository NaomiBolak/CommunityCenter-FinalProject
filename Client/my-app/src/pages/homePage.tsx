import React from 'react';
import Banner from '../components/home/Banner';
import QuickLinks from '../components/home/QuickLinks';
import UpcomingEventsSection from '../components/home/UpcomingEventsSection';
import NewsSection from '../components/home/NewsSection';
import './homePage.css';

const HomePage: React.FC = () => (
  <div className="home-page">
    <Banner />
    <QuickLinks />
    <UpcomingEventsSection limit={3} />
    <NewsSection limit={3} title="מבזק חדשות" />
  </div>
);

export default HomePage;
