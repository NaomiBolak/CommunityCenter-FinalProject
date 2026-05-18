import { createSlice } from '@reduxjs/toolkit';

const contactSlice = createSlice({
  name: 'contact',
  initialState: { messages: [] as any[] },
  reducers: {},
});

export default contactSlice.reducer;
