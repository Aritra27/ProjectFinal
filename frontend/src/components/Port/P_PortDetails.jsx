import React, { useState } from 'react';
import { Card, CardContent, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import portImage from '../../assets/port.jpg';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowBigLeftIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setSelectedPort, setPortinfo } from '../redux/portSlice';
import { toast } from 'sonner'


const P_PortDetails = () => {
  const { selectedPort } = useSelector((store) => store.port);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const portinfo = useSelector((state) => state.port.portinfo);
  const [formData, setFormData] = useState({
    max_berth: selectedPort?.max_berth || '',
    cost_per_time: selectedPort?.cost_per_time || '',
    timeTakenPerContent: {
      food: selectedPort?.timeTakenPerContent?.food || '',
      material: selectedPort?.timeTakenPerContent?.material || '',
    },
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'food' || name === 'material') {
      setFormData((prev) => ({
        ...prev,
        timeTakenPerContent: {
          ...prev.timeTakenPerContent,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.put(`http://localhost:8000/api/v1/port/editport/${selectedPort._id}`, formData);
      dispatch(setSelectedPort(res.data.port));
      setIsEditing(false);
      toast.success('Port updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Error updating port');
    }
  };
  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:8000/api/v1/port/deleteport/${selectedPort._id}`
      );

      const updatedPortList = portinfo.filter(p => p._id !== selectedPort._id);

      dispatch(setPortinfo(updatedPortList));


      // 2️⃣  clear selection
      dispatch(setSelectedPort(null));

      toast.success('Port deleted successfully!');
      navigate(-1);       // go back to the previous page
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || 'Failed to delete port'
      );
    }
  };

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
          <Card className="w-[600px] shadow-2xl border border-gray-200 bg-white rounded-lg overflow-hidden">
            {/* Image Section */}
            <div className="relative">
              <img
                src={portImage}
                alt={`${selectedPort?.portId}`}
                className="w-full h-64 object-cover"
              />
              <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white w-full text-center p-3">
                <CardTitle className="text-xl font-bold">
                  {selectedPort?.portId}
                </CardTitle>
              </div>
            </div>

            {/* Content Section */}
            <CardContent className="p-6 flex flex-col space-y-4 text-gray-800">
              <div className="flex justify-between">
                <span className="font-semibold">Owner ID:</span>
                <span>{selectedPort?.ownerId || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Max Berths:</span>
                <span>{selectedPort?.max_berth}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Available Berths:</span>
                <span>{selectedPort?.available_berth || 'N/A'}</span>
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
                    <span>{selectedPort?.timeTakenPerContent?.food || 'N/A'} hrs</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Material:</span>
                    <span>{selectedPort?.timeTakenPerContent?.material || 'N/A'} hrs</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4">
                <Button
                  variant="outline"
                  className="bg-blue-500 text-white hover:bg-blue-600 w-24"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  className="bg-red-500 text-white hover:bg-red-600 w-24"
                  onClick={() => setConfirmDelete(true)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>


      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[330px] space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Delete this port?
            </h2>
            <p className="text-sm text-gray-600">
              This action is permanent and will remove all berths that have no active
              ships scheduled.
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


      {/* Modal for Editing */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[400px] space-y-4">
            <h2 className="text-xl font-bold">Edit Port</h2>
            <div>
              <label className="block font-medium">Max Berth</label>
              <input
                type="number"
                name="max_berth"
                value={formData.max_berth}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />
            </div>
            <div>
              <label className="block font-medium">Cost per Time</label>
              <input
                type="number"
                name="cost_per_time"
                value={formData.cost_per_time}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />
            </div>
            <div>
              <label className="block font-medium">Time for Food</label>
              <input
                type="number"
                name="food"
                value={formData.timeTakenPerContent.food}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />
            </div>
            <div>
              <label className="block font-medium">Time for Material</label>
              <input
                type="number"
                name="material"
                value={formData.timeTakenPerContent.material}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />
            </div>
            <div className="flex justify-end gap-4">
              <Button
                onClick={() => setIsEditing(false)}
                className="bg-gray-400 text-white hover:bg-gray-500"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-blue-500 text-white hover:bg-blue-600"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default P_PortDetails;
