import React, { useEffect, useState } from 'react'
import useGetSuggestedUser from '../hooks/useGetSuggestedUser'
import logo from '../../assets/logo.png';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from 'axios';
import { useSelector } from 'react-redux';


const P_Home = () => {
  const { userinfo } = useSelector(store => store.user)
  useGetSuggestedUser();
  const [dashboard, setDashboard] = useState(null);
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/v1/port/portdashboard/${userinfo._id}`, {
          withCredentials: true,
        });
        setDashboard(res.data);
      } catch (error) {
        console.error('Error fetching dashboard:', error);
      }
    };
    fetchDashboard();
  }, []);
  return (
    <div className='flex'>
      <div className='flex-1 ml-[16%] p-4'>
        <div className="min-h-screen bg-muted p-6">
          {/* Logo */}
          <div className="flex justify-center my-4">
            <img src={logo} alt="CargoConnect Logo" className="w-32 h-auto" />
          </div>

          <h1 className="text-3xl font-bold text-center mb-8">Port Owner Dashboard</h1>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Total Ships Handled</CardTitle>
                <CardDescription>This month</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-center">
                  {dashboard?.totalShips ?? '...'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Arrivals</CardTitle>
                <CardDescription>Next 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-center">
                  {dashboard?.upcomingArrivals?.length ?? '...'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Registered Docks</CardTitle>
                <CardDescription>Active</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-center">
                  {dashboard?.dockCount ?? '...'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Average Ship Size</CardTitle>
                <CardDescription>In tons</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-center">
                  {dashboard?.avgShipSize ?? '...'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Bar Chart for Traffic */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Ship Traffic Trend</CardTitle>
              <CardDescription>Number of ships docked by date</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboard?.trafficData || []}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="ships" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Upcoming Ships List */}
          <Card>
            <CardHeader>
              <CardTitle>Incoming Ships</CardTitle>
              <CardDescription>Confirmed arrivals this week</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {dashboard?.upcomingArrivals?.map((ship, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border bg-background"
                >
                  <p className="text-sm text-muted-foreground">🚢 <span className="font-medium">{ship.name}</span></p>
                  <p className="text-base">
                    Arrival: <span className="font-semibold">{ship.arrival}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">Cargo: {ship.cargo}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default P_Home