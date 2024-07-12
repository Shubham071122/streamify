import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Loader from '../loader/Loader';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { FaExclamationCircle } from 'react-icons/fa';
import { RxCross2 } from 'react-icons/rx';

const PlaylistDetails = () => {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  const [createdDate, setCreatedDate] = useState('');
  const [updatedDate, setUpdatedDate] = useState('');
  const [showPlaylistEditPopup, setShowPlaylistEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const navigate = useNavigate();

  //* EXTRACTING DATE FUNCTION:
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
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
        setPlaylist(playlistData[0]); // we do [0] this because response from backed is an array.
        // console.log(,playlistData[0].video);

        //FETCHING VIDEO:
        const videoDetails = await Promise.all(
          playlistData[0].video?.map(async (videoId) => {
            const videoResponse = await axios.get(
              `${process.env.REACT_APP_SERVER_URL}/videos/v/${videoId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );
            return videoResponse.data.data;
          }),
        );

        //EXTRACTING CREATEDAT AND UPDATED DATE:
        const createdAt = formatDate(playlistData[0].createdAt);
        setCreatedDate(createdAt);
        const updatedAt = formatDate(playlistData[0].updatedAt);
        setUpdatedDate(updatedAt);

        // console.log('vidDetal:', videoDetails);
        setVideos(videoDetails);
      } catch (error) {
        console.error('Error fetching playlist or video details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [playlistId]);

  //*HANDLE INPUT CHANGE:
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlaylist((prevData) => ({ ...prevData, [name]: value }));
  };

  //* HANDLE SUBMIT:
  const handleSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);

    try {
      const token = localStorage.getItem('token');
      // console.log('t:', token);
      // console.log(playlist.name);
      // console.log(playlist.description);
      const response = await axios.patch(
        `${process.env.REACT_APP_SERVER_URL}/playlist/${playlistId}`,
        {
          name: playlist.name,
          description: playlist.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data && response.data.data) {
        setPlaylist(response.data.data);
        toast.success('Playlist updated successfully!');
      }
    } catch (error) {
      console.log('Error while updating plylist:', error);
      toast.error('something went wrong!');
    } finally {
      setEditLoading(false);
      setShowPlaylistEditPopup(false);
    }
  };

  //* HANDLE DELETE PLAYLIST:
  const handleDelete = async () => {
    setEditLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/playlist/${playlistId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data && response.data.data) {
        toast.success('Playlist deleted successfully!');
        navigate('/playlists');
      }
    } catch (error) {
      console.log('Error while delteing playlist:', error);
      toast.error('Something went wrong!');
    }
  };

  //*HANDLE VIDEO REMOVE FROM PLAYLIST:
  const handleVideoRemove = async (videoId) => {
    // console.log(videoId);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${process.env.REACT_APP_SERVER_URL}/playlist/remove/${videoId}/${playlistId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      // console.log(response);
      if (response.data && response.data.data) {
        setVideos(response.data.data.video);
        toast.success('Video removed successfully!');
      }
    } catch (error) {
      console.log('Error while removing video from playlist:', error);
      toast.error('Something went wrong!');
    }
  };

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
    <div className="my-5 mx-14">
      <div className="w-full mx-auto p-6 bg-white text-black shadow-lg rounded-lg min-h-screen">
        <div className="relative flex justify-between items-center mb-4">
          <div className="w-4/5 mt-4 ml-4">
            <h2 className="text-3xl font-bold capitalize flex flex-wrap mb-2">
              {playlist.name}
            </h2>
            <p className="text-gray-700 text-lg flex flex-wrap mb-4">
              {playlist.description}
            </p>
            <p className="text-gray-700 text-sm italic font-medium">
              Created:<span className="pl-2">{createdDate}</span>
            </p>
            <p className="text-gray-700 text-sm italic font-medium">
              Updated:<span className="pl-2">{updatedDate}</span>
            </p>
          </div>
          <div className="absolute flex space-x-2 top-4 right-4 bg-gray-200 px-3 py-2 rounded-full">
            <button
              onClick={() => setShowPlaylistEditPopup(true)}
              className="text-blue-500 hover:text-blue-700 mr-3"
            >
              <FaEdit size={20} />
            </button>
            <button
              onClick={() => setShowDeletePopup(true)}
              className="text-red-500 hover:text-red-700"
            >
              <FaTrash size={20} />
            </button>
          </div>
        </div>
        <div className="w-full h-[0.6px] bg-gray-500 my-10"></div>

        {/* BOTTOM PART */}

        {videos.length > 0 ? (
          <div className="w-full flex flex-col gap-5 ">
            {videos.map((video) => (
              <div
                key={video._id}
                className="bg-gray-100 p-4 rounded-lg shadow-md w-full h-4/5 flex relative"
              >
                <div
                  onClick={() => navigate(`/video/${video._id}`)}
                  className="w-2/6 h-44 shadow-md cursor-pointer"
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    size={50}
                    className="w-full h-44 object-cover rounded-md mr-4 border border-red-400"
                  />
                </div>
                <div className="flex flex-col ml-5 mt-3 w-4/6">
                  <h3 className="text-xl font-bold flex flex-wrap mb-2">
                    {video.title.length > 150
                      ? `${video.title.substring(0, 150)}...`
                      : video.title}
                  </h3>
                  <p className="text-gray-700 flex flex-wrap">
                    {video.description.length > 200
                      ? `${video.description.substring(0, 200)}...`
                      : video.description}
                  </p>
                </div>
                <button
                  onClick={() => handleVideoRemove(video._id)}
                  className="absolute right-3 top-3 p-2 hover:bg-gray-300 rounded-full z-10"
                >
                  <RxCross2 className="text-lg font-bold" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full flex items-center justify-center h-full">
            <p className="text-gray-700 text-xl font-medium">
              No video added!
            </p>
          </div>
        )}
        {/* SHOWING EDIT POPUP */}
        {showPlaylistEditPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-7/12 h-4/6 relative">
              <h2 className="text-xl font-bold mb-4">Edit Playlist</h2>
              <form onSubmit={handleSubmit}>
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="name"
                >
                  Title
                </label>
                <input
                  type="text"
                  name="name"
                  value={playlist.name}
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
                  value={playlist.description}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border rounded-md shadow-sm min-h-28 max-h-52 bg-slate-100"
                  style={{ minHeight: '100px' }}
                  rows={5}
                />
                <div className="absolute mt-4 right-8 bottom-8 flex justify-center">
                  <button
                    onClick={() => setShowPlaylistEditPopup(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 text-white rounded-md shadow-md w-20 flex items-center justify-center"
                    disabled={editLoading}
                  >
                    {editLoading ? (
                      <FaSpinner className="animate-spin text-xl" />
                    ) : (
                      'Save'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* SHOW DELETE POPUP */}
        {showDeletePopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="w-full flex items-center justify-center">
                <FaExclamationCircle className="w-14 h-14 text-red-700 text-center mb-4" />
              </div>
              <h2 className="text-xl font-bold mb-4 text-center">
                Delete Playlist!
              </h2>
              <p className="mb-4 text-center">
                Are you sure you want to delete this playlist.
              </p>
              <div className="flex justify-center mt-5">
                <button
                  onClick={() => setShowDeletePopup(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md w-20 flex items-center justify-center"
                  disabled={editLoading}
                >
                  {editLoading ? (
                    <FaSpinner className="animate-spin text-xl" />
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistDetails;
