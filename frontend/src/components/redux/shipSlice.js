import { createSlice } from '@reduxjs/toolkit'

const shipSlice = createSlice({
  name: 'Ship',
  initialState:{
    shipinfo:null
  },
  reducers: {
    setShipinfo:(state, action)=> {
      state.shipinfo = action.payload
    },
  },
})

export const { setShipinfo } = shipSlice.actions
export default shipSlice.reducer