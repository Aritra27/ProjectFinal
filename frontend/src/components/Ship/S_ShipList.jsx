import React from 'react'
import useGetAllShip from '../hooks/useGetAllShip'
import { useDispatch, useSelector } from 'react-redux';
import S_Ship from './S_Ship';
import loadingAnimation from '../../assets/loading.json';
import { setSelectedShip } from '../redux/shipSlice';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';

const S_ShipList = () => {
  useGetAllShip();
  const { shipinfo, loading } = useSelector(store => store.ship)

  return (
    <div className='flex'>
      <div className='flex-1 md:ml-[16%]  ml-[1%] p-4'>
        <h1 className=' font-bold text-3xl py-8 md:text-left text-center'>LIST OF SHIPS</h1>
        <hr />
        {
          loading ? (
            <div className='flex justify-center items-center h-64'>
              <Lottie animationData={loadingAnimation} loop={true} className="w-40 h-40" />
            </div>
          ) : (
            shipinfo?.map((ship, index) => (
              <S_Ship key={index} ship={ship} />
            ))
          )}
      </div>
    </div>
  )
}

export default S_ShipList