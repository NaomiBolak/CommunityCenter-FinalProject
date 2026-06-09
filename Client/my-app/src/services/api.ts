import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../utils/constants';

const RETRYABLE_STATUS = new Set([500, 502, 503, 504]);
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 800;

type RetryConfig = InternalAxiosRequestConfig & { __retryCount?: number };

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryConfig | undefined;

    if (config && (config.method ?? 'get').toLowerCase() === 'get') {
      const retryCount = config.__retryCount ?? 0;
      const status = error.response?.status;
      const canRetry =
        retryCount < MAX_RETRIES &&
        (RETRYABLE_STATUS.has(status ?? 0) ||
          error.code === 'ERR_NETWORK' ||
          error.code === 'ECONNABORTED');

      if (canRetry) {
        config.__retryCount = retryCount + 1;
        await sleep(RETRY_DELAY_MS * config.__retryCount);
        return api(config);
      }
    }

    const serverDown =
      !error.response &&
      (error.code === 'ERR_NETWORK' ||
        error.code === 'ECONNREFUSED' ||
        error.message?.includes('Network Error'));

    if (serverDown) {
      error.message =
        'השרת (API) לא רץ. הפעילי את CommunityCenter.API על http://127.0.0.1:5051 (F5 ב-Visual Studio, פרופיל http).';
    } else if (error.response?.status === 503) {
      error.message =
        'השרת (API) לא זמין. הפעילי את CommunityCenter.API על http://127.0.0.1:5051 ורענני את הדף.';
    } else if (error.response?.status === 401) {
      localStorage.removeItem('token');
      error.message =
        'אין הרשאה לגשת למשאב זה. התחברי שוב כדי לטעון את הפרופיל.';
    } else if (error.response?.status === 500) {
      const detail = (error.response.data as { detail?: string })?.detail;
      error.message = detail
        ? `שגיאת שרת: ${detail}`
        : 'שגיאת שרת זמנית — נסי לרענן. אם Visual Studio בונה מחדש, המתיני לסיום.';
    }

    return Promise.reject(error);
  }
);

export default api;
