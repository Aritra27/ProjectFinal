import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setLoading, setShipinfo } from '../redux/shipSlice';

const useGetAllShip = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllShips = async () => {
            dispatch(setLoading(true))
            try {
                const res =await axios.get(" http://localhost:8000/api/v1/ship/getAllShip", { withCredentials: true })
                if (res.data.success) {
                    dispatch(setShipinfo(res.data.ships))
                }
            } catch (error) {
                console.log(error);
            }
            finally{
                dispatch(setLoading(false))
            }
        }
        fetchAllShips();
    }, [])
}

export default useGetAllShip