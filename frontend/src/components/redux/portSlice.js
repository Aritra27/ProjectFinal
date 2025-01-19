import { createSlice } from '@reduxjs/toolkit'

 const initialState={
  portinfo:[],
  selectedPort :null,
  loading:false
}

const portSlice = createSlice({
  name: 'Port',
  initialState,
  reducers: {
    setPortinfo:(state, action)=> {
      state.portinfo = action.payload
    },
    setSelectedPort:(state, action)=> {
      state.selectedPort = action.payload
    },
    setLoading:(state,action)=>{
      state.loading = action.payload
    },
    resetPortState: () => initialState,
  },
})

export const {  setPortinfo , setSelectedPort , resetPortState,setLoading} = portSlice.actions
export default portSlice.reducer