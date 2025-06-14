import { createSlice } from "@reduxjs/toolkit";

// Define initial state separately
const initialState = {
  socket: null,
};

const socketSlice = createSlice({
  name: 'socketio',
  initialState,
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    resetSocketState: () => initialState, // 🔁 Reset to initial state
  },
});

// Export actions
export const { setSocket, resetSocketState } = socketSlice.actions;

// Export reducer
export default socketSlice.reducer;
