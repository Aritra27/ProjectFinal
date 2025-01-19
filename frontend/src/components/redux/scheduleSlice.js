import { createSlice } from "@reduxjs/toolkit";

const initialState= {
  scheduleInfo: [],
  selectedSchedule: null,
  loading: false, // Add loading state
}

const scheduleSlice = createSlice({
  name: "Schedule",
  initialState,
  reducers: {
    setScheduleInfo: (state, action) => {
      state.scheduleInfo = action.payload;
    },
    setSelectedSchedule: (state, action) => {
      state.selectedSchedule = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload; // Set loading state
    },
    resetScheduleState: () => initialState,
  },
});

export const {
  setScheduleInfo,
  setSelectedSchedule,
  setLoading,
  resetScheduleState,
} = scheduleSlice.actions;
export default scheduleSlice.reducer;
