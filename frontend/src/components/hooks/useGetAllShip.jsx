import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setShipinfo } from '../redux/shipSlice';

const useGetAllShip = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllShips = async () => {
            try {
                const res =await axios.get(" http://localhost:8000/api/v1/ship/getAllShip", { withCredentials: true })
                console.log(res);
                if (res.data.success) {
                    dispatch(setShipinfo(res.data.ships))
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllShips();
    }, [])
}

export default useGetAllShip