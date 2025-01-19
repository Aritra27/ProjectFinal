import { createSlice } from '@reduxjs/toolkit'

const initialState={
  shipinfo:[],
  selectedShip:null,
  loading:false
}

const shipSlice = createSlice({
  name: 'Ship',
initialState,
  reducers: {
    setShipinfo:(state, action)=> {
      state.shipinfo = action.payload
    },
    setSelectedShip:(state, action)=> {
      state.selectedShip = action.payload
    },
    setLoading:(state,action)=>{
      state.loading = action.payload
    },
    resetShipState: () => initialState,
  },
})

export const { setShipinfo,setSelectedShip, resetShipState,setLoading} = shipSlice.actions
export default shipSlice.reducer