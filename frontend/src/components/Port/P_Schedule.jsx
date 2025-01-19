import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { Await, useNavigate } from 'react-router-dom';
import { setSelectedSchedule, updateScheduleState } from '../redux/scheduleSlice';
import { Button } from '../ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const P_Schedule = ({ schedule }) => {
  const [click, setClick] = useState(false);
  const [loading, setLoading] = useState(false);
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
  const scheduleButtonClick = async (e) => {
    e.stopPropagation(); // Prevent event bubblings
    setLoading(true);

    try {
      const res = await axios.put(`http://localhost:8000/api/v1/schedule/Arrive/${schedule._id}`);
      console.log(res)
      dispatch(updateScheduleState({ id: schedule._id, state: "arrived" }));
      toast.success(res.data.message);
    } catch (error) {
      console.error("Error updating schedule state:", error);
      toast.error("Failed to update schedule state.");
    } finally {
      setLoading(false);
    }
  };

  const ArriveButtonClick = async (e) => {
    e.stopPropagation(); // Prevent event bubblings
    setLoading(true);

    try {
      const res = await axios.put(`http://localhost:8000/api/v1/schedule/Docked/${schedule._id}`);
      console.log(res)
      dispatch(updateScheduleState({ id: schedule._id, state: "docked" }));
      toast.success(res.data.message);
    } catch (error) {
      console.error("Error updating schedule state:", error);
      toast.error("Failed to update schedule state.");
    } finally {
      setLoading(false);
    }
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
        {schedule.state == "scheduled" &&
          <div className="flex flex-col text-sm font-medium text-blue-600">
            <Button onClick={scheduleButtonClick} disabled={loading}>
              {loading ? <Loader2 className='animate-spin' /> : "Arrive"}
            </Button>
          </div>
        }
        {schedule.state == "arrived" &&
          <div className="flex flex-col text-sm font-medium text-blue-600">
            <Button onClick={ArriveButtonClick} disabled={loading}>
              {loading ? <Loader2 className='animate-spin' /> : "Dock"}
            </Button>
          </div>
        }
      </div>
    </div>
  );
}

export default P_Schedule;
