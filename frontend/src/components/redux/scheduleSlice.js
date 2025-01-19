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
    updateScheduleState: (state, action) => {
      const { id, state: newState } = action.payload;
      const schedule = state.scheduleInfo.find((sch) => sch._id === id);
      if (schedule) {
        schedule.state = newState; // Update the state of the specific schedule
      }
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
  updateScheduleState
} = scheduleSlice.actions;
export default scheduleSlice.reducer;
