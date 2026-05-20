import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// הגדרת המבנה של חדשה אחת בודדת
export interface NewsItem {
    id: number;
    title: string;
    content: string;
    datePublished: string;
}

// הגדרת המבנה של ה-State
interface NewsState {
    news: NewsItem[];
    loading: boolean;
    error: string | null;
}

const initialState: NewsState = {
    news: [],
    loading: false,
    error: null,
};

// פונקציית ה-fetchNews (שני את הפורט 5000 לפורט האמיתי שלך במידת הצורך)
export const fetchNews = createAsyncThunk<NewsItem[], void, { rejectValue: string }>(
    'news/fetchNews', 
    async (_, thunkAPI) => {
        try {
            const response = await axios.get<NewsItem[]>('http://localhost:5000/api/news');
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message || 'שגיאה בטעינת החדשות');
        }
    }
);

const newsSlice = createSlice({
    name: 'news',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchNews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNews.fulfilled, (state, action: PayloadAction<NewsItem[]>) => {
                state.loading = false;
                state.news = action.payload;
            })
            .addCase(fetchNews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default newsSlice.reducer;