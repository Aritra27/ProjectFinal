import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import portImage from '../../assets/port.jpg'; // Replace with a suitable image for the port
import { useSelector } from 'react-redux';
import { ArrowBigLeftIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const P_PortDetails = () => {
  const { selectedPort } = useSelector(store => store.port);
  const navigate = useNavigate();

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
                alt={`${selectedPort?.portId}`}
                className="w-full h-64 object-cover"
              />
              {/* Overlay Name */}
              <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white w-full text-center p-3">
                <CardTitle className="text-xl font-bold">{selectedPort?.portId}</CardTitle>
              </div>
            </div>
            {/* Content Section */}
            <CardContent className="p-6 flex flex-row md:flex-row gap-6">
              {/* Details */}
              <div className="flex-1 space-y-4 text-gray-800">
                <div className="flex justify-between">
                  <span className="font-semibold">Owner ID:</span>
                  <span>{selectedPort?.ownerId || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Max Berths:</span>
                  <span>{selectedPort?.max_berth}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Available Berths:</span>
                  <span>{selectedPort?.available_berth || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Country:</span>
                  <span>{selectedPort?.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Cost per Time:</span>
                  <span>${selectedPort?.cost_per_time}</span>
                </div>
                <div className="flex flex-col space-y-2">
                  <span className="font-semibold">Time Taken Per Content:</span>
                  <div className="pl-4">
                    <div className="flex justify-between">
                      <span>Food:</span>
                      <span>{selectedPort?.timeTakenPerContent?.food || "N/A"} hrs</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Material:</span>
                      <span>{selectedPort?.timeTakenPerContent?.material || "N/A"} hrs</span>
                    </div>
                  </div>
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

export default P_PortDetails;
