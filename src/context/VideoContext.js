import axios from 'axios';
import React, { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';

const VideoContext = createContext();

export const VideoProvider = ({ children }) => {
  const [videos, setVideos] = useState([]);
  const [errors, setErrors] = useState('');
  const [loading, setLoading] = useState(false);
  const [viewCounts, setViewCounts] = useState({});
  const [userVideos, setUserVideos] = useState([]);

  //* FETCHING VIDEO FOR HOME SCREEN:
  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/videos/`,
        {
          withCredentials: true,
        },
      );
      if (response.data && response.data.message.videos) {
        setVideos(response.data.message.videos);
      }
    } catch (error) {
      console.log('Error while fetching videos:', error);
      setErrors(error.message);
    } finally {
      setLoading(false);
    }
  };

  //* FETCHING VIDEO BY Search QUERY:
  const fetchVideoByQuery = async (query) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/videos/search?query=${query}`,
        {
          withCredentials: true,
        },
      );
      if (response.data && response.data.message.videos) {
        setVideos(response.data.message.videos);
      }
    } catch (error) {
      console.log('Error while fetching videos:', error);
      setErrors(error.message);
    } finally {
      setLoading(false);
    }
  };

  //*FETCHING VIDEO VIEW COUNT:
  const fetchViewCount = async (videoId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/videos/view-count/${videoId}`,
        {
          withCredentials: true,
        },
      );

      setViewCounts((prevCounts) => ({
        ...prevCounts,
        [videoId]: response.data.data,
      }));
    } catch (error) {
      console.error('Error fetching view count:', error);
    }
  };

  //*INCREMENTING VIDEO VIEW COUNT:
  const incrementViewCount = async (videoId) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_SERVER_URL}/videos/view/${videoId}`,
        {},
        {
          withCredentials: true,
        },
      );

      // Increment local view count
      setViewCounts((prevCounts) => ({
        ...prevCounts,
        [videoId]: prevCounts[videoId] + 1,
      }));
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  //* FETCHING USER VIDEO FOR DASHBOARD:
  const fetchUserVideos = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/videos/user-videos`,
        {
          withCredentials: true,
        },
      );
      // console.log("Usevideos:",response);
      if (response.data && response.data.data) {
        setUserVideos(response.data.data);
      }
    } catch (error) {
      console.log('Error fetching user videos:', error);
    }
  };

  //* UPDATE USER VIDEO:
  const updateUserVideo = async (videoId, formData) => {
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_SERVER_URL}/videos/update-video/${videoId}`,
        {
          title: formData.title,
          description: formData.description,
          thumbnail: formData.thumbnail,
        },
        {
          withCredentials: true,
        },
      );
      if (response.data && response.data.data) {
        // console.log("UpdatedUserVideo:",response);
        toast.success('Video updated successful!');
      }
    } catch (error) {
      console.log('Error while updating video:', error);
      toast.error('Something went wrong!');
    }
  };

  //* DELETE USER VIDEO:
  const deleteUserVideo = async (videoId) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/videos/delete-video/${videoId}`,
        {
          withCredentials: true,
        },
      );
      if (response.data && response.data.data) {
        // console.log("UpdatedUserVideo:",response);
        toast.success('Video deleted successful!');
      }
    } catch (error) {
      console.log('Error while updating video:', error);
      toast.error('Something went wrong!');
    }
  };

  return (
    <VideoContext.Provider
      value={{
        videos,
        errors,
        loading,
        viewCounts,
        userVideos,
        fetchVideos,
        fetchVideoByQuery,
        fetchViewCount,
        incrementViewCount,
        fetchUserVideos,
        updateUserVideo,
        deleteUserVideo,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => useContext(VideoContext);
