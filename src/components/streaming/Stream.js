import React from 'react'
import VideoPlayer from './VideoPlayer'
import Comment from './Comment';
import Description from './Description';
import { useLocation, useParams } from "react-router-dom";

function Stream() {
    const { videoId } = useParams();
    const location = useLocation();
    const { video } = location.state || {};
  return (
    <div className='w-full h-screen p-10 flex justify-between'>
      <div>
        <VideoPlayer video={video}/>
        <Description />
      </div>
      <div>
        <Comment videoId={videoId}/>
      </div>
    </div>
  );
}

export default Stream