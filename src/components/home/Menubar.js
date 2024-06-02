import React from 'react'
import './Menubar.css'
import { NavLink } from 'react-router-dom'
import { FiHome } from "react-icons/fi";
import { RiAccountCircleLine } from "react-icons/ri";
import { MdOutlineSubscriptions } from "react-icons/md";
import { RiPlayList2Line } from "react-icons/ri";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { LuHistory } from "react-icons/lu";


function Menubar() {
  return (
    <div className="w-2/12 h-screen bg-red-800 ">
      <div className=" flex flex-col items-start mt-14 mx-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `text-white flex items-center text-lg mb-6 px-8 py-2 rounded-md w-full menu ${
              isActive ? "menu-active" : ""
            }`
          }
        >
          <div className="mr-5 text-xl">
            <FiHome />
          </div>
          <p>Home</p>
        </NavLink>

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `text-white flex items-center text-lg mb-6 px-8 py-2 rounded-md w-full menu ${
              isActive ? "menu-active" : ""
            }`
          }
        >
          <div className="mr-5 text-xl">
            <RiAccountCircleLine />
          </div>
          <p>Profile</p>
        </NavLink>

        <NavLink
          to="/subscription"
          className={({ isActive }) =>
            `text-white flex items-center text-lg mb-6 px-8 py-2 rounded-md w-full menu ${
              isActive ? "menu-active" : ""
            }`
          }
        >
          <div className="mr-5 text-xl">
            <MdOutlineSubscriptions />
          </div>
          <p>Subscriptions</p>
        </NavLink>

        <NavLink
          to="/playlist"
          className={({ isActive }) =>
            `text-white flex items-center text-lg mb-6 px-8 py-2 rounded-md w-full menu ${
              isActive ? "menu-active" : ""
            }`
          }
        >
          <div className="mr-5 text-xl">
            <RiPlayList2Line />
          </div>
          <p>Playlists</p>
        </NavLink>

        <NavLink
          to="/watch-history"
          className={({ isActive }) =>
            `text-white flex items-center text-lg mb-6 px-8 py-2 rounded-md w-full menu ${
              isActive ? "menu-active" : ""
            }`
          }
        >
          <div className="mr-4 text-xl">
            <LuHistory />
          </div>
          <p>Watch History</p>
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            `text-white flex items-center text-lg mb-6 px-8 py-2 rounded-md w-full menu ${
              isActive ? "menu-active" : ""
            }`
          }
        >
          <div className="mr-5 text-2xl">
            <IoMdHelpCircleOutline />
          </div>
          <p>About</p>
        </NavLink>
      </div>
    </div>
  );
}

export default Menubar