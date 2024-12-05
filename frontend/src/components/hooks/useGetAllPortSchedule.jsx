import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setScheduleInfo } from '../redux/scheduleSlice';


const useGetAllPortSchedule = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllSchedules = async () => {
            try {
                const res = await axios.get(" http://localhost:8000/api/v1/schedule/PortSchedules", { withCredentials: true })
                if (res.data.success) {
                    dispatch(setScheduleInfo(res.data.schedules))
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllSchedules();
    }, [])
}

export default useGetAllPortSchedule