import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import useGetAllPort from '../hooks/useGetAllPort';
import P_Port from './P_Port';

const P_PortList = () => {
    useGetAllPort();
    const {  portinfo } = useSelector(store => store.port)
    return (
        <div className='flex'>
            <div className='flex-1 ml-[16%] p-4'>
                <h1 className=' font-bold text-3xl py-8'>LIST OF PORTS</h1>
                <hr />
                {
                    portinfo?.map((port, index) => {
                        return (
                            <>
                                <P_Port key={index} port={port}  />
                            </>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default P_PortList