import React from 'react';
import { useSelector } from 'react-redux';
import useGetAllPortSchedule from '../hooks/useGetAllPortSchedule';
import P_Schedule from './P_Schedule';
import loadingAnimation from '../../assets/loading.json';
import Lottie from 'lottie-react';

const P_ScheduleList = () => {
  useGetAllPortSchedule();

  const { scheduleInfo, loading } = useSelector(store => store.schedule);

  // Separate and sort schedules
  const arrivingSchedules = scheduleInfo
    ?.filter(schedule => schedule.state === 'arrived')
    .sort((a, b) => new Date(a.arrivalTime) - new Date(b.arrivalTime));

  const scheduledSchedules = scheduleInfo
    ?.filter(schedule => schedule.state === 'scheduled')
    .sort((a, b) => new Date(a.arrivalTime) - new Date(b.arrivalTime));

  const dockedSchedules = scheduleInfo
    ?.filter(schedule => schedule.state === 'docked')
    .sort((a, b) => new Date(a.arrivalTime) - new Date(b.arrivalTime));

  return (
    <div className="flex">
      <div className="flex-1 ml-[16%] p-4">
        <h1 className="font-bold text-3xl py-8">LIST OF SCHEDULE</h1>
        <hr />

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Lottie animationData={loadingAnimation} loop={true} className="w-40 h-40" />
          </div>
        ) : (
          <>
            {/* Arriving schedules */}
            <h2 className="text-xl font-semibold py-4">Arrive</h2>
            {arrivingSchedules?.map((schedule, index) => (
              <P_Schedule key={`arrive-${index}`} schedule={schedule} />
            ))}

            <hr className="my-4 border-t-2" />

            {/* Other schedules */}
            <h2 className="text-xl font-semibold py-4">scheduled</h2>
            {scheduledSchedules?.map((schedule, index) => (
              <P_Schedule key={`other-${index}`} schedule={schedule} />
            ))}

            <hr className="my-4 border-t-2" />

            {/* Other schedules */}
            <h2 className="text-xl font-semibold py-4">Docked</h2>
            {dockedSchedules?.map((schedule, index) => (
              <P_Schedule key={`other-${index}`} schedule={schedule} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default P_ScheduleList;
