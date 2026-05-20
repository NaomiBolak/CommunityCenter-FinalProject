import axios from 'axios';

const API_URL = 'http://localhost:5000/api/contact'; 

export const contactService = {
  // פונקציה לשליחת טופס צור קשר
  sendContactMessage: async (formData: { name: string; email: string; message: string }) => {
    try {
      const response = await axios.post(API_URL, formData);
      return response.data;
    } catch (error) {
      console.error("Error sending contact message:", error);
      throw error;
    }
  }
};