import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSelectedSchedule, updateScheduleState } from '../redux/scheduleSlice';
import { Button } from '../ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const P_Schedule = ({ schedule }) => {
  const [loadingAction, setLoadingAction] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const arrivalDate = new Date(schedule?.arrival_time);
  const departureDate = new Date(schedule?.departure_time);

  const formattedArrivalTime = arrivalDate.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  const formattedDepartureTime = departureDate.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  const handleViewDetails = () => {
    dispatch(setSelectedSchedule(schedule));
    navigate("/porthome/portScheduleDetails");
  };

  const handleStateChange = async (e, newState) => {
    e.stopPropagation();
    setLoadingAction(newState);

    try {
      const res = await axios.put(
        `http://localhost:8000/api/v1/schedule/state/${schedule._id}/${newState}`,
        {},                             // No request body, so pass empty object
        { withCredentials: true }      // 👈 IMPORTANT: sends the JWT cookie
      );
      dispatch(updateScheduleState({ id: schedule._id, state: newState }));
      toast.success(res.data.message);
    } catch (error) {
      console.error("Schedule state update failed:", error);
      toast.error("Failed to update schedule state.");
    } finally {
      setLoadingAction('');
    }
  };

  return (
    <div
      className="bg-white shadow-lg rounded-lg p-4 mb-4 hover:bg-gray-100 cursor-pointer"
      onClick={handleViewDetails}
    >
      <div className="flex justify-between items-center">
        {/* Left: Ship Info */}
        <div className="flex flex-col">
          <span className="font-bold text-lg">Ship: {schedule?.shipId?.shipName}</span>
          <span className="text-sm text-gray-500">Priority: {schedule?.priority}</span>
          <span className="text-sm text-gray-500">Berth: {schedule?.berthId?.name}</span>
        </div>

        {/* Middle: Time Info */}
        <div className="flex flex-col text-sm font-medium text-blue-600">
          <span>Arrival: {formattedArrivalTime}</span>
          <span>Departure: {formattedDepartureTime}</span>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex flex-col space-y-2">
          {schedule.state === "scheduled" && (
            <Button
              onClick={(e) => handleStateChange(e, "arrived")}
              disabled={loadingAction === "arrived"}
            >
              {loadingAction === "arrived" ? <Loader2 className="animate-spin" /> : "Arrive"}
            </Button>
          )}

          {schedule.state === "arrived" && (
            <Button
              onClick={(e) => handleStateChange(e, "docked")}
              disabled={loadingAction === "docked"}
            >
              {loadingAction === "docked" ? <Loader2 className="animate-spin" /> : "Dock"}
            </Button>
          )}

          {["scheduled", "arrived"].includes(schedule.state) && (
            <Button
              onClick={(e) => handleStateChange(e, "cancel")}
              className="bg-red-500 hover:bg-red-600 text-white"
              disabled={loadingAction === "cancel"}
            >
              {loadingAction === "cancel" ? <Loader2 className="animate-spin" /> : "Cancel"}
            </Button>
          )}

          {schedule.state === "docked" && (
            <Button
              onClick={(e) => handleStateChange(e, "leave")}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={loadingAction === "leave"}
            >
              {loadingAction === "leave" ? <Loader2 className="animate-spin" /> : "Leave"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default P_Schedule;
