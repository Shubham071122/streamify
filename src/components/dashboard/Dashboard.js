import React, { useEffect, useState, useRef } from 'react';
import { IoMdAdd } from 'react-icons/io';
import { useVideo } from '../../context/VideoContext';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../../context/SubscriptionContext';
import { useUserContext } from '../../context/UserContext';
import { IoEllipsisVertical, IoPencil, IoTrash } from 'react-icons/io5';

function Dashboard() {
    const { channelData, fetchUserDetails } = useUserContext();
    const { userVideos, fetchUserVideos } = useVideo();
    const { subscriberCount, fetchSubscriber } = useSubscription();
    const [menuOpen, setMenuOpen] = useState(Array(userVideos.length).fill(false));
    const menuRefs = useRef([]);

    const navigate = useNavigate();

  const userId = localStorage.getItem('userId');
  useEffect(() => {
    fetchUserDetails(userId);
    fetchSubscriber(userId, userId);
    fetchUserVideos();
  }, []);

  //* Initialize menuRefs based on userVideos length
  useEffect(() => {
    menuRefs.current = userVideos.map(() => null);
  }, [userVideos]);

  //** Toggle menu */
  const toggleMenu = (index) => {
    const updatedMenuOpen = [...menuOpen];
    updatedMenuOpen[index] = !updatedMenuOpen[index];
    setMenuOpen(updatedMenuOpen);
  };
  //* HANDLE EDIT VIDEO;
  const handleVideoEdit = async () => {
    console.log("Edit mode on")
  };
  //* HANDLE DELETE VIDEO;
  const handleVideoDelete = async () => {
    console.log("Delete mode on")

  };

  //* Handle clicking outside the menu to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      menuRefs.current.forEach((menuRef, index) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          const updatedMenuOpen = [...menuOpen];
          console.log("index",index);
          updatedMenuOpen[index] = false;
          setMenuOpen(updatedMenuOpen);
        }
      });
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [menuOpen]);

  
  console.log("mernuOpenAf:",menuOpen)

  return (
    <div className="mx-14 my-3">
      <div className="w-full min-h-screen bg-gray-200 px-10 rounded-lg py-5">
        {/* TOP PART */}
        <div className="w-full flex items-center justify-between border-b-2 border-black py-10">
          {channelData.fullName && (
            <h2 className="text-4xl font-bold text-gray-700">{`${
              channelData.fullName.split(' ')[0]
            }'s Dashboard`}</h2>
          )}
          <div className="flex items-center flex-col justify-center">
            <div className="w-16 h-16 bg-gray-300 rounded-full overflow-hidden mr-4">
              <img
                src={channelData.avatar}
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-gray-700 text-lg mt-2 font-bold">
              {subscriberCount[userId]}&nbsp;&nbsp;&nbsp;subscribers
            </p>
          </div>
        </div>
        {/* BOTTOM PART */}
        <div className="w-full my-5">
          <div className="flex justify-between items-center px-5 bg-red-100 py-5 rounded-md shadow-lg">
            <h3 className="text-gray-700 text-xl font-bold">All Videos</h3>
            <div>
              <button className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-lg rounded-md hover:bg-red-600 transition-all duration-200 ease-in-out">
                <IoMdAdd className="text-xl font-extrabold" />
                Add new video
              </button>
            </div>
          </div>
          <div className="w-full">
            {userVideos.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-2xl font-semibold text-gray-500">
                  No video published yet!
                </p>
              </div>
            ) : (
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6 my-5">
                {userVideos
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((video,index) => (
                    <div
                      key={video._id}
                      className="bg-white p-4 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-xl flex"
                    >
                      <div
                        onClick={() => navigate(`/video/${video._id}`)}
                        className="cursor-pointer w-1/3"
                      >
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover rounded-md border border-red-400"
                        />
                      </div>
                      <div className="flex flex-col ml-5 w-2/3">
                        <h3 className="text-xl font-bold mb-2 text-gray-800">
                          {video.title.length > 100
                            ? `${video.title.substring(0, 100)}...`
                            : video.title}
                        </h3>
                        <p className="text-gray-700">
                          {video.description.length > 100
                            ? `${video.description.substring(0, 100)}...`
                            : video.description}
                        </p>
                      </div>
                      {/* UPDATE AND DELETE POPUP */}
                        <div className="relative z-5" ref={(el) => (menuRefs.current[index] = el)}>
                          <button
                            onClick={() => toggleMenu(index)}
                            className="absolute top-0 right-0"
                          >
                            <IoEllipsisVertical
                              size={25}
                              className="hover:bg-gray-200 rounded-full px-1 py-1"
                            />
                          </button>
                          {menuOpen[index] && (
                            <div className="absolute top-6 right-0 bg-white shadow-md rounded-md p-2">
                              <button
                                className="w-full flex items-center gap-1 text-gray-700 hover:bg-gray-200 p-1 rounded"
                                onClick={handleVideoEdit}
                              >
                                <IoPencil size={16} />
                                <span>Edit</span>
                              </button>
                              <button
                                className="w-full flex items-center gap-1 text-gray-700 hover:bg-gray-200 p-1 rounded"
                                onClick={handleVideoDelete}
                              >
                                <IoTrash size={16} />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
