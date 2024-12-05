import React from 'react'
import useGetAllShip from '../hooks/useGetAllShip'
import { useDispatch, useSelector } from 'react-redux';
import S_Ship from './S_Ship';
import { setSelectedShip } from '../redux/shipSlice';
import { useNavigate } from 'react-router-dom';

const S_ShipList = () => {
  useGetAllShip();
  const { shipinfo } = useSelector(store => store.ship)
  console.log(shipinfo)

  return (
    <div className='flex'>
      <div className='flex-1 md:ml-[16%]  ml-[1%] p-4'>
        <h1 className=' font-bold text-3xl py-8 md:text-left text-center'>LIST OF SHIPS</h1>
        <hr />
        {
          shipinfo?.map((ship, index) => {
            return (
              <>
                <S_Ship key={index} ship={ship} />
              </>
            )
          })
        }
      </div>
    </div>
  )
}

export default S_ShipList