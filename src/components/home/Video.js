import React from "react";
import './Video.css'
import { NavLink } from "react-router-dom";

function Video({ video }) {
  // console.log("video:", video);
  return (
    <NavLink to={`/video/${video._id}`} state={{ video }}>
      <div className="w-[370px] h-[300px] border-[1px] rounded-md video-hover bg-red-800 mb-14">
        {/* TOP */}
        <div className="w-full h-[200px]">
          <img
            src={video.thumbnail}
            alt=""
            className="w-full h-full object-cover object-center rounded-t-md"
          />
        </div>

        {/* BOTTOM */}
        <div className="w-full flex my-2 mx-2 pl-2 pr-4">
          <div className="w-10 h-10 flex-shrink-0">
            <NavLink to={`user/${video.owner?._id}`}>
              <img
                src={video.owner?.avatar}
                alt=""
                className="w-10 h-10 rounded-full object-cover object-center"
              />
            </NavLink>
          </div>

          <div className="ml-4 text-white capitalize font-medium flex-grow ">
            <p className="text-wrap">
              {video.title.length > 50
                ? `${video.title.substring(0, 50)}...`
                : video.title}
            </p>
            <NavLink to={`user/${video.owner?._id}`}>
              <span className="text-gray-400 text-sm hover:text-gray-300 transition-all 0.2s ease">
                {video.owner?.fullName}
              </span>
            </NavLink>
            <p></p>
          </div>
        </div>
      </div>
    </NavLink>
  );
}

export default Video;
