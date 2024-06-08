import axios from "axios";
import React, { useEffect, useState } from "react";
import Error from "../error/Error";

function Comment({ videoId }) {
  const [comments, setComments] = useState([]);
  const [errors, setErrors] = useState("");

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
          }
        );

        const data = response.data.message.comments;
        console.log("comment data:", data);
        setComments(data);
      } catch (error) {
        console.log("Error while fetching comments:", error);
        setErrors(error.message);
      }
    };
    fetchComments();
  }, [videoId]);

  return (
    <div className="w-[350px] min-h-[500px] bg-white rounded-xl">
      <div className="w-full px-5 py-4 bg-gray-200 rounded-t-xl">
        <h2 className="font-semibold text-lg">Comment</h2>
      </div>
      <div className="w-full h-full px-3 py-3 flex flex-col">
        {comments && comments.length > 0 ? (
          <div>
            {comments.map((comment) => (
              <div key={comment._id} className="">
                <div>
                {comment.content}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-full items-center justify-center flex-col">
            <p>Comment not found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Comment;
