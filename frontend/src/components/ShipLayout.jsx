import React from 'react'
import { Outlet } from 'react-router-dom'
import S_Sidebar from './Ship/S_Sidebar'

const ShipLayout = () => {
  return (
    <>
    <S_Sidebar/>
    <Outlet/>
    </>
  )
}

export default ShipLayout