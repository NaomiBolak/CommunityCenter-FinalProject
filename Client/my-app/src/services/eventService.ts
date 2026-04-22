import axios from 'axios';

const API_URL = 'https://localhost:7134/api/Events'; 

// מגדירים את האובייקט עם כל הפונקציות
const eventService = {
    getEvents: () => {
        return axios.get(API_URL);
    },
    getEventById: (id: number) => {
        return axios.get(`${API_URL}/${id}`);
    },
    addEvent: (eventData: any) => {
        return axios.post(API_URL, eventData);
    },
    updateEvent: (id: number, eventData: any) => {
        return axios.put(`${API_URL}/${id}`, eventData);
    },
    removeEvent: (id: number) => {
        return axios.delete(`${API_URL}/${id}`);
    },

    getlocation: (id: number) => {
        return axios.get(`${API_URL}/location/${id}`);
    },

    getLocations: () => {
        return axios.get(`${API_URL}/locations`);
    },
    addLocation: (locationData: any) => {
        return axios.post(`${API_URL}/locations`, locationData);
    },
    howmanyRegisterstoEvent: (eventId: number) => {
    return axios.get(`${API_URL}/registers/count/${eventId}`);    }
};

export default eventService;