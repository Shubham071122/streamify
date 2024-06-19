import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Loader from '../loader/Loader';
import { FaEdit, FaTrash } from 'react-icons/fa';

const PlaylistDetails = () => {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createdDate,setCreatedDate] = useState('');
  const [updatedDate,setUpdatedDate] = useState('');

  //EXTRACTING DATE FUNCTION:
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const year = date.getFullYear();
  
    return (`${day}/${month}/${year}`);
  };

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/playlist/${playlistId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const playlistData = response.data.data;
        console.log('res pd:', response.data.data);
        setPlaylist(playlistData[0]); // we do [0] this because response from backed is an array.
        // console.log(playlistData[0].video);

        //FETCHING VIDEO:
        const videoDetails = await Promise.all(
          playlistData[0].video?.map(async (videoId) => {
            const videoResponse = await axios.get(
              `${process.env.REACT_APP_SERVER_URL}/videos/${videoId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );
            console.log('vid res:', videoResponse);
            return videoResponse.data.data;
          }),
        );

        //EXTRACTING CREATEDAT AND UPDATED DATE:
        const createdAt = formatDate(playlistData[0].createdAt);
        setCreatedDate(createdAt);
        const updatedAt = formatDate(playlistData[0].updatedAt);
        setUpdatedDate(updatedAt);

        console.log('vidDetal:', videoDetails);
        setVideos(videoDetails);
      } catch (error) {
        console.error('Error fetching playlist or video details:', error);
      } finally {
        setLoading(false);
      }
    };

    
      fetchPlaylist();
  }, [playlistId]);



  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-center font-bold text-2xl text-gray-500">
          Playlist not found!
        </p>
      </div>
    );
  }

  return (
    <div className="m-5">
      <div className="container mx-auto p-6 bg-white text-black shadow-lg rounded-lg">
        <div className="relative flex justify-between items-center mb-4">
          <div className='w-4/5 mt-4 ml-4'>
            <h2 className="text-3xl font-bold capitalize mb-2">{playlist.name}</h2>
            <p className="text-gray-700 text-lg flex flex-wrap mb-4">{playlist.description}</p>
            <p className="text-gray-700 text-sm italic font-medium">Created:<span className='pl-2'>{createdDate}</span></p>
            <p className="text-gray-700 text-sm italic font-medium">Updated:<span className='pl-2'>{updatedDate}</span></p>
          </div>
          <div className="absolute flex space-x-2 top-4 right-4 bg-gray-200 px-3 py-2 rounded-full">
            <button className="text-blue-500 hover:text-blue-700 mr-3">
              <FaEdit size={20} />
            </button>
            <button className="text-red-500 hover:text-red-700">
              <FaTrash size={20} />
            </button>
          </div>
        </div>
        <div className='w-full h-[0.6px] bg-gray-500 my-10'></div>
        <div className="grid grid-cols-1 gap-4">
          {videos.map((video) => (
            <div key={video._id} className="flex bg-gray-100 p-4 rounded-lg shadow-md w-full">
              <img src={video.thumbnail} alt={video.title} className="w-1/3 h-40 object-cover rounded-md mr-4" />
              <div className="flex flex-col justify-start ml-5 mt-3">
                <h3 className="text-xl font-bold">{video.title}</h3>
                <p className="text-gray-700">{video.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlaylistDetails;
