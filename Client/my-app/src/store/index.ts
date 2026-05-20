import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import classesReducer from './slices/classesSlice';
import contactReducer from './slices/contactSlice';
import eventsReducer from './slices/eventsSlice';
import newsReducer from './slices/newsSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        classes: classesReducer,
        contact: contactReducer,
        events: eventsReducer,
        news: newsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;