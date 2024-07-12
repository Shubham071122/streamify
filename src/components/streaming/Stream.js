import React, { useEffect, useState } from 'react';
import VideoPlayer from './VideoPlayer';
import Comment from './Comment';
import Description from './Description';
import { useParams } from 'react-router-dom';
import { usePlaylist } from '../../context/PlaylistContext';
import { RxCross2 } from 'react-icons/rx';
import './Stream.css';
import { FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';
import SharePopup from './SharePopup';

function Stream() {
  const { videoId } = useParams();
  const [addLoading, setAddLoading] = useState(false);
  const [showAddPlaylistPopup, setShowAddPlaylistPopup] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [showCreatPlylistPopup, setShowCreatePlaylistPopup] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [playlistData, setPlaylistData] = useState({
    title: '',
    description: '',
  });
  const {
    createLoading,
    playlists,
    addVideoInPlaylist,
    fetchPlaylists,
    createPlaylist,
  } = usePlaylist();

  useEffect(() => {
    fetchPlaylists();
  }, []);

  //*GETINHG DATA OF USER CLICK ON PLAYLIST ICON FROM VIDEOPLAYER:
  const handleTogglePopup = (value) => {
    setShowAddPlaylistPopup(value);
  };

  const handleOpenSharePopup = () => {
    setShowSharePopup(true);
  };

  
  const handlePlaylistSelect = (playlistId) => {
    // console.log(`Selected Playlist ID: ${playlistId}`);
    setSelectedPlaylistId(playlistId);
  };

  // console.log("selectedPlaylistId:",selectedPlaylistId);
  const handleClose = () => {
    setSelectedPlaylistId(null);
    setShowAddPlaylistPopup(false);
    setShowSharePopup(false);
  }
  //*HANDLE CLICK:
  const handleAddClick = async () => {
    if (!selectedPlaylistId) {
      toast.error('Select a Playlist or Create new!');
      return;
    }
    setAddLoading(true);
    // console.log("videOOOOid:",videoId);
    // console.log("selectedPlaylistId:",selectedPlaylistId);
    try {
      await addVideoInPlaylist(videoId, selectedPlaylistId);
    } catch (error) {
      console.log('Error while handle click on  playlist:', error);
    } finally {
      setAddLoading(false);
      setShowAddPlaylistPopup(false);
      setSelectedPlaylistId(null);
    }
  };

  //***CREATING NEW PLAYLIST:
  //*HANDLE INPUT CHANGE:
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlaylistData((prevData) => ({ ...prevData, [name]: value }));
  };

  //* HANDLE SUBMIT:
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPlaylist(playlistData.title, playlistData.description);
    } catch (error) {
      console.log('Error while submiting create playlist:', error);
    } finally {
      setShowCreatePlaylistPopup(false);
      setPlaylistData({
        title: '',
        description: '',
      });
    }
  };

  return (
    <div className="w-full h-screen p-10 flex justify-between">
      <div className="w-full">
        <VideoPlayer
          videoId={videoId}
          onTogglePopup={handleTogglePopup}
          handleOpenSharePopup={handleOpenSharePopup}
        />
        <Description />
      </div>
      <div>
        <Comment videoId={videoId} />
      </div>

      {/* SHOW ADD PLAYLIST POPUP */}
      {showAddPlaylistPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 top-16">
          <div className="bg-white py-8 px-4 rounded-lg shadow-lg w-3/12 h-5/6 flex flex-col ">
            <div className="w-full flex justify-between items-center  mb-6">
              <h2 className="text-xl font-bold">Add to Playlist</h2>
              <button
                onClick={handleClose}
                className=" p-2 hover:bg-gray-300 rounded-full z-10"
              >
                <RxCross2 className="text-lg font-bold" />
              </button>
            </div>
            <div className="flex-1 border border-gray-300 rounded-lg overflow-y-auto p-4 bg-gray-50 scrollbar">
              <div className="flex flex-col gap-6">
                {
                playlists.length > 0 ? (
                playlists
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((playlist) => (
                    <div
                      key={playlist._id}
                      className={`p-4 rounded-lg shadow-md cursor-pointer w-full transition-colors ${
                        selectedPlaylistId === playlist._id
                          ? 'bg-red-100'
                          : 'bg-white hover:bg-gray-100'
                      }`}
                      onClick={() => handlePlaylistSelect(playlist._id)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-base font-bold capitalize w-11/12">
                          {playlist.name.length > 30
                            ? `${playlist.name.substring(0, 30)}...`
                            : playlist.name}
                        </h3>
                      </div>
                      <p className="text-gray-700">
                        {playlist.description.length > 30
                          ? `${playlist.description.substring(0, 30)}...`
                          : playlist.description}
                      </p>
                    </div>
                  ))
                ):(
                  <div className='w-full flex items-center justify-center'> 
                    <p className="text-center font-bold text-lg text-gray-500">No playlist found!</p>
                  </div>
                )
              }
              </div>
            </div>
            <div className="w-full flex items-center justify-end gap-4 ">
              <button
                onClick={() => setShowCreatePlaylistPopup(true)}
                className="mt-4 py-2 px-4 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-500 transition-colors"
              >
                Create new
              </button>
              <button
                className="mt-4 w-32  py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-500 transition-colors flex items-center justify-center"
                onClick={handleAddClick}
                // disabled={!selectedPlaylistId}
              >
                {addLoading ? (
                  <FaSpinner className="animate-spin text-2xl" />
                ) : (
                  'Add to Playlist'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SHOWING CREATE POPUP */}
      {showCreatPlylistPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-8 rounded-lg shadow-lg w-5/12 h-4/6 relative">
            <h2 className="text-xl font-bold mb-4">Create new Playlist</h2>
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
                value={playlistData.title}
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
                value={playlistData.description}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border rounded-md shadow-sm min-h-28 max-h-52 bg-slate-100"
                style={{ minHeight: '100px' }}
                rows={5}
              />
              <div className="absolute mt-4 right-8 bottom-8 flex items-center justify-center">
                <button
                  onClick={() => setShowCreatePlaylistPopup(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-md shadow-md w-20 flex items-center justify-center"
                  disabled={createLoading}
                >
                  {createLoading ? (
                    <FaSpinner className="animate-spin text-2xl" />
                  ) : (
                    'Create'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* SHOWING SHARE POPUP */}
      {<SharePopup showSharePopup={showSharePopup} handleClose={handleClose} />}
    </div>
  );
}

export default Stream;
