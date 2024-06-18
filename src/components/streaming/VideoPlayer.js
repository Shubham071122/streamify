import React, { useEffect, useState } from 'react';
import './VideoPlayer.css';
import { FcLikePlaceholder, FcLike } from 'react-icons/fc';
import { FaRegShareFromSquare } from 'react-icons/fa6';
import { RiPlayListAddFill } from 'react-icons/ri';
import { NavLink } from 'react-router-dom';
import { useSubscription } from '../../context/SubscriptionContext';

function VideoPlayer({ video }) {

  const {subscriberCount,isSubscribed,buttonClicked,fetchSubscriber,toggleSubscription} = useSubscription();
  const channelId = video.owner?._id;
  const currentUserId = localStorage.getItem('userId');
  const [isLiked,setIsLiked] = useState(false);
  console.log('channelId:', channelId);

  //* FETCHING SUBSCRIBER COUNT;
  useEffect(() => {
    if (!channelId) {
      console.error('Channel ID is not available.');
      return;
    }
    fetchSubscriber(channelId,currentUserId);
  }, [channelId, currentUserId]);

  //* TOGGLE SUBSCRIDER
  const handleSubscription = (e) => {
    e.preventDefault();
    if(!channelId) return;
    toggleSubscription(channelId);
  }

  console.log('Inside videoplayer:', video);
  if (!video) {
    return <div className="text-white">Video not found</div>;
  }
  return (
    <div className="w-full h-screen">
      {/* VIDEO */}
      <div className="min-w-[200px] max-w-[800px] w-[800px]">
        <video
          className=" w-full h-full rounded-xl box shad"
          src={video.videoFile}
          controls
        ></video>
      </div>
      {/* DESCRIPTION */}
      <div className="border-[1px] border-white mt-10 rounded-xl p-4 desc-bg text-white">
        {/* LIKE */}
        <div className="w-full flex items-center gap-8 mb-5">
          <button onClick={() => setIsLiked(!isLiked)}>
            {
              isLiked ? <FcLike size={30}/> :
            
            <FcLikePlaceholder
              size={30}
              className="hover:text-red-500 transition-all 0.2s ease-in-out"
            />
          }
          </button>
          <button>
            <RiPlayListAddFill
              size={26}
              className="hover:text-red-200 transition-all 0.2s ease-in-out"
            />
          </button>
          <button>
            <FaRegShareFromSquare
              size={26}
              className="hover:text-red-200 transition-all 0.2s ease-in-out"
            />
          </button>
        </div>

        {/* TITLE AND USER */}
        <div>
          <p className="text-white text-2xl">{video.title}</p>
          <div className="w-full flex items-center justify-between">
            <div className="w-full flex my-4">
              <div className="w-10 h-10 flex-shrink-0 mr-4">
                <NavLink>
                  <img
                    src={video.owner.avatar}
                    alt=""
                    className="rounded-full object-cover object-center"
                  />
                </NavLink>
              </div>

              <div className="text-white font-medium flex-grow ">
                <NavLink>
                  <p className="text-wrap capitalize">{video.owner.fullName}</p>
                </NavLink>
                <p>{}</p>
                <p className="text-gray-400 text-sm">
                  {subscriberCount[channelId]}&nbsp;&nbsp;&nbsp;subscribers
                </p>
              </div>
            </div>
            <button
              className={`w-52 h-12 capitalize px-3 py-2 mr-5 rounded-full text-base font-medium transition-all duration-300 subs ${isSubscribed[channelId] ? 'bg-yellow-700 text-gray-100 hover:bg-yellow-600' : 'bg-red-600 text-gray-100 hover:bg-red-500'} subscribe-button ${buttonClicked ? 'clicked' : ''}`}
              onClick={handleSubscription}
            >
              {isSubscribed[channelId] ? <p>Unsubscribe  ✔</p> : <p>subscribe</p>}
            </button>
          </div>
        </div>

        {/* <p className="text-gray-300">{video.description}</p> */}
      </div>
    </div>
  );
}

export default VideoPlayer;
