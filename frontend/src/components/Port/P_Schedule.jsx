import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSelectedSchedule } from '../redux/scheduleSlice';
import { Button } from '../ui/button';

const P_Schedule = ({ schedule }) => {
  const [click, setClick] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const arrivalDate = new Date(schedule?.arrival_time);
  const departureDate = new Date(schedule?.departure_time);

  // Format the dates and times as desired (e.g., usingtoLocaleString)
  const formattedArrivalTime = arrivalDate.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long', // Use 'short' for abbreviated month names or 'numeric' for numbers
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true, // Use false for 24-hour format
  });

  const formattedDepartureTime = departureDate.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long', // Use 'short' for abbreviated month names or 'numeric' for numbers
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
  const ScheduleDetailsManagement = (schedule) => {
    dispatch(setSelectedSchedule(schedule));
    navigate("/porthome/portScheduleDetails")
  }
  const handleButtonClick = (e) => {
    e.stopPropagation(); // Prevent event bubblings
    setClick(true);

  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 mb-4 flex  flex-col   hover:bg-gray-600 cursor-pointer" onClick={() => ScheduleDetailsManagement(schedule)}>
      {/* Left Section */}
      <div className='flex justify-between items-center'>
        <div className="flex flex-col">
          <span className="font-bold text-lg">Ship Id: {schedule?.shipId}</span>
          <span className="text-sm text-gray-500">Priority: {schedule?.priority}</span>
          <span className="text-sm text-gray-500">Berth Id: {schedule?.berthId}</span>
        </div>

        {/* Right Section */}
        <div className="flex flex-col text-sm font-medium text-blue-600">
          <span>Arrival Time: {formattedArrivalTime} hrs</span>
          <span>Departure Time: {formattedDepartureTime} hrs</span>
        </div>
        <div className="flex flex-col text-sm font-medium text-blue-600">
          <Button onClick={handleButtonClick}>arrive</Button>
        </div>
      </div>
      {click &&
        <div>
          <h1>you are ready to go</h1>
        </div>
      }

    </div>
  );
}

export default P_Schedule;
