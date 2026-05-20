import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// מבנה ההודעה ב-React (מתאים בדיוק ל-C#)
export interface ContactRequest {
    id?: number;
    senderName: string;
    message: string;
    createdAt?: string;
    isHandled?: boolean;
}

interface ContactState {
    messages: ContactRequest[];
    loading: boolean;
    error: string | null;
}

const initialState: ContactState = {
    messages: [],
    loading: false,
    error: null,
};

// 1. פונקציה לשליחת פנייה חדשה (POST /contact)
export const handleSubmit = createAsyncThunk<void, { senderName: string; message: string }, { rejectValue: string }>(
    'contact/handleSubmit',
    async (formData, thunkAPI) => {
        try {
            // שימי לב לשנות את פורט 5000 לפורט האמיתי של ה-API שלך במידת הצורך
            await axios.post('http://localhost:5000/api/contact', formData);
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message || 'שגיאה בשליחת ההודעה');
        }
    }
);

// 2. פונקציה לקבלת כל הפניות עבור המנהל (GET /contact)
export const getMessages = createAsyncThunk<ContactRequest[], void, { rejectValue: string }>(
    'contact/getMessages',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get<ContactRequest[]>('http://localhost:5000/api/contact');
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message || 'שגיאה בטעינת ההודעות');
        }
    }
);

const contactSlice = createSlice({
    name: 'contact',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // שליחת הודעה
            .addCase(handleSubmit.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(handleSubmit.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(handleSubmit.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // קבלת הודעות
            .addCase(getMessages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMessages.fulfilled, (state, action: PayloadAction<ContactRequest[]>) => {
                state.loading = false;
                state.messages = action.payload;
            })
            .addCase(getMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default contactSlice.reducer;
