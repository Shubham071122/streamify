import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { IoSend } from 'react-icons/io5';
import FetchLoader from '../loader/FetchLoader.';
import './Comment.css';
import CommentMsg from './CommentMsg';
import AuthContext from '../../context/AuthContext';

function Comment({ videoId }) {
  const [comments, setComments] = useState([]);
  const [commentMsg, setCommentMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingComment, setLoadingComment] = useState(true);
  const { userData } = useContext(AuthContext);

  //fetching userId form local storage.
  const currentUserId = userData._id;
  // console.log("currentUserId:",currentUserId)

  useEffect(() => {
    const fetchComments = async () => {
      setLoadingComment(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/comments/${videoId}`,
          {
            withCredentials: true,
          },
        );

        const data = response.data.message.comments;
        // console.log('comment data:', data);
        if (Array.isArray(data)) {
          setComments(data);
        } else {
          console.error('Invalid comment data:', data);
          setError('Invalid comment data');
        }
      } catch (error) {
        console.log('Error while fetching comments:', error);
        setError(error.message);
      } finally {
        setLoadingComment(false);
      }
    };
    fetchComments();
  }, [videoId]);

  const handleChange = (e) => {
    setCommentMsg(e.target.value);
  };

  //* POST COMMENT:---
  const postComment = async (e) => {
    e.preventDefault();

    setLoading(true); // Start loading
    setError(''); // Clear previous errors

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/comments/${videoId}`,
        {
          comment: commentMsg,
        },
        {
          withCredentials: true,
        },
      );

      // console.log('Response:', response);
      // console.log('Response:', response.data.data.content);

      if (response.data.data && response.data.data.content) {
        // Fetch updated comments from server
        const updatedResponse = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/comments/${videoId}`,
          {
            withCredentials: true,
          },
        );

        const updatedData = updatedResponse.data.message.comments;
        // console.log('updatedData:', updatedData);
        if (Array.isArray(updatedData)) {
          setComments(updatedData);
        } else {
          console.error('Invalid updated comment data:', updatedData);
          setError('Invalid updated comment data');
        }
      } else {
        console.error('Unexpected response structure:', response.data);
        setError('Unexpected response structure');
      }
    } catch (error) {
      console.log('Error while posting comment:', error.message);
      setError('Error while posting comment');
    } finally {
      setLoading(false); // Stop loading
      setCommentMsg(''); // Clear the input field
    }
  };

  return (
    <div className="w-[360px] h-[580px] bg-white relative rounded-xl">
      <div className="w-full px-5 py-4 bg-gray-300 rounded-t-xl top-0 z-1">
        <h2 className="font-semibold text-lg">Comments</h2>
      </div>
      <div className="w-[360px] h-[460px] bg-gray-50">
        <div className="w-full h-full px-3 py-3 flex flex-col overflow-y-auto comment-section grow">
          {loadingComment ? (
            <div className="w-full h-full">
              <FetchLoader />
            </div>
          ) : comments && comments.length > 0 ? (
            comments.map((comment) => {
              // Ensure comment object is valid
              if (comment && comment._id) {
                return (
                  <CommentMsg
                    comment={comment}
                    key={comment._id}
                    currentUserId={currentUserId}
                    comments={comments}
                    setComments={setComments}
                  />
                );
              } else {
                console.error('Invalid comment object:', comment);
                return null;
              }
            })
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-center font-bold text-xl text-gray-500">
                Comment not found!
              </p>
            </div>
          )}
        </div>
      </div>
      <form
        className="z-1 absolute bottom-0 left-0 w-full px-4 py-2 bg-gray-200 border-t-2 rounded-b-lg flex"
        onSubmit={postComment}
      >
        <input
          type="text"
          placeholder="Add a comment..."
          className="w-full p-2 border-2 border-gray-300 rounded outline-none text-[17px]"
          name="comment"
          value={commentMsg}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="pl-3 py-3 text-red-600 text-xl hover:translate-x-1 hover:scale-110 hover:transition-all 0.4s ease-in"
        >
          <IoSend />
        </button>
      </form>
      {loading && <div className="loading-spinner">Posting comment...</div>}{' '}
      {/* Add a loader */}
      {error && <div className="error-message">{error}</div>}{' '}
      {/* Display error */}
    </div>
  );
}

export default Comment;
