import { createSlice } from '@reduxjs/toolkit';

const newsSlice = createSlice({
  name: 'news',
  initialState: { news: [] },
  reducers: {}
});

export default newsSlice.reducer;
