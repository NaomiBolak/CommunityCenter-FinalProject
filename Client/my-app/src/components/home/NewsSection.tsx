import React, { useEffect, useState } from 'react';
import { newsService } from '../../services/newsService'; // תוודאי שהנתיב נכון

const NewsSection = () => {
  const [news, setNews] = useState<any[]>([]); // כאן נשמור את החדשות
  const [loading, setLoading] = useState(true);

  // משיכת החדשות ברגע שהקומפוננטה עולה
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await newsService.getAllNews();
        setNews(data);
      } catch (error) {
        console.error("Failed to load news", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <div>טוען חדשות...</div>;

  return (
    <div className="news-section">
      <h2>חדשות אחרונות</h2>
      <ul>
        {news.map((item: any) => (
          <li key={item.id}>
            <h3>{item.title}</h3>
            <p>{item.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsSection;