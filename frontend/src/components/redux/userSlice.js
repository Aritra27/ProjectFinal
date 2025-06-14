import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userinfo: null,
  selectedUser: null,
  suggestedUsers: [],
};

const userSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    setUserinfo: (state, action) => {
      state.userinfo = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload;
    },
    resetUserState: () => initialState,
  },
});

export const {
  setUserinfo,
  resetUserState,
  setSelectedUser,
  setSuggestedUsers,
} = userSlice.actions;
export default userSlice.reducer;
