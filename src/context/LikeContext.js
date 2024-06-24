import axios from 'axios';
import React, { createContext, useContext, useState } from 'react';

const LikeContext = createContext();

export const LikeProvider = ({ children }) => {
  const [likeCount, setLikeCount] = useState({});
  const [isLiked, setIsLiked] = useState({});
  const [buttonClicked, setButtonClicked] = useState(false);

  //*GETTING LIKE COUNT:
  const fetchLike = async (videoId, userId) => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/likes/video-like/${videoId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log('Like:', response);
      // Set the Like count in the state
      if (response.data && response.data.data) {
        setLikeCount((prevCounts) => ({
          ...prevCounts,
          [videoId]: response.data.data.length, // Ensure you're setting the correct count
        }));
      }
      // Checking if the current user has liked the video
      const isAlreadyLiked = response.data.data.some(
        (like) => like.likedBy === userId && like.video === videoId,
      );
      setIsLiked((prevIsLiked) => ({
        ...prevIsLiked,
        [videoId]: isAlreadyLiked,
      }));
    } catch (error) {
      console.log('Error while fetching like:', error);
    }
  };

  //* TOGGLE LIKE:
  const toggleLike = async (videoId) => {
    console.log('vid:', videoId);
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/likes/toggle/v/${videoId}`,
        {}, // Empty body for the POST request
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log('Like:', response);
      // Update the like state
      setIsLiked((prevIsLiked) => ({
        ...prevIsLiked,
        [videoId]: !prevIsLiked[videoId],
      }));

      // Optionally update the like count
      setLikeCount((prevCounts) => ({
        ...prevCounts,
        [videoId]: isLiked[videoId]
          ? prevCounts[videoId] - 1
          : prevCounts[videoId] + 1,
      }));
    } catch (error) {
      console.log('Error while toggle like:', error);
    }
  };

  return (
    <LikeContext.Provider
      value={{
        likeCount,
        isLiked,
        buttonClicked,
        fetchLike,
        toggleLike,
      }}
    >
      {children}
    </LikeContext.Provider>
  );
};

export const useLike = () => useContext(LikeContext);
