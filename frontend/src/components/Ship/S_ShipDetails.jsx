import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { ArrowBigLeftIcon } from 'lucide-react';
import { toast } from 'sonner';
import { setSelectedShip, setShipinfo } from '../redux/shipSlice';
import shipImage from '../../assets/ship.jpg'; // Replace with your ship image path
import axios from 'axios';

const P_ShipDetails = () => {
  const { selectedShip, shipinfo } = useSelector((state) => state.ship);
  const [confirmDelete, setConfirmDelete] = useState(false);
    const { userinfo } = useSelector(state => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/ship/${userinfo._id}/${selectedShip._id}/deleteShip`, {
        withCredentials: true,
      });

      const updatedShipList = shipinfo.filter(ship => ship._id !== selectedShip._id);

      dispatch(setShipinfo(updatedShipList));
      dispatch(setSelectedShip(null));

      toast.success('Ship deleted successfully');
      navigate(-1);
    } catch (error) {
      console.error("Delete ship error:", error);
      toast.error(
        error?.response?.data?.message || 'Failed to delete ship'
      );
    }
  };


  if (!selectedShip) return <p className="text-center text-lg">No Ship Selected</p>;

  return (
    <div className="flex">
      <div className="ml-[16%] flex-1 p-4">
        <Button
          variant="outline"
          className="fixed bg-gray-200 rounded-full text-white hover:bg-gray-400"
          onClick={() => navigate(-1)}
        >
          <ArrowBigLeftIcon />
        </Button>
        <div className="min-h-screen flex justify-center items-center">
          <div className="w-[600px] shadow-2xl border bg-white rounded-lg overflow-hidden">
            <div className="relative">
              <img
                src={shipImage}
                alt={`${selectedShip.shipName}`}
                className="w-full h-64 object-cover"
              />
              <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white w-full text-center p-3">
                <h2 className="text-xl font-bold">{selectedShip.shipName}</h2>
              </div>
            </div>
            <div className="p-6 space-y-3 text-gray-800">
              <div className="flex justify-between">
                <span className="font-semibold">Ship ID:</span>
                <span>{selectedShip._id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Owner:</span>
                <span>{selectedShip.ownerId}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Type:</span>
                <span>{selectedShip.shipType}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Capacity:</span>
                <span>{selectedShip.capacity} tons</span>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end pt-4">
                <Button
                  variant="outline"
                  className="bg-red-500 text-white hover:bg-red-600"
                  onClick={() => setConfirmDelete(true)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[330px] space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Delete this ship?
            </h2>
            <p className="text-sm text-gray-600">
              This action is permanent and will remove the ship record.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                onClick={() => setConfirmDelete(false)}
                className="bg-gray-400 text-white hover:bg-gray-500"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default P_ShipDetails;
