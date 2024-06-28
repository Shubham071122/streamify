import './UploadVideo.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FaSpinner, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { RiUploadCloud2Fill } from "react-icons/ri";

function UploadVideo() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    video: '',
  });
  const [newThumbnail, setNewThumbnail] = useState(null);
  const [newVideo, setNewVideo] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [thumbErrorMessage, setThumbErrorMessage] = useState('');
  const [vidErrorMessage, setVidErrorMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      if (name === 'thumbnail') {
        if (file?.size > 2 * 1024 * 1024) {
          setThumbErrorMessage('Thumbnail size should be less than 2MB');
        } else {
          setNewThumbnail(URL.createObjectURL(file));
          setFormData((prevData) => ({ ...prevData, thumbnail: file }));
          setErrorMessage('');
        }
      } else if (name === 'video') {
        if (file?.size > 8 * 1024 * 1024) {
          setVidErrorMessage('Video size should be less than 8MB');
        } else {
          setNewVideo(URL.createObjectURL(file));
          setFormData((prevData) => ({ ...prevData, video: file }));
          setErrorMessage('');
        }
      }
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);

    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/videos/publish`,
        {
          title: formData.title,
          description: formData.description,
          thumbnail: formData.thumbnail,
          video: formData.video,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          }
        }
      )
      if (response.data && response.data.data) {
        console.log("PublishdUserVideo:", response);
        setShowConfetti(true); // Show the confetti
        toast.success("Video published successfully!");
      }
      setTimeout(() => setShowConfetti(false), 3000); // Hide the confetti after 3 seconds
    } catch (error) {
      console.log("Error while publishing video:", error);
      toast.error("Something went wrong!");
    } finally {
      setFormData({
        title: "",
        description: "",
        thumbnail: "",
        video: "",
      });
      setNewThumbnail(false);
      setNewVideo(false);
      setEditLoading(false);
    }
  };

  const handleRemoveVideo = () => {
    setNewVideo(null);
    setFormData((prevData) => ({ ...prevData, video: '' }));
  };

  useEffect(() => {
    if (showConfetti) {
      // Generate multiple confetti elements
      for (let i = 0; i < 100; i++) {
        createConfetti(i);
      }
    }
  }, [showConfetti]);

  const createConfetti = (index) => {
    const confetti = document.createElement('div');
    confetti.className = 'confetti show';
    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.backgroundColor = getRandomColor();
    confetti.style.animationDelay = `${Math.random() * 3}s`;
    document.body.appendChild(confetti);

    // Remove confetti after animation
    setTimeout(() => {
      confetti.remove();
    }, 3000);
  };

  const getRandomColor = () => {
    const colors = ['red', 'blue', 'green', 'yellow', 'orange', 'pink', 'purple'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <>
      <div className="my-3 mx-14">
        <div className="flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-8/12 relative">
            <h2 className="text-xl font-bold mb-4">Upload new Video</h2>
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
                Thumbnail <br />
                <p className="italic text-gray-400">(click on box to insert)</p>
              </label>
              <div className="mb-5 w-full flex items-center justify-center flex-col">
                <div
                  className="w-64 h-44 border-2 border-gray-300 rounded-lg cursor-pointer overflow-hidden relative bg-center bg-cover"
                  style={{
                    backgroundImage: newThumbnail
                      ? `url(${newThumbnail})`
                      : `url(${formData.thumbnail})`,
                  }}
                  onClick={() => document.getElementById('thumbnailInput').click()}
                >
                  <input
                    type="file"
                    id="thumbnailInput"
                    name="thumbnail"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="hidden"
                  />
                </div>
              </div>
              {thumbErrorMessage && (
                <div className="text-red-500 text-sm mb-4 text-center italic">{thumbErrorMessage}</div>
              )}

              <label
                className="block text-sm font-medium text-gray-700 mt-4"
                htmlFor="video"
              >
                Video <br />
                <p className="italic text-gray-400">(click on box to insert)</p>
              </label>
              <div className="mb-5 w-full flex items-center justify-center flex-col">
                <div
                  className="w-96 h-60 border-2 border-gray-300 rounded-lg cursor-pointer overflow-hidden relative bg-center bg-cover"
                  onClick={() => document.getElementById('videoInput').click()}
                >
                  <input
                    type="file"
                    id="videoInput"
                    name="video"
                    accept="video/*"
                    onChange={handleInputChange}
                    className="hidden"
                  />
                  {newVideo && (
                    <>
                      <video
                        src={newVideo}
                        controls
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
                        onClick={handleRemoveVideo}
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {vidErrorMessage && (
                <div className="text-red-500 text-sm mb-4 text-center italic">{vidErrorMessage}</div>
              )}
              {errorMessage && (
                <div className="text-red-500 text-sm mb-4 text-center italic">{errorMessage}</div>
              )}

              <div className="absolute mt-4 right-8 bottom-8 flex justify-center">
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-md shadow-md w-26 flex items-center justify-center"
                  disabled={editLoading}
                >
                  {editLoading ? (
                    'Publishing...'
                  ) : (
                    <p className='flex items-center gap-2'>Publish<RiUploadCloud2Fill className='text-lg'/></p>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default UploadVideo;
