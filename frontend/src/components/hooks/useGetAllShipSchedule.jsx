import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setLoading, setScheduleInfo } from '../redux/scheduleSlice';


const useGetAllShipSchedule = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllSchedules = async () => {
            dispatch(setLoading(true))
            try {
                const res = await axios.get(" http://localhost:8000/api/v1/schedule/ShipSchedules", { withCredentials: true })
                if (res.data?.success) {
                    dispatch(setScheduleInfo(res.data.schedules))
                }
            } catch (error) {
                console.log(error);
            }
            finally{
                dispatch(setLoading(false))
            }
        }
        fetchAllSchedules();
    }, [dispatch])
}

export default useGetAllShipSchedule