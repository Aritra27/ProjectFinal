import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Signup from './components/Signup'
import Login from './components/Login'
import ChatPage from './components/chat/ChatPage'
import ShipLayout from './components/ShipLayout'
import S_Home from './components/Ship/S_Home'
import PortLayout from './components/PortLayout'
import P_Home from './components/Port/P_Home'
import S_profile from './components/Ship/S_profile'
import S_ShipList from './components/Ship/S_ShipList'
import P_profile from './components/Port/P_profile'
import P_PortList from './components/Port/P_PortList'
import P_PortDetails from './components/Port/P_PortDetails'
import S_ShipDetails from './components/Ship/S_ShipDetails'
import P_ScheduleList from './components/Port/P_ScheduleList'
import P_PortScheduleDetails from './components/Port/P_PortScheduleDetails'
import S_ShipScheduleDetails from './components/Ship/S_ShipScheduleDetails'
import S_ScheduleList from './components/Ship/S_ScheduleList'
import { useDispatch, useSelector } from 'react-redux'
import { setOnlineUsers } from './components/redux/chatSlice'
import { useEffect } from 'react'
import { setSocket } from './components/redux/socketSlice'
import { io } from 'socket.io-client'

const browserRouter = createBrowserRouter([
  {
    path: "/shiphome",
    element: <ShipLayout />,
    children: [
      {
        path: "",
        element: <S_Home />,
      },
      {
        path: "profile",
        element: <S_profile />,
      },
      {
        path: "shipList",
        element: <S_ShipList />,
      },
      {
        path: "shipDetails",
        element: <S_ShipDetails />,
      },
      {
        path: "ShipScheduleDetails",
        element: <S_ShipScheduleDetails />,
      },
      {
        path: "ShipSchedule",
        element: <S_ScheduleList />,
      }
    ]
  },
  {
    path: "/porthome",
    element: <PortLayout />,
    children: [
      {
        path: "",
        element: <P_Home />,
      },
      {
        path: "profile",
        element: <P_profile />,
      },
      {
        path: "portList",
        element: <P_PortList />,
      },
      {
        path: "portDetails",
        element: <P_PortDetails />,
      },
      {
        path: "portScheduleDetails",
        element: <P_PortScheduleDetails />,
      },
      {
        path: "portSchedule",
        element: <P_ScheduleList />,
      }
    ]
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/",
    element: <Login />,
  },
  {
    path: '/chat',
    element: <ChatPage />
  },
  {
    path: '*',
    element: <h1>ERROR</h1>
  }
])

function App() {
  const { userinfo } = useSelector(store => store.user);
  const { socket } = useSelector(store => store.socketio)
  const dispatch = useDispatch();
  useEffect(() => {
    if (userinfo) {
      const socketio = io(`http://localhost:8000`, {
        query: {
          userId: userinfo?._id
        },
        transports: ['websocket']
      });
      dispatch(setSocket(socketio));

      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      })

      socketio.on('notification', (notification) => {
        console.log('Notification received:', notification); // Debugging
        dispatch(setLikeNotification(notification));
      });


      return () => {
        socketio.close();
        dispatch(setSocket(null))
      }
    } else if (socket) {
      socket?.close();
      dispatch(setSocket(null))
    }
  }, [userinfo, dispatch])
  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  )
}

export default App
