import { createSlice } from '@reduxjs/toolkit';

const eventsSlice = createSlice({
  name: 'events',
  initialState: { events: [] as any[] },
  reducers: {},
});

export default eventsSlice.reducer;
