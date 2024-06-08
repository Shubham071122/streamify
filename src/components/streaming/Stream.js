import React from 'react'
import VideoPlayer from './VideoPlayer'
import Comment from './Comment';
import Discription from './Discription';
import { useLocation, useParams } from "react-router-dom";

function Stream() {
    const { videoId } = useParams();
    const location = useLocation();
    const { video } = location.state || {};
  return (
    <div className='w-full h-screen p-10 flex justify-between'>
      <div>
        <VideoPlayer video={video}/>
        <Discription />
      </div>
      <div>
        <Comment videoId={videoId}/>
      </div>
    </div>
  );
}

export default Stream