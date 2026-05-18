import { createSlice } from '@reduxjs/toolkit';

const classesSlice = createSlice({
  name: 'classes',
  initialState: { classes: [] as any[] },
  reducers: {},
});

export default classesSlice.reducer;
