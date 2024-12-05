import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import shipimage from '../../assets/ship.jpg';
import { useSelector } from 'react-redux';
import { ArrowBigLeftIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const S_ShipDetails = () => {
  const { selectedShip } = useSelector(store => store.ship)
  const navigate = useNavigate();

  return (
    <div className="flex">
      <div className="ml-[16%] flex-1 p-4">
        <Button
          variant="outline"
          className=" fixed bg-gray-200  rounded-full text-white hover:bg-gray-400 "
          onClick={() => navigate(-1)}
        >
          <ArrowBigLeftIcon />
        </Button>
        <div className="min-h-screen flex justify-center items-center ">
          <Card className="w-[600px] shadow-2xl border border-gray-200 bg-white rounded-lg overflow-hidden">
            {/* Image Section */}
            <div className="relative">
              <img
                src={shipimage}
                alt={`${selectedShip?.shipName}`}
                className="w-full h-64 object-cover"
              />
              {/* Overlay Name */}
              <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white w-full text-center p-3">
                <CardTitle className="text-xl font-bold">{selectedShip?.shipName}</CardTitle>
              </div>
            </div>
            {/* Content Section */}
            <CardContent className="p-6 flex flex-row md:flex-row gap-6">
              {/* Details */}
              <div className="flex-1 space-y-4 text-gray-800">
                <div className="flex justify-between">
                  <span className="font-semibold">Owner ID:</span>
                  <span>{selectedShip?.ownerId || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Registration Number:</span>
                  <span>{selectedShip?.shipReg}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Country:</span>
                  <span>{selectedShip?.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Type:</span>
                  <span>{selectedShip?.shipType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Scheduled:</span>
                  <span>{selectedShip?.isSchedule ? "Yes" : "No"}</span>
                </div>

                <div className="flex flex-row items-end justify-between space-y-4">
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

export default S_ShipDetails;
