import axios from 'axios';

// כתובת ה-API שלך (תוודאי שהיא תואמת לכתובת של השרת שלך)
const API_URL = 'http://localhost:5000/api/news'; 

export const newsService = {
  // פונקציה למשיכת כל החדשות
  getAllNews: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching news:", error);
      throw error;
    }
  }
};