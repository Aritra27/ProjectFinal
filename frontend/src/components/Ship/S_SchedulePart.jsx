import React from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSelectedSchedule } from '../redux/scheduleSlice';

const S_SchedulePart = ({ schedule }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const arrivalDate = new Date(schedule?.arrival_time);
  const departureDate = new Date(schedule?.departure_time);

  // Format the dates and times as desired (e.g., usingtoLocaleString)
  const formattedArrivalTime = arrivalDate.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  const formattedDepartureTime = departureDate.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
  const ScheduleDetailsManagement = (schedule) => {
    dispatch(setSelectedSchedule(schedule));
    navigate("/shiphome/shipScheduleDetails")
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 mb-4 flex justify-between items-center  hover:bg-gray-600 cursor-pointer" onClick={()=>ScheduleDetailsManagement(schedule)}>
      {/* Left Section */}
      <div className="flex flex-col">
        <span className="font-bold text-lg">Port Id: {schedule?.portId}</span>
        <span className="text-sm text-gray-500">Priority: {schedule?.priority}</span>
        <span className="text-sm text-gray-500">Berth Id: {schedule?.berthId}</span>
      </div>
      
      {/* Right Section */}
      <div className="flex flex-col text-sm font-medium text-blue-600">
        <span>Arrival Time: {formattedArrivalTime} hrs</span>
        <span>Departure Time: {formattedDepartureTime} hrs</span>
      </div>
    </div>
  );
}

export default  S_SchedulePart;
