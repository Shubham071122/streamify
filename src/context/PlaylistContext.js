import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const PlaylistContext = createContext();

export const PlaylistProvider = ({ children }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);

  //* FETCHING ALL PLAYLISTS:
  const fetchPlaylists = async () => {
    setLoading(true);
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

  //* HANDLE CREATE PLAYLIST:
  const createPlaylist = async (title, description) => {
    setCreateLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/playlist/`,
        {
          name: title,
          description: description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
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
    }
  };

  //*HANDLE ADD VIDEO IN PLAYLIST:
  const addVideoInPlaylist = async (videoId, playlistId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${process.env.REACT_APP_SERVER_URL}/playlist/add/${videoId}/${playlistId}`,
        {
          videoId,
          playlistId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data && response.data.message === "Video is already in the playlist") {
        toast('Video is already in the playlist!', {
          icon: '⚠️',
        });
      } else if (response.data && response.data.data) {
        const updatedPlaylist = response.data.data;
        setPlaylists((prevPlaylists) =>
          prevPlaylists.map((playlist) =>
            playlist._id === updatedPlaylist._id ? updatedPlaylist : playlist
          )
        );
        toast.success('Video added successfully!');
      }
    } catch (error) {
      console.log('Error while add vieo to playlist:', error);
      toast.error('Something went wrong!');
    }
  };

  return (
    <PlaylistContext.Provider
      value={{
        loading,
        createLoading,
        playlists,
        setLoading,
        setPlaylists,
        createPlaylist,
        fetchPlaylists,
        addVideoInPlaylist,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylist = () => useContext(PlaylistContext);
