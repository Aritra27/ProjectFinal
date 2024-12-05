import React from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSelectedShip } from '../redux/shipSlice';

const S_Ship = ({ship ,key}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ShipDetailsManagement = (ship) => {
    console.log("clicked");
    dispatch(setSelectedShip(ship));
    navigate("/shiphome/ShipDetails")
  }
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 mb-4 flex justify-between items-center hover:bg-gray-600 cursor-pointer " onClick={()=>ShipDetailsManagement(ship)}>
      <div className="flex flex-col">
        <span className="font-bold text-lg">{ship.shipName}</span>
        <span className="text-sm text-gray-500">{ship.shipType}</span>
      </div>
      <div className="text-sm font-medium text-blue-600">
        {ship.shipReg}
      </div>
    </div>
  );
}

export default S_Ship