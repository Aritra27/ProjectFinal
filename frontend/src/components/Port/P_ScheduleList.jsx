import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import useGetAllPortSchedule from '../hooks/useGetAllPortSchedule';
import P_Schedule from './P_Schedule';

const P_ScheduleList = () => {
    useGetAllPortSchedule()
    const {  scheduleInfo } = useSelector(store => store.schedule)
    return (
        <div className='flex'>
            <div className='flex-1 ml-[16%] p-4'>
                <h1 className=' font-bold text-3xl py-8'>LIST OF SCHEDULE</h1>
                <hr />
                {
                    scheduleInfo?.map((schedule, index) => {
                        return (
                            <>
                                <P_Schedule  key ={index} schedule={schedule} />
                            </>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default P_ScheduleList