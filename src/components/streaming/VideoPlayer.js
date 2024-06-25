import React, { useEffect, useState, useRef } from 'react';
import './VideoPlayer.css';
import { FcLikePlaceholder, FcLike } from 'react-icons/fc';
import { RiPlayListAddFill, RiShareLine } from 'react-icons/ri';
import { NavLink } from 'react-router-dom';
import { useSubscription } from '../../context/SubscriptionContext';
import axios from 'axios';
import Loader from '../loader/Loader';
import { FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useLike } from '../../context/LikeContext';
import { useVideo } from '../../context/VideoContext';

const VideoPlayer = ({ videoId, onTogglePopup, handleOpenSharePopup }) => {
  const videoRef = useRef(null);
  const {
    subscriberCount,
    isSubscribed,
    buttonClicked,
    fetchSubscriber,
    toggleSubscription,
  } = useSubscription();
  const { likeCount, isLiked, fetchLike, toggleLike } = useLike();
  const { viewCounts, fetchViewCount, incrementViewCount } = useVideo();
  const [viewIncremented, setViewIncremented] = useState(false);
  const [video, setVideo] = useState(null);
  console.log('vvvv:', video);
  const channelId = video?.owner._id;
  const currentUserId = localStorage.getItem('userId');
  const [loading, setLoading] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const [showPlaylistName, setShowPlaylistName] = useState(false);
  const [showShareName, setShowShareName] = useState(false);

  //* FETCHING SUBSCRIBER,LIKE,VIEW COUNT;
  useEffect(() => {
    if (!channelId) {
      console.error('Channel ID is not available.');
      return;
    }
    fetchSubscriber(channelId, currentUserId);
    fetchLike(videoId, currentUserId);
    fetchViewCount(videoId);
  }, [channelId, currentUserId, videoId]);

  //* FETCHING VIDEO DETAILS:
  useEffect(() => {
    const fetchVideoDetails = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/videos/${videoId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log('strvid:', response);
        setVideo(response.data.data);
      } catch (error) {
        console.error('Error fetching video details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoDetails();
  }, [videoId]);

  //* INCREMENTING VIEW COUNT:
  useEffect(() => {
    const handleTimeUpdate = () => {
      const video = videoRef.current;

      if (video && video.currentTime >= 5 && !viewIncremented) {
        incrementViewCount(videoId);
        setViewIncremented(true); //to avoid multiple increment.
      }
    };
    //HANDLE EVENT ON VIDEO:
    const video = videoRef.current;
    if (video) {
      video.addEventListener('timeupdate', handleTimeUpdate);
    }
    // Clean up: Remove the event listener when the component unmounts or when dependencies change
    return () => {
      if (video) {
        video.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };
  }, [viewIncremented, videoId, incrementViewCount]);

  //* TOGGLE SUBSCRIDER
  const handleSubscription = async (e) => {
    e.preventDefault();
    if (!channelId) return;
    setSubLoading(true);

    try {
      await toggleSubscription(channelId);
      if (isSubscribed[channelId]) {
        toast.success('Unsubscribed successfully!');
      } else {
        toast.success('Subscribed successfully!');
      }
    } catch (error) {
      console.error('Subscription error', error);
      toast.error('An error occurred!');
    } finally {
      setSubLoading(false);
    }
  };

  //* TOGGLE LIKE:
  const handleLike = async (e) => {
    e.preventDefault();
    if (!videoId) return;
    try {
      await toggleLike(videoId);
      if (isLiked[videoId]) {
        toast.success('Video Unlike');
      } else {
        toast.success('Video Like');
      }
    } catch (error) {
      console.log('Like error:', error);
      toast.error('Something Went Wrong!');
    }
  };
  //*FOR DATE:
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (loading) {
    return (
      <div className="w-full">
        <Loader />
      </div>
    );
  }

  if (!video) {
    return <div className="text-white">Video not found</div>;
  }

  return (
    <div className="w-full h-screen">
      {/* VIDEO */}
      <div className="min-w-[200px] max-w-[800px] w-[800px]">
        <video
          ref={videoRef}
          className=" w-full h-full rounded-xl box shad"
          src={video.videoFile}
          controls
        ></video>
      </div>
      {/* DESCRIPTION */}
      <div className="border-[1px] border-white mt-10 rounded-xl p-4 desc-bg text-white min-w-[200px] max-w-[800px] w-[800px]">
        {/* ICON */}
        <div className="w-full flex items-start justify-between mb-5 p-5">
          {/* **LEFT PART** */}
          <div className="w-full flex items-start gap-12">
            {/* LIKE */}
            <div className="flex flex-col items-center gap-1">
              <button onClick={handleLike}>
                {isLiked[videoId] ? (
                  <FcLike size={30} />
                ) : (
                  <FcLikePlaceholder
                    size={30}
                    className="hover:text-red-500 transition-all 0.2s ease-in-out"
                  />
                )}
              </button>
              <div>
              <p className="text-gray-200 text-sm font-medium">
                {likeCount[videoId]}&nbsp;&nbsp;Likes
              </p>
              </div>
            </div>
            {/* PLAYLIST */}
            <div className="relative inline-block">
              <button
                className="focus:outline-none"
                onMouseEnter={() => setShowPlaylistName(true)}
                onMouseLeave={() => setShowPlaylistName(false)}
                onClick={() => onTogglePopup(true)}
              >
                <RiPlayListAddFill
                  size={26}
                  className="hover:text-red-200 transition-all duration-200 ease-in-out"
                />
              </button>
              {showPlaylistName && (
                <div className="absolute text-white bg-black p-1 shadow-md border border-gray-200 top-full mt-2 left-0 w-20 text-center font-light text-xs hover:transition-opacity ">
                  Add Playlist
                </div>
              )}
            </div>
            {/* SHARE */}
            <div className="relative inline-block">
              <button
                className="focus:outline-none"
                onMouseEnter={() => setShowShareName(true)}
                onMouseLeave={() => setShowShareName(false)}
                onClick={() => handleOpenSharePopup(true)}
              >
                <RiShareLine
                  size={26}
                  className="hover:text-red-200 transition-all duration-200 ease-in-out"
                />
              </button>

              {showShareName && (
                <div className="absolute text-white bg-black p-1 shadow-md border border-gray-200 top-full mt-2 left-0 w-12 text-center font-light text-xs hover:transition-opacity ">
                  Share
                </div>
              )}
            </div>
          </div>
          {/* **RIGHT PART** */}
          <div className='px-5 py-2 bg-gray-600 rounded-full shadow-sm shadow-white flex items-center justify-between gap-3'>
            {/* VIEWS */}
            <div>
              <p className="text-gray-200 text-sm font-medium">
                {viewCounts[videoId]}&nbsp;&nbsp;Views
              </p>
            </div>
            {/* CREATED AT */}
            <div>
              <p className="text-sm text-gray-200 ml-2 italic">
                {formatDate(video.createdAt)}
              </p>
            </div>
          </div>
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
                    className="w-10 h-10 rounded-full object-cover object-center"
                  />
                </NavLink>
              </div>

              <div className="text-white font-medium flex-grow ">
                <NavLink>
                  <p className="text-wrap capitalize">{video.owner.fullName}</p>
                </NavLink>
                <p className="text-gray-400 text-sm">
                  {subscriberCount[channelId]}&nbsp;&nbsp;&nbsp;subscribers
                </p>
              </div>
            </div>
            <button
              className={`w-52 h-12 flex items-center justify-center capitalize px-3 py-2 mr-5 rounded-full text-base font-medium transition-all duration-300 subs ${
                isSubscribed[channelId]
                  ? 'bg-yellow-700 text-gray-100 hover:bg-yellow-600'
                  : 'bg-red-600 text-gray-100 hover:bg-red-500'
              } subscribe-button ${buttonClicked ? 'clicked' : ''}`}
              onClick={handleSubscription}
              disabled={loading}
            >
              {subLoading ? (
                <FaSpinner className="animate-spin text-xl" />
              ) : isSubscribed[channelId] ? (
                'Unsubscribe'
              ) : (
                'Subscribe'
              )}
            </button>
          </div>
        </div>

        {/* <p className="text-gray-300">{video.description}</p> */}
      </div>
    </div>
  );
};

export default VideoPlayer;
