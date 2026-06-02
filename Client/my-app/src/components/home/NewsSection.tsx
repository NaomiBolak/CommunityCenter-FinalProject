import React, { useEffect, useState } from 'react';
import { newsService } from '../../services/newsService';
import { NewsItem } from '../../store/slices/newsSlice';
import './NewsSection.css';

interface Props {
  limit?: number;
  title?: string;
}

const NewsSection: React.FC<Props> = ({ limit, title = 'חדשות אחרונות' }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = limit
          ? await newsService.getLatestNews(limit)
          : await newsService.getAllNews();
        const all = response.data || response;
        setNews(limit ? all : all);
      } catch {
        setError('שגיאה בטעינת החדשות');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [limit]);

  if (loading) return <div className="news-loading">טוען חדשות...</div>;
  if (error) return <div className="news-error">{error}</div>;
  if (news.length === 0) return <div className="news-empty">אין חדשות להצגה</div>;

  return (
    <section className="news-section">
      <h2 className="section-title">{title}</h2>
      <div className="news-grid">
        {news.map((item: NewsItem & { imagePath?: string }) => (
          <article key={item.id} className="news-card">
            {(item.imagePath || (item as any).imageUrl) && (
              <div className="news-card-image">
                <img src={item.imagePath || (item as any).imageUrl} alt={item.title} />
              </div>
            )}
            <div className="news-card-body">
              <h3>{item.title}</h3>
              <time>{new Date(item.datePublished).toLocaleDateString('he-IL')}</time>
              <p>{item.content}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default NewsSection;
