import React, { useEffect, useState } from 'react';
import Video from './Video';
import Loader from '../loader/Loader';
import { useVideo } from '../../context/VideoContext';

function Home() {
  const { videos, errors, loading, fetchVideos } = useVideo();

  useEffect(() => {
    fetchVideos();
  }, []);

  if (loading) {
    return <Loader />;
  }
  // console.log('videosss:', videos);

  return (
    <div className="w-full h-screen flex justify-around px-14 py-14 flex-wrap">
      {errors > 0 ? (
        <div>{errors}</div>
      ) : videos.length > 0 ? (
        videos?.map((video) => (
          <div key={video._id} className="mb-3">
            <Video video={video} />
          </div>
        ))
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-center font-bold text-2xl text-gray-500">
            Video not found!
          </p>
        </div>
      )}
    </div>
  );
}

export default Home;
