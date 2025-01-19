import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import useGetAllShipSchedule from '../hooks/useGetAllShipSchedule';
import S_SchedulePart from './S_SchedulePart';
import loadingAnimation from '../../assets/loading.json';
import Lottie from 'lottie-react';

const S_ScheduleList = () => {
    useGetAllShipSchedule()
    const {  scheduleInfo, loading } = useSelector(store => store.schedule)
    return (
        <div className='flex'>
            <div className='flex-1 ml-[1%] md:ml-[16%] p-4'>
                <h1 className=' font-bold text-3xl py-8  md:text-left text-center'>LIST OF SCHEDULE</h1>
                <hr />
                {loading ? (
                    <div className='flex justify-center items-center h-64'>
                        <Lottie animationData={loadingAnimation} loop={true} className="w-40 h-40" />
                    </div>
                ) : (
                    scheduleInfo?.map((schedule, index) => (
                        <S_SchedulePart  key ={index} schedule={schedule} />
                    ))
                )}
            </div>
        </div>
    )
}

export default S_ScheduleList