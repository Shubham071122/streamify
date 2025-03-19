import React, { useContext } from 'react';
import { FiHome } from 'react-icons/fi';
import { IoMdHelpCircleOutline } from 'react-icons/io';
import { LuHistory } from 'react-icons/lu';
import { MdLogout, MdOutlineSubscriptions } from 'react-icons/md';
import { RiAccountCircleLine, RiPlayList2Line } from 'react-icons/ri';
import { NavLink, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import './Menubar.css';

function Menubar() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const response = await logout();
    if (response.status === 200) {
      navigate('/login');
    }
  };

  return (
    <div className="w-2/12 h-full bg-red-800 ">
      <div className="w-full h-full flex flex-col items-center justify-between">
        <div className=" flex flex-col items-start mt-14 mx-4">
          <NavLink
            // onClick={navigate('/')}
            to="/"
            className={({ isActive }) =>
              `text-white flex items-center text-lg mb-6 px-8 py-2 rounded-md w-full menu ${
                isActive ? 'menu-active' : ''
              }`
            }
          >
            <div className="mr-5 text-lg">
              <FiHome />
            </div>
            <p className="text-lg font-light">Home</p>
          </NavLink>

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `text-white flex items-center text-lg mb-6 px-8 py-2 rounded-md w-full menu ${
                isActive ? 'menu-active' : ''
              }`
            }
          >
            <div className="mr-5 text-xl">
              <RiAccountCircleLine />
            </div>
            <p className="text-lg font-light">Dashboard</p>
          </NavLink>

          <NavLink
            to="/subscription"
            className={({ isActive }) =>
              `text-white flex items-center text-lg mb-6 px-8 py-2 rounded-md w-full menu ${
                isActive ? 'menu-active' : ''
              }`
            }
          >
            <div className="mr-5 text-xl">
              <MdOutlineSubscriptions />
            </div>
            <p className="text-lg font-light">Subscriptions</p>
          </NavLink>

          <NavLink
            to="/playlists"
            className={({ isActive }) =>
              `text-white flex items-center text-lg mb-6 px-8 py-2 rounded-md w-full menu ${
                isActive ? 'menu-active' : ''
              }`
            }
          >
            <div className="mr-5 text-xl">
              <RiPlayList2Line />
            </div>
            <p className="text-lg font-light">Playlists</p>
          </NavLink>

          <NavLink
            to="/watch-history"
            className={({ isActive }) =>
              `text-white flex items-center text-lg mb-6 px-8 py-2 rounded-md w-full menu ${
                isActive ? 'menu-active' : ''
              }`
            }
          >
            <div className="mr-4 text-xl">
              <LuHistory />
            </div>
            <p className="text-lg font-light">Watch History</p>
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `text-white flex items-center text-lg mb-6 px-8 py-2 rounded-md w-full menu ${
                isActive ? 'menu-active' : ''
              }`
            }
          >
            <div className="mr-5 text-xl">
              <IoMdHelpCircleOutline />
            </div>
            <p className="text-lg font-light">About</p>
          </NavLink>
        </div>
        <div className="px-4 py-5">
          <button
            onClick={handleLogout}
            className="text-white text-lg px-4 py-2 bg-orange-500 rounded-md hover:bg-orange-600 hover:transition-all 0.2s ease-in-out flex items-center w-full justify-center"
          >
            <p className="mr-3">
              <MdLogout />
            </p>
            <p>Logout</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Menubar;
