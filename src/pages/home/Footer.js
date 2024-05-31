import React from 'react'
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";

function Footer() {
  return (
    <div>
      <div className="w-full h-[.5px] bg-slate-500"></div>
      <footer className="w-full h-[150px]">
        <h2 className="text-[20px] ml-10 mt-10">Streamify.com</h2>
        <div className="w-full flex ml-10 mt-5">
          <a
            href="https://github.com/Shubham071122"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[25px] text-white hover:text-gray-500 pr-5"
          >
            <FaGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/shubhamkumar0711/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[25px] text-white hover:text-blue-500"
          >
            <FaLinkedinIn />
          </a>
        </div>
        <div className="w-full h-full  flex justify-center items-end">
          <p className="mb-4">Copyright © 2024 by @Streamify.com</p>
        </div>
      </footer>
    </div>
  );
}

export default Footer