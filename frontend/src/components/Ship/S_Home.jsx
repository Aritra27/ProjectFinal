import React, { useEffect, useState } from 'react';
import useGetSuggestedUser from '../hooks/useGetSuggestedUser';
import logo from '../../assets/logo.png';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { useSelector } from 'react-redux';

const S_Home = () => {
  useGetSuggestedUser();
  const { userinfo } = useSelector(state => state.user);

  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/v1/ship/shipdashboard/${userinfo._id}`, {
          withCredentials: true
        });
        setDashboard(res.data);
      } catch (err) {
        console.error("Error loading dashboard", err);
      }
    };
    fetchDashboard();
  }, [userinfo._id]);

  return (
    <div className='flex'>
      <div className='flex-1 ml-[16%] p-4'>
        <div className="min-h-screen bg-gray-100 p-6">
          {/* Logo */}
          <div className="flex justify-center my-4">
            <img src={logo} alt="CargoConnect Logo" className="w-32 h-auto" />
          </div>

          <h1 className="text-2xl font-bold text-center mb-6">Ship Owner Dashboard</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader><CardTitle>Total Ships</CardTitle></CardHeader>
              <CardContent className="text-2xl font-semibold text-center">
                {dashboard?.totalShips ?? '...'}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Scheduled Trips</CardTitle></CardHeader>
              <CardContent className="text-2xl font-semibold text-center">
                {dashboard?.scheduledTrips ?? '...'}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Upcoming Trips</CardTitle></CardHeader>
              <CardContent className="text-2xl font-semibold text-center">
                {dashboard?.upcomingTrips ?? '...'}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Registered Ports</CardTitle></CardHeader>
              <CardContent className="text-2xl font-semibold text-center">
                {dashboard?.registeredPorts ?? '...'}
              </CardContent>
            </Card>
          </div>

          {/* Chart */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-4">Trips per Port</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboard?.tripsPerPort || []}>
                <XAxis dataKey="port" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="trips" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Upcoming Trips */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Upcoming Trips</h2>
            <ul className="space-y-3">
              {dashboard?.upcomingList?.map((trip, i) => (
                <li key={i} className="bg-white p-4 rounded-lg shadow-sm">
                  🚢 {trip.ship} - Port: {trip.port} - Arrival: {new Date(trip.arrival).toLocaleDateString()}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default S_Home;
