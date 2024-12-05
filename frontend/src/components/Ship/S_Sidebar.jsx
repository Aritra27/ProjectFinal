import axios from 'axios';
import { CalendarFold, CalendarPlus, CircleUserRound, Home, List, LogOut, MenuSquare, MessageCircleCode, Ship } from 'lucide-react';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { setUserinfo } from '../redux/userSlice';
import S_ShipRegister from './S_ShipRegister';
import { setSelectedShip, setShipinfo } from '../redux/shipSlice';
import { setPortinfo } from '../redux/portSlice';
import S_Schedule from './S_Schedule';

const sidebarItems = [
  { icon: <Home />, text: 'Home' },
  { icon: <Ship />, text: 'Ship Register' },
  { icon: <List />, text: 'Shiplist' },
  { icon: <CalendarPlus />, text: 'Schedule' },
  { icon: <CalendarFold />, text: 'List of Schedule' },
  { icon: <LogOut />, text: 'logout' },
  { icon: <CircleUserRound />, text: 'profile' },
];

const S_Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [shipRegOpen, setShipRegOpen] = useState(false);
  const [shipScheduleOpen, setShipScheduleOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // State to manage burger menu

  const logoutHandler = async () => {
    const res = await axios.get('http://localhost:8000/api/v1/user/logout', { withCredentials: true });
    if (res.data.success) {
      toast.success(res.data.message);
      dispatch(setUserinfo(''));
      dispatch(setShipinfo([]));
      dispatch(setSelectedShip(''));
      dispatch(setPortinfo([]));
      navigate('/');
    }
  };

  const sidebarHandler = (textType) => {
    setMenuOpen(false); // Close menu on navigation
    if (textType === 'logout') logoutHandler();
    else if (textType === 'Shiplist') navigate('shipList');
    else if (textType === 'profile') navigate('profile');
    else if (textType === 'Home') navigate('');
    else if (textType === 'List of Schedule') navigate('ShipSchedule');
    else if (textType === 'Ship Register') setShipRegOpen(true);
    else if (textType === 'Schedule') setShipScheduleOpen(true);
  };

  return (
    <>
      {/* Burger Menu */}
      <div className="fixed top-5 left-5 z-20 md:hidden">
        <button
          className="bg-gray-200 p-2 rounded-lg shadow-md"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <MenuSquare className="h-6 w-6" />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-10 h-screen w-[50%] md:w-[16%] border px-4 border-gray-300 bg-white md:translate-x-0 md:w-[16%] transform ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col">
          <h1 className="font-bold my-5 text-center">CIRGO CONNECT</h1>
          {sidebarItems.map((item, index) => (
            <div
              key={index}
              onClick={() => sidebarHandler(item.text)}
              className="flex flex-row items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3"
            >
              {item.icon}
              <span >{item.text}</span>
            </div>
          ))}
        </div>
        <S_ShipRegister open={shipRegOpen} setOpen={setShipRegOpen} />
        <S_Schedule open={shipScheduleOpen} setOpen={setShipScheduleOpen} />
      </div>

      {/* Overlay for mobile */}
      {menuOpen && (
        <div
          className="fixed top-0 left-0 z-5 h-screen w-screen bg-black bg-opacity-50 md:hidden"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* Floating Message Icon */}
      <div className="fixed bottom-10 right-10">
        <MessageCircleCode className="bg-gray-200 rounded-full p-2 h-10 w-10" />
      </div>
    </>
  );
};

export default S_Sidebar;
