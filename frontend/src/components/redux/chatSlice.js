import { createSlice } from "@reduxjs/toolkit";

// Define initial state separately so you can reuse it in the reset
const initialState = {
  onlineUsers: [],
  messages: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    resetChatState: () => initialState, // 🔁 Reset to initial state
  },
});

// Export actions
export const { setOnlineUsers, setMessages,  resetChatState } = chatSlice.actions;

// Export reducer
export default chatSlice.reducer;
