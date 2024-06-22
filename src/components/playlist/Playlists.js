import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from '../loader/Loader';
import { FaRegSquarePlus, FaPlus } from 'react-icons/fa6';
import { FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';
import './Playlists.css';

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [showCreatPlylistPopup, setShowCreatePlaylistPopup] = useState(false);
  const [playlistData, setPlaylistData] = useState({
    title: '',
    description: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/playlist/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log('res:', response);
        setPlaylists(response.data.data);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  //*HANDLE INPUT CHANGE:
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlaylistData((prevData) => ({ ...prevData, [name]: value }));
  };

  //* HANDLE SUBMIT:
  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreateLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/playlist/`,
        {
          name: playlistData.title,
          description: playlistData.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log('Playyyyyy:', response);
      if (response.data && response.data.data) {
        const newPlaylist = response.data.data;
        setPlaylists((prevPlaylists) => [...prevPlaylists, newPlaylist]);
        toast.success('Playlist created successfully!');
      }
    } catch (error) {
      console.log('Error while creating playlist:', error);
      toast.error('Something went wrong!');
    } finally {
      setCreateLoading(false);
      setShowCreatePlaylistPopup(false);
      setPlaylistData({
        title: '',
        description: '',
      });
    }
  };

  //For date
  //TODO: SOLVE PASS DATE FROM PLAYLISTDETAILS TO PLAYLIST;
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (!playlists.length > 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-center font-bold text-2xl text-gray-500 overflow-y-scroll">
          Playlists not found!
        </p>
      </div>
    );
  }

  return (
    <div className="my-3 mx-14">
      <div className="w-full p-6 px-14 bg-white min-h-screen rounded-lg ">
        <h2 className="text-3xl font-bold mb-6 text-center ">Your Playlists</h2>
        <div className="w-3/5 h-[0.6px] mx-auto bg-gray-300 my-5"></div>

        <div className=" flex flex-col gap-8">
          {playlists
            .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((playlist) => (
            <div
              key={playlist._id}
              className="bg-gray-200 p-4 rounded-lg shadow-md cursor-pointer w-full min-h-28"
              onClick={() => navigate(`/playlists/${playlist._id}`)}
            >
              <div className="flex justify-between items-center  mb-2">
                <h3 className="text-lg font-bold capitalize flex flex-wrap w-11/12 ">
                  {playlist.name}
                </h3>
                <p className="text-sm text-gray-500 ml-2 italic">
                  {formatDate(playlist.createdAt)}
                </p>
              </div>
              <p className="flex flex-wrap w-11/12">
                {playlist.description.length > 150
                  ? `${playlist.description.substring(0, 150)}...`
                  : playlist.description}
              </p>
            </div>
          ))}
        </div>

        {/* Floating button */}
        <div className="fixed bottom-10 right-20 flex flex-col items-center">
          {/* Create playlist text */}
          <div className="relative">
            <button
              onClick={() => setShowCreatePlaylistPopup(true)}
              className="relative group"
            >
              <div className="w-16 h-16 bg-orange-500 rounded-full shadow-slate-400 shadow-md flex items-center justify-center">
                <FaPlus className="text-4xl text-white font-bold" />
              </div>
              {/* Text to show on hover */}
              <div className="absolute bottom-16 right-1 mb-2 w-28 bg-gray-700 text-white font-light text-center py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Create playlist
              </div>
            </button>
          </div>
        </div>

        {/* SHOWING EDIT POPUP */}
        {showCreatPlylistPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-7/12 h-4/6 relative">
              <h2 className="text-xl font-bold mb-4">Create new Playlist</h2>
              <form onSubmit={handleSubmit}>
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="title"
                >
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={playlistData.title}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border rounded-md shadow-sm bg-slate-100"
                />
                <label
                  className="block text-sm font-medium text-gray-700 mt-4"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  name="description"
                  value={playlistData.description}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border rounded-md shadow-sm min-h-28 max-h-52 bg-slate-100"
                  style={{ minHeight: '100px' }}
                  rows={5}
                />
                <div className="absolute mt-4 right-8 bottom-8 flex items-center justify-center">
                  <button
                    onClick={() => setShowCreatePlaylistPopup(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 text-white rounded-md shadow-md w-20 flex items-center justify-center"
                    disabled={createLoading}
                  >
                    {createLoading ? (
                      <FaSpinner className="animate-spin text-2xl" />
                    ) : (
                      'Create'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Playlists;
