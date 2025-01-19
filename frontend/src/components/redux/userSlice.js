import { createSlice } from '@reduxjs/toolkit'

const initialState={
  userinfo:null
}

const userSlice = createSlice({
  name: 'User',
  initialState,
  reducers: {
    setUserinfo:(state, action)=> {
      state.userinfo = action.payload
    },
    resetUserState: () => initialState,
  },
})

export const { setUserinfo, resetState,resetUserState } = userSlice.actions
export default userSlice.reducer