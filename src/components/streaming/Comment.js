import axios from "axios";
import React, { useEffect, useState } from "react";
import CommentMsg from "./CommentMsg";
import './Comment.css';
import { IoSend } from "react-icons/io5";

function Comment({ videoId }) {
  const [comments, setComments] = useState([]);
  const [commentMsg, setCommentMsg] = useState("");

  //fetching userId form local storage.
  const currentUserId = localStorage.getItem("userId");
  console.log("currentUserId:",currentUserId)

  useEffect(() => {
    const fetchComments = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/comments/${videoId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = response.data.message.comments;
        console.log("comment data:", data);
        setComments(data);
      } catch (error) {
        console.log("Error while fetching comments:", error);
        // setErrors(error.message);
      }
    };
    fetchComments();
  }, [videoId]);

  const handleChange = (e) => {
    setCommentMsg(e.target.value)
  }

  const postComment = async(e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/comments/${videoId}`,
        {
          comment:commentMsg,
        },
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );
  
      console.log("REsponse:",response);
       // Update comments state to reflect the new comment
       setComments([...comments, response.data.message.comments]);
       setCommentMsg(""); // Clear the input field

  
    } catch (error) {
      console.log("Error while posting comment:",error.message);

    }

  }

  return (
    <div className="w-[360px] h-[580px] bg-white relative rounded-lg">
      <div className="w-full px-5 py-4 bg-gray-300 rounded-t-xl sticky top-0 z-10">
        <h2 className="font-semibold text-lg">Comments</h2>
      </div>
    <div className="w-[360px] h-[460px] bg-gray-50">
      <div className="w-full h-full px-3 py-3 flex flex-col overflow-y-auto comment-section grow">
        {
        comments && comments.length > 0 ? (
            comments.map((comment) => {
              // Ensure comment object is valid
              if (comment && comment._id) {
                return <CommentMsg comment={comment} key={comment._id} currentUserId={currentUserId} comments={comments} setComments={setComments}/>;
              } else {
                console.error("Invalid comment object:", comment);
                return null;
              }
            })
        ) : (
          <div className="w-full h-full items-center justify-center flex-col">
            <p>Comment not found</p>
          </div>
        )
        }
      </div>
    </div>
      <form className="z-10 absolute bottom-0 left-0 w-full px-4 py-2 bg-gray-200 border-t-2 rounded-b-lg flex"  onSubmit={postComment}>
        <input
          type="text"
          placeholder="Add a comment..."
          className="w-full p-2 border-2 border-gray-300 rounded outline-none text-[17px]"
          name="comment"
          value={commentMsg}
          onChange={handleChange}
        />
        <button type="submit" className="pl-3 py-3 text-red-600 text-xl hover:translate-x-1 hover:scale-110 hover:transition-all 0.4s ease-in"><IoSend/></button>
      </form>
    </div>
  );
}

export default Comment;
