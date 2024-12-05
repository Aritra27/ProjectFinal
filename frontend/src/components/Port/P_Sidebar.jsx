import axios from 'axios'
import { CalendarFold, CalendarPlus, Home, List, Anchor, LogOut, CircleUserRound, MessageCircleCode } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { setUserinfo } from '../redux/userSlice'
import P_PortRegister from './P_PortRegister'
import { setPortinfo, setSelectedPort } from '../redux/portSlice'
import { setScheduleInfo, setSelectedSchedule } from '../redux/scheduleSlice'

const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Anchor />, text: "Port Register" },
    { icon: <List />, text: "Portlist" },
    { icon: <CalendarPlus />, text: "Schedule" },
    { icon: <CalendarFold />, text: "List of Schedule" },
    { icon: <CircleUserRound />, text: "profile" },
    { icon: <LogOut />, text: "logout" },
]

const P_Sidebar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [portRegOpen, setPortRegOpen] = useState(false)
    const logoutHandler = async () => {
        const res = await axios.get('http://localhost:8000/api/v1/user/logout', { withCredentials: true });
        if (res.data.success) {
            toast.success(res.data.message);
            dispatch(setUserinfo(""));
            dispatch(setSelectedPort(""));
            dispatch(setPortinfo([]));
            dispatch(setScheduleInfo([]));
            dispatch(setSelectedSchedule(''));
        }
        navigate("/")
    }
    const sidebarHandler = (textType) => {
        if (textType == "logout") logoutHandler();
        else if (textType == "profile") navigate('profile');
        else if (textType == "Port Register") setPortRegOpen(true);
        else if (textType == "Portlist") navigate('portList');
        else if (textType == "Home") navigate('');
        else if (textType == "List of Schedule") navigate('portSchedule');
    }
    return (
        <>
            <div className='fixed top-0 left-0 z-10 h-screen w-[16%]  border  px-4  border-gray-300'>
                <div className='flex flex-col '>
                    <h1 className='font-bold my-5 text-center'>LOGO</h1>
                    {
                        sidebarItems.map((item, index) => {
                            return (
                                <div key={index} onClick={() => sidebarHandler(item.text)} className='flex flex-row items-center gap-3 relative
                                hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3'>
                                    {item.icon}
                                    <span>{item.text}</span>
                                </div>
                            )
                        })
                    }
                </div>
                <P_PortRegister open={portRegOpen} setOpen={setPortRegOpen} />
            </div>
            <div className='fixed bottom-10 right-10'>
                <MessageCircleCode className=' bg-gray-200 rounded-full p-2 h-10 w-10' />
            </div>
        </>
    )
}


export default P_Sidebar