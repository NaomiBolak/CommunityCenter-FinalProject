import React, { useCallback, useEffect, useState } from 'react';
import api from '../../services/api';
import './ApiStatusBanner.css';

const ApiStatusBanner: React.FC = () => {
  const [serverDown, setServerDown] = useState(false);

  const check = useCallback(async () => {
    try {
      await api.get('/Health', { timeout: 4000 });
      setServerDown(false);
    } catch {
      setServerDown(true);
    }
  }, []);

  useEffect(() => {
    const initial = setTimeout(check, 2000);
    const interval = setInterval(check, 20000);
    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, [check]);

  if (!serverDown) return null;

  return (
    <div className="api-status-banner" role="alert">
      השרת (API) לא זמין. ודאי ש-Visual Studio רץ (F5, פרופיל http, פורט 5051), ואז{' '}
      <button type="button" className="api-status-retry" onClick={check}>
        לחצי כאן לבדיקה מחדש
      </button>
    </div>
  );
};

export default ApiStatusBanner;
