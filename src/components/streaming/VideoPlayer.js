import React from 'react'
import './VideoPlayer.css'

function VideoPlayer({video}) {
  console.log("Inside videoplayer:",video);
    if(!video){
      return (
        <div className='text-white'>
          Video not found
        </div>
      )
    }
  return (
    <div className="">
      <div className="">
        <div className="">
          <video
            className=" w-full h-full rounded-xl"
            src={video.videoFile}
            controls
          ></video>
        </div>
        <h1 className="text-white text-2xl mb-4 mt-10">{video.title}</h1>
        <p className="text-gray-300">{video.description}</p>
      </div>
    </div>
  );
}

export default VideoPlayer