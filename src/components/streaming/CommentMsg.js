import React, { useState, useEffect, useRef } from "react";
import { getRelativeTime } from "./getRelativeTime";
import { IoEllipsisVertical, IoPencil, IoTrash } from "react-icons/io5";
import axios from "axios";

function CommentMsg({ comment, currentUserId, comments, setComments }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [updatedContent, setUpdatedContent] = useState(comment.content);

  //** Handeling outside click */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  //** Reade more */
  const maxLength = 30;
  const isLongText = comment.content.length > maxLength;
  const displayedText = isExpanded
    ? comment.content
    : isLongText
    ? comment.content.substring(0, maxLength) + "..."
    : comment.content;
  const relativeTime = getRelativeTime(comment.createdAt);

  const handleReadMore = () => {
    setIsExpanded(!isExpanded);
  };
  //** Toggle menu */
  const toggleMenu = () => {
    // console.log("mernuOpenBef:",menuOpen)
    setMenuOpen(!menuOpen);
  };

  //** Update
  const handleUpdate = () => {
    // Toggle edit mode
    setIsEditMode(!isEditMode);
  };

  const saveUpdate = async () => {
    const token = localStorage.getItem("token");

    // If exiting edit mode, submit update to server
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_SERVER_URL}/comments/u/${comment._id}`,
        { comment: updatedContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("Comment updated:", response);
      // Update the comment in the UI
      const updatedCommets = comments.map((com) =>
        com._id === comment._id ? { ...com, content: updatedContent } : com
      );

      setComments(updatedCommets);
      setIsEditMode(false);
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  //** Delete */
  const handleDelete = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/comments/d/${comment._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("Delete response: ", response);
      const updatedCommets = comments.filter((com) => com._id !== comment._id);
      setComments(updatedCommets);
    } catch (error) {
      console.log("Error while deleting comment:", error.message);
    }
  };
  // console.log("mernuOpenAF:",menuOpen)

  return (
    <div className="w-full py-5 px-2 flex gap-3 border-b-2">
      <div className="w-10 h-10 flex-shrink-0 border-2 border-gray-500 rounded-full">
        <img
          src={comment.ownerDetails.avatar}
          className="w-full h-full rounded-full object-cover object-center"
          alt="logo"
        />
      </div>
      <div className="w-full">
        <div className="text-gray-500 text-xs flex justify-between w-full object-cover object-center font-medium">
          <div className="flex items-center">
            <p className="">
              {comment.ownerDetails.fullName}
            </p>
            <p className="ml-2 mr-2 h-3 w-[1px] bg-slate-400"></p>
            <p className="">{relativeTime}</p>
          </div>
          {/* UPDATE AND DELETE */}
          <div>
            {currentUserId === comment.ownerDetails._id && (
              <div className="relative z-5" ref={menuRef}>
                <button onClick={toggleMenu} className="absolute top-0 right-0">
                  <IoEllipsisVertical
                    size={25}
                    className="hover:bg-gray-200 rounded-full px-1 py-1"
                  />
                </button>
                {menuOpen && (
                  <div className="absolute top-6 right-0 bg-white shadow-md rounded-md p-2">
                    <button
                      className="w-full flex items-center gap-1 text-gray-700 hover:bg-gray-200 p-1 rounded"
                      onClick={handleUpdate}
                    >
                      <IoPencil size={16} />
                      <span>Edit</span>
                    </button>
                    <button
                      className="w-full flex items-center gap-1 text-gray-700 hover:bg-gray-200 p-1 rounded"
                      onClick={handleDelete}
                    >
                      <IoTrash size={16} />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Display comment text */}
        <div className="text-black text-base font-normal">
          {isEditMode ? (
            <div>
              <input
                type="text"
                value={updatedContent}
                onChange={(e) => setUpdatedContent(e.target.value)}
                className="w-full p-2 border-2 border-gray-300 rounded outline-none mt-2"
              />
              <button
                onClick={saveUpdate}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
              >
                Save
              </button>
            </div>
          ) : (
            <>
              {displayedText}
              {isLongText && (
                <button className="text-blue-500 text-sm" onClick={handleReadMore}>
                  {isExpanded ? " Read less" : " Read more"}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CommentMsg;
