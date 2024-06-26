import React from 'react';
import { IoMdAdd } from "react-icons/io";

function Dashboard() {

  

  return (
    <div className='mx-14 my-3'>
    <div className="w-ful min-h-screen bg-gray-200 px-10 rounded-lg">
      {/* TOP PART */}
      <div className='w-full flex items-center justify-between border-b-2 border-black py-10 '>
        <h2 className='text-4xl font-bold text-gray-600'>Dashboard</h2>
        <div>
          <div>imgae</div>
          <p>4 subscriber</p>
        </div>
      </div>
      {/* BOTTOM PART */}
      <div className='w-full my-5'>
        <div className='flex justify-between items-center px-5 bg-red-100 py-5'>
          <h3 className='text-gray-600 text-xl font-bold'>All Videos</h3>
          <div>
            <button className='flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-lg rounded-md hover:bg-red-600 transition-all duration-200 ease-in-out'>
            <IoMdAdd className='text-xl font-extrabold' />Add new video
            </button>
          </div>
        </div>
        <div>
          {

          }
        </div>
      </div>
    </div>
    </div>
  );
}

export default Dashboard;


