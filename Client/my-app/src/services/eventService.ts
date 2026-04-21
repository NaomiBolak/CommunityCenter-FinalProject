import axios from 'axios';

const API_URL = 'https://localhost:7134/api/Events'; 

export const getEvents = () => {
    return axios.get(API_URL);
};

export const getEventById = (id: number) => {
    return axios.get(`${API_URL}/${id}`);
};

export const AddeEvent = (eventData: any) => {
    return axios.post(API_URL, eventData);
};

export const updateEvent = (id: number, eventData: any) => {
    return axios.put(`${API_URL}/${id}`, eventData);
};

export const RemoveEvent = (id: number) => {
    return axios.delete(`${API_URL}/${id}`);
};
