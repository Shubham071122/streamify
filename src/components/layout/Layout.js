import React from 'react'
import Menubar from '../home/Menubar';
import Navbar from '../home/Navbar';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className="w-full h-screen flex flex-col">
      <Navbar />
      <div className="w-full flex flex-1 overflow-hidden">
        <Menubar />
        <div className="flex-grow flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout