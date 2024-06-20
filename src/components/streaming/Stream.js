import React from 'react'
import VideoPlayer from './VideoPlayer'
import Comment from './Comment';
import Description from './Description';
import { useParams } from "react-router-dom";

function Stream() {
    const { videoId } = useParams();
    
  return (
    <div className='w-full h-screen p-10 flex justify-between'>
      <div className='w-full'>
        <VideoPlayer videoId={videoId}/>
        <Description />
      </div>
      <div>
        <Comment videoId={videoId}/>
      </div>
    </div>
  );
}

export default Stream