import React, { useEffect, useState, useRef } from 'react';
import { IoMdAdd } from 'react-icons/io';
import { useVideo } from '../../context/VideoContext';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../../context/SubscriptionContext';
import { useUserContext } from '../../context/UserContext';
import { IoEllipsisVertical, IoPencil, IoTrash } from 'react-icons/io5';
import Loader from '../loader/Loader';
import { FaSpinner } from 'react-icons/fa';
import { FaExclamationCircle } from 'react-icons/fa';

function Dashboard() {
  const { channelData, fetchUserDetails } = useUserContext();
  const { userVideos, fetchUserVideos, updateUserVideo, deleteUserVideo } = useVideo(); 
  const { subscriberCount, fetchSubscriber } = useSubscription();
  const [menuOpen, setMenuOpen] = useState(
    Array(userVideos.length).fill(false),
  );
  const menuRefs = useRef([]);
  const [pIndex, setPIndex] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  const [delLoading, setDelLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
  });
  const [newThumbnail, setNewThumbnail] = useState('');  
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const navigate = useNavigate();

  //* FETCHING USER VIDEOS,SUBSCRIBGER,DETAILS:
  const userId = localStorage.getItem('userId');
  useEffect(() => {
    setLoading(true);
    try {
      fetchUserDetails(userId);
      fetchSubscriber(userId, userId);
      fetchUserVideos();
    } catch (error) {
      console.log('Error while fetching user videos,subcount:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  //* Initialize menuRefs based on userVideos length
  useEffect(() => {
    menuRefs.current = userVideos.map(() => React.createRef());
  }, [userVideos]);

  //** TOGGLE MENU */
  const toggleMenu = (index) => {
    const updatedMenuOpen = [...menuOpen];
    updatedMenuOpen[index] = !updatedMenuOpen[index];
    setMenuOpen(updatedMenuOpen);
  };

  //* HANDLE EDIT VIDEO;
  const handleEdit = (index) => {
    setPIndex(index);
    setFormData({
      title: userVideos[index].title,
      description: userVideos[index].description,
      thumbnail: userVideos[index].thumbnail,
    }); // <-- Populate form data
    setShowEditPopup(true);
    console.log('hve:', index);
    console.log('Edit mode on');
  };

  //* HANDLE DELETE VIDEO;
  const handleDelete = async () => {
    console.log("delId:",userVideos[pIndex]._id);
    setDelLoading(true);
    try {
      await deleteUserVideo(userVideos[pIndex]._id);
      await fetchUserVideos();
    } catch (error) {
      console.log("Error while deleteig video!:",error);
    }finally{
      setDelLoading(false);
      setShowDeletePopup(false);

    }
  };

  //* Handle clicking outside the menu to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      menuRefs.current.forEach((menuRef, index) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setMenuOpen((prevMenuOpen) =>
            prevMenuOpen.map((isOpen, i) => (i === index ? false : isOpen)),
          );
        }
      });
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [menuOpen]);

  //*FOR DATE:
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  //! *********** EDIT VIDEOS ********* */
  //*HANDLE INPUT CHANGE:
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  //*HANDLE THUMBNAIL CHANGE:
  const handleThumbnailChange = (e) => {
    if (e.target.files[0]) {
      setFormData({
        ...formData,
        [e.target.name]: e.target.files[0],
      });
      setNewThumbnail(URL.createObjectURL(e.target.files[0]));
    }
  };

  //* HANDLE EDIT SUBMIT:
  const handleSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      await updateUserVideo(userVideos[pIndex]._id, formData);
      await fetchUserVideos();
      setShowEditPopup(false);
    } catch (error) {
      console.log('Error updating video:', error);
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div className="mx-14 my-3">
      <div className="w-full min-h-screen bg-gray-200 px-10 rounded-lg py-5">
        {/* TOP PART */}
        <div className="w-full flex items-center justify-between border-b-2 border-black py-10">
          {channelData.fullName ? (
            <h2 className="text-4xl font-bold text-gray-700">{`${
              channelData.fullName.split(' ')[0]
            }'s Dashboard`}</h2>
          ):(
            <h2>Dashboard</h2>
          )
        }
          <div className="flex items-center flex-col justify-center">
            <div className="w-16 h-16 bg-gray-300 rounded-full overflow-hidden mr-4">
              <img
                src={channelData.avatar}
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-gray-700 text-lg mt-2 font-bold -mb-4 bg-orange-400 px-4 py-2 rounded-md shadow-md">
              {subscriberCount[userId]}&nbsp;&nbsp;&nbsp;Subscribers
            </p>
          </div>
        </div>
        {/* BOTTOM PART */}
        <div className="w-full my-5">
          <div className="flex justify-between items-center px-5 bg-red-100 py-5 rounded-md shadow-lg">
            <h3 className="text-gray-700 text-xl font-bold">All Videos</h3>
            <div>
              <button 
              onClick={() => navigate('/dashboard/upload-video')} 
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-lg rounded-md hover:bg-red-600 transition-all duration-200 ease-in-out">
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
                  .map((video, index) => (
                    <div
                      key={video._id}
                      className="bg-white p-4 pr-6 rounded-lg shadow-md transition-transform transform hover:scale-100 hover:shadow-xl flex"
                    >
                      <div
                        onClick={() => navigate(`/video/${video._id}`)}
                        className="cursor-pointer w-1/3"
                      >
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-28 object-cover rounded-md border border-red-400"
                        />
                      </div>
                      <div className="flex flex-col ml-5 w-2/3 flex-wrap">
                        <h3 className="text-xl font-bold mb-2 text-gray-800 text-wrap">
                          {video.title.length > 25
                            ? `${video.title.substring(0, 25)}...`
                            : video.title}
                        </h3>
                        <p className="text-gray-700 text-wrap" >
                          {video.description.length > 40
                            ? `${video.description.substring(0, 40)}...`
                            : video.description}
                        </p>
                      </div>
                      {/* CREATED AT DATE */}
                      {
                        <div className="absolute bottom-4 right-4 text-gray-500 italic text-sm font-medium">
                          <p>{formatDate(video.createdAt)}</p>
                        </div>
                      }
                      {/* UPDATE AND DELETE POPUP */}
                      <div
                        className="relative z-5"
                        ref={menuRefs.current[index]}
                      >
                        <button
                          onClick={() => toggleMenu(index)}
                          className="absolute top-0 -right-4 text-gray-500"
                        >
                          <IoEllipsisVertical
                            size={25}
                            className="hover:bg-gray-200 rounded-full px-1 py-1"
                          />
                        </button>
                        {menuOpen[index] && (
                          <div className="absolute top-6 right-0 bg-gray-100 shadow-md rounded-md p-2">
                            <button
                              className="w-full flex items-center gap-1 text-gray-700 hover:bg-gray-200 p-1 rounded"
                              onClick={() => handleEdit(index)}
                            >
                              <IoPencil size={16} />
                              <span>Edit</span>
                            </button>
                            <button
                              className="w-full flex items-center gap-1 text-gray-700 hover:bg-gray-200 p-1 rounded"
                              onClick={() => {setShowDeletePopup(true); setPIndex(index)}}
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
        {/* SHOW EDIT POPUP */}
        {showEditPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-5/12 relative">
              <h2 className="text-xl font-bold mb-4">Edit Video</h2>
              <form onSubmit={handleSubmit}>
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="title"
                >
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border rounded-md shadow-sm bg-slate-100"
                />
                <label
                  className="block text-sm font-medium text-gray-700 mt-4"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border rounded-md shadow-sm min-h-20 max-h-52 bg-slate-100"
                  style={{ minHeight: '100px' }}
                  rows={5}
                />

                <label
                  className="block text-sm font-medium text-gray-700 mt-4"
                  htmlFor="thumbnail"
                >
                  Thumbnail <br></br>
                  <p className="italic text-gray-400">
                    (click on image to update)
                  </p>
                </label>
                <div className="mb-5 w-full flex items-center justify-center flex-col">
                  <div
                    className="w-48 h-28  border-2 border-gray-300 cursor-pointer overflow-hidden relative bg-center bg-cover"
                    style={{
                      backgroundImage: newThumbnail
                        ? `url(${newThumbnail})`
                        : `url(${formData.thumbnail})`,
                    }}
                    onClick={() =>
                      document.getElementById('thumbnailInput').click()
                    }
                  >
                    <input
                      type="file"
                      id="thumbnailInput"
                      name="thumbnail"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="absolute mt-4 right-8 bottom-8 flex justify-center">
                  <button
                    onClick={() => setShowEditPopup(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 text-white rounded-md shadow-md w-20 flex items-center justify-center"
                    disabled={editLoading}
                  >
                    {editLoading ? (
                      <FaSpinner className="animate-spin text-xl" />
                    ) : (
                      'Save'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* SHOW DELETE POPUP */}
        {showDeletePopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="w-full flex items-center justify-center">
                <FaExclamationCircle className="w-14 h-14 text-red-700 text-center mb-4" />
              </div>
              <h2 className="text-xl font-bold mb-4 text-center">
                Delete Video!
              </h2>
              <p className="mb-4 text-center">
                Are you sure you want to delete this video.
              </p>
              <div className="flex justify-center mt-5">
                <button
                  onClick={() => setShowDeletePopup(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md w-20 flex items-center justify-center"
                  disabled={editLoading}
                >
                  {delLoading ? (
                    <FaSpinner className="animate-spin text-xl" />
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
