import React from 'react'
import { Outlet } from 'react-router-dom'
import P_Sidebar from './Port/P_Sidebar'


const ShipLayout = () => {
  return (
    <>
    <P_Sidebar/>
    <Outlet/>
    </>
  )
}

export default ShipLayout