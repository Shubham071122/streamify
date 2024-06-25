import axios from 'axios';
import React, { createContext, useContext, useState } from 'react';

const VideoContext = createContext();

export const VideoProvider = ({ children }) => {
  const [videos, setVideos] = useState([]);
  const [errors, setErrors] = useState('');
  const [loading, setLoading] = useState(false);
  const [viewCounts, setViewCounts] = useState({});

  //* FETCHING VIDEO FOR HOME SCREEN:
  const fetchVideos = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/videos/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      //   console.log("Res vid:",response);
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
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/videos/search?query=${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log('Res vid:', response);
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
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/videos/view-count/${videoId}`,
        {
          headers:{
            Authorization: `Bearer ${token}`,
          },
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
      const token = localStorage.getItem('token');
      await axios.patch(`${process.env.REACT_APP_SERVER_URL}/videos/view/${videoId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Increment local view count
      setViewCounts((prevCounts) => ({
        ...prevCounts,
        [videoId]: prevCounts[videoId] + 1,
      }));
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };


  return (
    <VideoContext.Provider
      value={{ videos, errors, loading,viewCounts,  fetchVideos, fetchVideoByQuery,fetchViewCount,  incrementViewCount }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => useContext(VideoContext);
