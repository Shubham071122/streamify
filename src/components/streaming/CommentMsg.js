import React, { useState, useEffect, useRef } from "react";
import { getRelativeTime } from "./getRelativeTime";
import { IoEllipsisVertical, IoPencil, IoTrash } from "react-icons/io5";
import axios from "axios";

function CommentMsg({ comment, currentUserId, comments, setComments }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [isEditMode,setIsEditMode] = useState(false);
  const [updatedContent, setUpdatedContent] = useState(comment.content);

  //** Handeling outside click */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
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
    setMenuOpen(!menuOpen);
  };

  //** Update
  const handleUpdate = async () => {
    const token = localStorage.getItem("toke")
    // Toggle edit mode
    setIsEditMode(!isEditMode);
  
    // If exiting edit mode, submit update to server
    if (!isEditMode) {
      try {
        const response = await axios.patch(
          `${process.env.REACT_APP_SERVER_URL}/comments/u/${comment._id}`,
          { content: updatedContent },
          
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
        );
        console.log("Comment updated:", response);
        // Update the comment in the UI
        setComments(
          comments.map((c) =>
            c._id === comment._id ? { ...c, content: updatedContent } : c
          )
        );
      } catch (error) {
        console.error("Error updating comment:", error);
      }
    }
  };
  const handleChange = (e) => {
    setUpdatedContent(e.target.value);
  };
  //** Delete */
  const handleDelete = async() => {
    const commentId = comment._id;
    const response = await axios.delete(`${process.env.REACT_APP_SERVER_URL}/comments/d/${commentId}`)
    console.log(response);
    
  };

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
          <div className="flex ">
            <p className="border-r-[3px] border-gray-400 pr-2 mr-2">
              {comment.ownerDetails.fullName}
            </p>
            <p className="">{relativeTime}</p>
          </div>
          {/* UPDATE AND DELETE */}
          <div>
            {currentUserId === comment.ownerDetails._id && (
              <div className="relative z-5" ref={menuRef}>
                <button onClick={toggleMenu} className="absolute top-0 right-0">
                  <IoEllipsisVertical size={25} className="hover:bg-gray-200 rounded-full px-1 py-1"/>
                </button>
                {menuOpen && (
                  <div className="absolute top-6 right-0 bg-white shadow-md rounded-md p-2">
                    <button
                      className="flex items-center gap-1 text-gray-700 hover:bg-gray-200 p-1 rounded"
                      onClick={handleUpdate}
                    >
                      <IoPencil size={16} />
                      <span>Update</span>
                    </button>
                    <button
                      className="flex items-center gap-1 text-gray-700 hover:bg-gray-200 p-1 rounded"
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
        <div className="mt-1">
          <p>{displayedText}</p>
          {isLongText && (
            <button onClick={handleReadMore} className="text-blue-400 text-sm ">
              {isExpanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CommentMsg;
