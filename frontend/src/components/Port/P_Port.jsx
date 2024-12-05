import React from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSelectedPort } from '../redux/portSlice';

const P_Port = ({ port }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const PortDetailsManagement = (port) => {
    console.log("clicked");
    dispatch(setSelectedPort(port));
    navigate("/porthome/portDetails")
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 mb-4 flex justify-between items-center  hover:bg-gray-600 cursor-pointer" onClick={()=>PortDetailsManagement(port)}>
      {/* Left Section */}
      <div className="flex flex-col">
        <span className="font-bold text-lg">Port ID: {port.portId}</span>
        <span className="text-sm text-gray-500">Max Berths: {port.max_berth}</span>
        <span className="text-sm text-gray-500">Available Berths: {port.available_berth}</span>
      </div>
      
      {/* Right Section */}
      <div className="flex flex-col text-sm font-medium text-blue-600">
        <span>Food Content Time: {port.timeTakenPerContent.food} hrs</span>
        <span>Material Content Time: {port.timeTakenPerContent.material} hrs</span>
      </div>
    </div>
  );
}

export default P_Port;
