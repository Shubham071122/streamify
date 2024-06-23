import React, { useState } from 'react';
import VideoPlayer from './VideoPlayer';
import Comment from './Comment';
import Description from './Description';
import { useParams } from 'react-router-dom';
import { usePlaylist } from '../../context/PlaylistContext';
import { RxCross2 } from 'react-icons/rx';
import './Stream.css';
import { FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

function Stream() {
  const { videoId } = useParams();
  const [addLoading,setAddLoading] = useState(false);
  const [showAddPlaylistPopup, setShowAddPlaylistPopup] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const { playlists,addVideoInPlaylist } = usePlaylist();

  //*GETINHG DATA OF USER CLICK ON PLAYLIST ICON FROM VIDEOPLAYER:
  const handleTogglePopup = (value) => {
    setShowAddPlaylistPopup(value);
  };

  const handlePlaylistSelect = (playlistId) => {
    setSelectedPlaylistId(playlistId);
  };
  //*HANDLE CLICK:
  const handleAddClick = async() => {
    if (!selectedPlaylistId) {
      toast.error("Select a Playlist or Create new!");
      return;
    }
    setAddLoading(true);
    try {
      await addVideoInPlaylist(videoId,selectedPlaylistId);
      
    } catch (error) {
      console.log("Error while handle click on  playlist:",error);
    }finally{
      setAddLoading(false);
      setShowAddPlaylistPopup(false);
      setSelectedPlaylistId(null);
    }
  };

  console.log('playlifsfs:', playlists);

  return (
    <div className="w-full h-screen p-10 flex justify-between">
      <div className="w-full">
        <VideoPlayer videoId={videoId} onTogglePopup={handleTogglePopup} />
        <Description />
      </div>
      <div>
        <Comment videoId={videoId} />
      </div>

      {/* SHOW ADD PLAYLIST POPUP */}
      {showAddPlaylistPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 top-16">
          <div className="bg-white py-8 px-2 rounded-lg shadow-lg w-3/12 h-5/6 flex flex-col relative">
            <div className="w-full">
              <h2 className="text-xl font-bold mb-6 text-center">
                Add to Playlist
              </h2>
              <button
                onClick={() => setShowAddPlaylistPopup(false)}
                className="absolute right-3 top-3 p-2 hover:bg-gray-300 rounded-full z-10"
              >
                <RxCross2 className="text-lg font-bold" />
              </button>
            </div>
            <div className="flex-1 border border-gray-300 rounded-lg overflow-y-auto p-4 bg-gray-50 scrollbar">
              <div className="flex flex-col gap-6">
                {playlists
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((playlist) => (
                    <div
                      key={playlist._id}
                      className={`bg-white p-4 rounded-lg shadow-md cursor-pointer w-full transition-colors ${
                        selectedPlaylistId === playlist._id
                          ? 'bg-red-200'
                          : 'hover:bg-gray-100'
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
                  ))}
              </div>
            </div>
            <div className='w-full flex items-center justify-end gap-4 '> 
            <button
              className="mt-4 py-2 px-4 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-500 transition-colors"
              disabled={!selectedPlaylistId}
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
    </div>
  );
}

export default Stream;
