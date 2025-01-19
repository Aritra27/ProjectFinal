import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setLoading, setPortinfo } from '../redux/portSlice';


const useGetAllPort = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllPorts = async () => {
            dispatch(setLoading(true))
            try {
                const res = await axios.get(" http://localhost:8000/api/v1/port/getAllPort", { withCredentials: true })
                console.log(res);
                if (res.data.success) {
                    dispatch(setPortinfo(res.data.ports))
                }
            } catch (error) {
                console.log(error);
            }
            finally{
                dispatch(setLoading(false))
            }
        }
        fetchAllPorts();
    }, [])
}

export default useGetAllPort