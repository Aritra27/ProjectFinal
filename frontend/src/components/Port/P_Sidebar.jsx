import axios from 'axios'
import { CalendarFold, CalendarPlus, Home, List, Anchor, LogOut } from 'lucide-react'
import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { setUserinfo } from '../redux/userSlice'

const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Anchor />, text: "Port Register" },
    { icon: <List />, text: "Portlist" },
    { icon: <CalendarPlus />, text: "Schedule" },
    { icon: <CalendarFold />, text: "List of Schedule" },
    { icon: <LogOut/>, text: "logout" },
]

const P_Sidebar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const logoutHandler= async()=>{
        const res = await axios.get('http://localhost:8000/api/v1/user/logout',{withCredentials:true});
        if(res.data.success)
        {
            toast.success(res.data.message);
            dispatch(setUserinfo(""))
        }
        navigate("/login")
    }
    const sidebarHandler=(textType)=>{
        if(textType=="logout") logoutHandler();
    }
    return (
        <div className='fixed top-0 left-0 z-10 h-screen w-[16%]  border  px-4  border-gray-300'>
            <div className='flex flex-col '>
                <h1 className='font-bold my-5 text-center'>LOGO</h1>
                {
                    sidebarItems.map((item, index) => {
                        return (
                            <div key={index}  onClick={()=>sidebarHandler(item.text)} className='flex flex-row items-center gap-3 relative
                                hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3'>
                                {item.icon}
                                <span>{item.text}</span>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}


export default P_Sidebar