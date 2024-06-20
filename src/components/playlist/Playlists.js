import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from '../loader/Loader';

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId'); // Assuming you store the user ID in local storage

        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/playlist/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("res:",response);
        setPlaylists(response.data.data);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  //For date
  //TODO: SOLVE PASS DATE FROM PD TO P;
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return (`${day}/${month}/${year}`);
  };

  if (loading) {
    return <div>
      <Loader/>
    </div>;
  }

  if (!playlists.length > 0) {
    return <div className='w-full h-full flex items-center justify-center'>
      <p className="text-center font-bold text-2xl text-gray-500">Playlists not found!</p>
    </div>;
  }

  return (
    <div className="my-5 mx-14">
    <div className="w-full p-6 px-14 bg-white h-screen rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center ">Your Playlists</h2>
      <div className='w-3/5 h-[0.6px] mx-auto bg-gray-300 my-5'></div>

      <div className=" flex flex-col gap-10">
        {playlists.map((playlist) => (
          <div
            key={playlist._id}
            className="bg-gray-200 p-4 rounded-lg shadow-md cursor-pointer w-full min-h-28"
            onClick={() => navigate(`/playlists/${playlist._id}`)}
          >
            <div className="flex justify-between items-center  mb-2">
              <h3 className="text-lg font-bold capitalize flex flex-wrap w-11/12 ">{playlist.name}</h3>
              <p className="text-sm text-gray-500 ml-2 italic">{formatDate(playlist.createdAt)}</p>
            </div>
            <p className='flex flex-wrap w-11/12'>
            {playlist.description.length > 150 ?
            `${playlist.description.substring(0,150)}...`
            :
            playlist.description
            
            }
            </p>
          </div>
        ))}
      </div>
      
    </div>
    </div>
  );
};

export default Playlists;
