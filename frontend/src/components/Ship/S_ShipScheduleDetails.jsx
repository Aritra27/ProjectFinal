import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import portImage from '../../assets/port.jpg'; // Replace with a suitable image for the port
import { useSelector } from 'react-redux';
import { ArrowBigLeftIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const S_ShipScheduleDetails = () => {
  const { selectedSchedule } = useSelector(store => store.schedule);
  const navigate = useNavigate();
  const arrivalDate = new Date(selectedSchedule?.arrival_time);
  const departureDate = new Date(selectedSchedule?.departure_time);

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

  return (
    <div className="flex">
      <div className="ml-[16%] flex-1 p-4">
        <Button
          variant="outline"
          className=" fixed bg-gray-200  rounded-full text-white hover:bg-gray-400"
          onClick={() => navigate(-1)}
        >
          <ArrowBigLeftIcon />
        </Button>
        <div className="min-h-screen flex justify-center items-center">
          <Card className="w-[600px] shadow-2xl border border-gray-200 bg-white rounded-lg overflow-hidden">
            {/* Image Section */}
            <div className="relative">
              <img
                src={portImage}
                alt={`${selectedSchedule?.shipId}`}
                className="w-full h-64 object-cover"
              />
              {/* Overlay Name */}
              <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white w-full text-center p-3">
                <CardTitle className="text-xl font-bold">{selectedSchedule?.shipId}</CardTitle>
              </div>
            </div>
            {/* Content Section */}
            <CardContent className="p-6 flex flex-row md:flex-row gap-6">
              {/* Details */}
              <div className="flex-1 space-y-4 text-gray-800">
                <div className="flex justify-between">
                  <span className="font-semibold">Owner ID:</span>
                  <span>{selectedSchedule?.shipOwnerId || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Priority:</span>
                  <span>{selectedSchedule?.priority}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Content Type:</span>
                  <span>{selectedSchedule?.content_type || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Arrival Time:</span>
                  <span>{formattedArrivalTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Departure Time:</span>
                  <span>{formattedDepartureTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Berth Id</span>
                  <span>{selectedSchedule?.berthId || "N/A"}</span>
                </div>
                <div className="flex  items-end justify-between space-y-4">
                <Button
                  variant="outline"
                  className="bg-blue-500 text-white hover:bg-blue-600 w-24"
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  className="bg-red-500 text-white hover:bg-red-600 w-24"
                >
                  Delete
                </Button>
              </div>
              </div>
              {/* Buttons */}
              
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default S_ShipScheduleDetails;
