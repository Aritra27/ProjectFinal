import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Signup from './components/Signup'
import Login from './components/Login'
import ShipLayout from './components/ShipLayout'
import S_Home from './components/Ship/S_Home'
import PortLayout from './components/PortLayout'
import P_Home from './components/Port/P_Home'
import S_profile from './components/Ship/S_profile'
import S_ShipList from './components/Ship/S_ShipList'

const browserRouter = createBrowserRouter([
  {
  path: "/shiphome",
  element: <ShipLayout />,
  children: [
    {
      path: "",
      element: <S_profile/>,
    },
    {
      path: "shipList",
      element: <S_ShipList/>,
    }
  ]},  
  {
    path: "/porthome",
    element: <PortLayout />,
    children: [
      {
        path: "",
        element: <P_Home />,
      }
    ]},
  {
    path: "/signup",
      element: <Signup/>,
  },
  {
    path: "/login",
      element: <Login/>,
  },
])

function App() {

  return (
    <>
      <RouterProvider router={browserRouter}/>
    </>
  )
}

export default App
