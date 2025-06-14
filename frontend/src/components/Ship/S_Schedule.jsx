import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader } from '../ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import axios from 'axios';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import useGetAllShip from '../hooks/useGetAllShip';
import { AlertTriangle } from 'lucide-react';

const S_Schedule = ({ open, setOpen }) => {
  useGetAllShip()
  const [countries, setCountries] = useState([]);
  const [ports, setPorts] = useState([]); // State for ports
  const [requiredTime, setRequiredTime] = useState("N/A");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const { shipinfo } = useSelector(store => store.ship)
  const [input, setInput] = useState({
    portOwnerId: '',
    country: '',
    portId: '',
    shipId: '',
    content_type: '',
    quantity: '',
    expectedArrival_time: '',
    stayDuration: '',
    arrival_time: '',
    departure_time: '',
    berthId: '',
  });

  const resetForm = () => {
    setInput({
      portOwnerId: '',
      country: '',
      portId: '',
      shipId: '',
      content_type: '',
      quantity: '',
      expectedArrival_time: '',
      stayDuration: '',
      arrival_time: '',
      departure_time: '',
      berthId: '',
    });
    setSlots([]);
    setSelectedSlot('');
    setRequiredTime("N/A");
  };

  // Fetch countries when the component mounts
  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all?fields=name')
      .then(response => {
        const countryList = response.data;
        countryList.sort((a, b) => a.name.common.localeCompare(b.name.common));
        setCountries(countryList);
      })
      .catch(error => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  useEffect(() => {
    if (input.quantity && input.content_type && input.portId) {
      const selectedPort = ports.find((port) => port.portId === input.portId);
      const updatedInput = { ...input, portOwnerId: selectedPort.ownerId }
      setInput(updatedInput)
      const timePerUnit = selectedPort?.timeTakenPerContent[input.content_type];
      const calculatedTime = timePerUnit ? input.quantity * timePerUnit : "error";
      setRequiredTime(calculatedTime);
    }
  }, [input.quantity, input.content_type, input.portId, ports]);

  useEffect(() => {
    const { expectedArrival_time, stayDuration, portId } = input;
    if (expectedArrival_time && stayDuration && portId) {

      if (requiredTime && stayDuration < requiredTime) {
        toast.error("Stay duration cannot exceed the required time.");
        return;
      }
    }
      const fetchData = async () => {
        try {
          const res = await axios.post(
            'http://localhost:8000/api/v1/schedule/findSlots', // Replace with your API endpoint
            {
              expectedArrival_time,
              stayDuration,
              portId,
            },
            { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
          );

          if (res.data.success) {
            setSlots(res.data.slots); // Store response data
            toast.success('Data fetched successfully!');
          } else {
            toast.error(res.data.message || 'Failed to fetch data.');
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          toast.error('Error fetching data from the server.');
        }
      };

      fetchData();
  }, [input.expectedArrival_time, input.stayDuration, input.portId]);

  const fetchPorts = async (country) => {

    try {
      const res = await axios
        .get(`http://localhost:8000/api/v1/port/${country}/getAllPortCountrywise`, { withCredential: true }) // Replace with your API URL
      if (res.data.success) {
        setPorts(res.data.ports)
      }

    } catch (error) {
      console.log(error)
    }


  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const arrivalTime = new Date(input.arrival_time);
    const stayDuration = parseFloat(input.stayDuration);

    // Calculate departure_time dynamically
    const departureTime = new Date(arrivalTime.getTime() + stayDuration * 60 * 60 * 1000);

    // Validate Arrival Time within selected slot
    if (arrivalTime < new Date(selectedSlot.availableFrom)) {
      toast.error("Arrival time must be after the slot's available start time.");
      return;
    }

    if (selectedSlot.availableUntil !== 'rest' && arrivalTime > new Date(selectedSlot.availableUntil)) {
      toast.error("Arrival time must be within the selected slot.");
      return;
    }

    // Validate Departure Time within the selected slot
    if (selectedSlot.availableUntil !== 'rest' && departureTime > new Date(selectedSlot.availableUntil)) {
      toast.error("Departure time must be within the selected slot.");
      return;
    }
    const updatedInput = { ...input, departure_time: departureTime.toISOString(), arrival_time: arrivalTime.toISOString() };
    try {
      const res = await axios.post("http://localhost:8000/api/v1/schedule/createSchedule", updatedInput, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success("Schedule created successfully!");
        resetForm()
        setOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create the schedule.");
    }
  };

  const onChangeHandler = (key, value) => {
    setInput({ ...input, [key]: value });
  };

  const onSlotChange = (value) => {
    const slot = JSON.parse(value);
    setSelectedSlot(slot);
    onChangeHandler('berthId', slot.berthId); // Automatically assign berthId
  };


  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)} >
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <Card>
            <CardHeader>
              <CardTitle>Schedule Request</CardTitle>
              <CardDescription>Fill in the details to schedule a request</CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ maxHeight: '80vh', overflowY: 'scroll' }} >
                <form onSubmit={onSubmitHandler}>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="country">Country</Label>
                      <Select onValueChange={(value) => {
                        onChangeHandler('country', value)
                        fetchPorts(value)
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          {countries?.map((country) => (
                            <SelectItem key={country.cca3} value={country.name.common}>{country.name.common}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="portId">Port</Label>
                      <Select
                        onValueChange={(value) => onChangeHandler('portId', value)}
                        disabled={!input.country}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select port" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          {ports?.map((port) => (
                            <SelectItem key={port.portId} value={port.portId}>{port.portId}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="shipId">Ship</Label>
                      <Select
                        onValueChange={(value) => onChangeHandler('shipId', value)}
                        disabled={!input.country}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select ship" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          {shipinfo?.map((ship) => (
                            <SelectItem key={ship._id} value={ship._id}>{ship.shipName}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="content_type">Content Type</Label>
                      <Select
                        onValueChange={(value) => onChangeHandler('content_type', value)}
                        disabled={!input.country}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Content type" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem key="food" value="food"> food</SelectItem>
                          <SelectItem key="material" value="material">material</SelectItem>

                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="quantity">quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        onChange={(e) => onChangeHandler(e.target.id, e.target.value)}
                        disabled={!input.country}
                      />
                    </div>
                    {
                      input.quantity && input.content_type && input.portId && (
                        <div className="flex font-medium text-red-500  rounded my-3">
                          <AlertTriangle /> Required time: {requiredTime} hours
                        </div>
                      )
                    }

                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="expectedArrival_time">Expected Arrival Time</Label>
                      <Input
                        id="expectedArrival_time"
                        type="datetime-local"
                        onChange={(e) => onChangeHandler(e.target.id, e.target.value)}
                        disabled={!input.country}
                      />
                      {input.stayDuration < requiredTime && (
                        <p className="text-red-500 text-sm">Stay duration cannot less than {requiredTime} hours.</p>
                      )}
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="stayDuration">Stay Duration</Label>
                      <Input
                        id="stayDuration"
                        type="number"
                        onChange={(e) => onChangeHandler(e.target.id, e.target.value)}
                        disabled={!input.country}
                      />
                    </div>
                    {
                      input.portId && input.expectedArrival_time && input.stayDuration && slots.length > 0 && (
                        <div className="flex flex-col space-y-2 my-3">
                          <h4 className="font-semibold text-gray-700">Available Slots:</h4>
                          <Select onValueChange={onSlotChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an available slot" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                              {slots.map((slot, index) => (
                                <SelectItem key={index} value={JSON.stringify(slot)}>
                                  {new Intl.DateTimeFormat('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  }).format(new Date(slot.availableFrom))}{' '}
                                  -{' '}
                                  {slot.availableUntil === 'rest' || slot.availableUntil === 'indefinite'
                                    ? 'Available indefinitely'
                                    : new Intl.DateTimeFormat('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    }).format(new Date(slot.availableUntil))}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )
                    }

                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="arrival_time">Arrival Time</Label>
                      <Input
                        id="arrival_time"
                        type="datetime-local"
                        onChange={(e) => onChangeHandler(e.target.id, e.target.value)}
                        disabled={!selectedSlot}
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Button type="submit" disabled={!input.arrival_time && input.stayDuration < requiredTime}>Submit</Button>
                    </div>
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default S_Schedule;
