import { createSlice } from '@reduxjs/toolkit'

const portSlice = createSlice({
  name: 'Port',
  initialState:{
    portinfo:[],
    selectedPort :null
  },
  reducers: {
    setPortinfo:(state, action)=> {
      state.portinfo = action.payload
    },
    setSelectedPort:(state, action)=> {
      state.selectedPort = action.payload
    },
  },
})

export const {  setPortinfo , setSelectedPort} = portSlice.actions
export default portSlice.reducer