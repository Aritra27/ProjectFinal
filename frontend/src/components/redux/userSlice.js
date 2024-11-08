import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'User',
  initialState:{
    userinfo:null
  },
  reducers: {
    setUserinfo:(state, action)=> {
      state.userinfo = action.payload
    },
  },
})

export const { setUserinfo } = userSlice.actions
export default userSlice.reducer