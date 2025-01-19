import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import useGetAllPort from '../hooks/useGetAllPort';
import P_Port from './P_Port';
import Lottie from 'lottie-react';
import loadingAnimation from '../../assets/loading.json';

const P_PortList = () => {
    useGetAllPort();
    const { portinfo, loading } = useSelector(store => store.port)
    return (
        <div className='flex'>
            <div className='flex-1 ml-[16%] p-4'>
                <h1 className=' font-bold text-3xl py-8'>LIST OF PORTS</h1>
                <hr />
                {
                    loading ? (
                        <div className='flex justify-center items-center h-64'>
                            <Lottie animationData={loadingAnimation} loop={true} className="w-40 h-40" />
                        </div>
                    ) : (
                        portinfo?.map((port, index) => (
                            <P_Port key={index} port={port} />
                        )
                        )
                    )
                }
            </div>
        </div>
    )
}

export default P_PortList