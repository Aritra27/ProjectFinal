import { createSlice } from '@reduxjs/toolkit'

const shipSlice = createSlice({
  name: 'Ship',
  initialState:{
    shipinfo:[],
    selectedShip:null
  },
  reducers: {
    setShipinfo:(state, action)=> {
      state.shipinfo = action.payload
    },
    setSelectedShip:(state, action)=> {
      state.selectedShip = action.payload
    },
  },
})

export const { setShipinfo,setSelectedShip } = shipSlice.actions
export default shipSlice.reducer