import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPortinfo } from '../redux/portSlice';


const useGetAllPort = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllPorts = async () => {
            try {
                const res = await axios.get(" http://localhost:8000/api/v1/port/getAllPort", { withCredentials: true })
                console.log(res);
                if (res.data.success) {
                    dispatch(setPortinfo(res.data.ports))
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllPorts();
    }, [])
}

export default useGetAllPort