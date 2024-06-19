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
    <div className="w-full mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your Playlists</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {playlists.map((playlist) => (
          <div
            key={playlist._id}
            className="bg-white p-4 rounded-lg shadow-md cursor-pointer w-full"
            onClick={() => navigate(`/playlists/${playlist._id}`)}
          >
            <h3 className="text-xl font-bold">{playlist.name}</h3>
            <p>{playlist.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Playlists;
