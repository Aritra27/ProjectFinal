import { createSlice } from '@reduxjs/toolkit'

const scheduleSlice = createSlice({
  name: 'Schedule',
  initialState:{
    scheduleInfo:[],
    selectedSchedule :null
  },
  reducers: {
    setScheduleInfo:(state, action)=> {
      state.scheduleInfo = action.payload
    },
    setSelectedSchedule:(state, action)=> {
      state.selectedSchedule = action.payload
    },
  },
})

export const {  setScheduleInfo , setSelectedSchedule} = scheduleSlice.actions
export default scheduleSlice.reducer