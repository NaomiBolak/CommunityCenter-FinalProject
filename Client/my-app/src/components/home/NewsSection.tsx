import React, { useEffect, useState } from 'react';
import { newsService } from '../../services/newsService';
import { NewsItem } from '../../store/slices/newsSlice';

const NewsSection = ({ limit }: { limit?: number }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await newsService.getAllNews();
        const all = response.data || response;
        setNews(limit ? all.slice(0, limit) : all);
      } catch {
        setError('שגיאה בטעינת החדשות');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [limit]);

  if (loading) return <div>טוען חדשות...</div>;
  if (error) return <div style={{ color: '#c62828' }}>{error}</div>;

  return (
    <div className="news-section">
      <h2>חדשות אחרונות</h2>
      <ul>
        {news.map((item: NewsItem) => (
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