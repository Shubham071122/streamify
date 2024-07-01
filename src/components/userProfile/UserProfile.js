import React, { useEffect } from 'react'
import { useUserContext } from '../../context/UserContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { useVideo } from '../../context/VideoContext';
import { useNavigate } from 'react-router-dom';

function UserProfile() {
    const {channelData,fetchUserDetails} = useUserContext();
    const { subscriberCount,fetchSubscriber } = useSubscription();
    const {userVideos, fetchUserVideos} = useVideo();
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    useEffect(() => {
        fetchUserDetails(userId);
        fetchSubscriber(userId,userId);
        fetchUserVideos();
    },[userId])
  return (
    <div className='mx-14 my-3'>
        <div className='w-full min-h-screen bg-gray-100 rounded-lg p-5'>
            <div className="w-full border-b mb-8 flex items-center gap-10 p-5 px-20 pt-10 ">
              <div className="rounded-full border-2 border-red-500">
                <img
                  src={channelData.avatar}
                  alt="avatar"
                  className="w-36 h-36 rounded-full object-cover"
                />
              </div>
              <div>
                <p className="text-xl font-semibold">{channelData.fullName}</p>
                <p className="text-lg font-semibold text-gray-700">{subscriberCount[userId]} <span>subscribers</span></p>
              </div>
            </div>
            <div className="w-full flex flex-col">
                {userVideos
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((video, index) => (
                    <div
                      key={video._id}
                      className="bg-gray-200 p-4 pr-6 rounded-lg shadow-md transition-transform transform flex mb-4"
                    >
                      <div
                        onClick={() => navigate(`/video/${video._id}`)}
                        className="cursor-pointer w-1/3"
                      >
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-40 object-cover rounded-md border border-red-400"
                        />
                      </div>
                      <div className="flex flex-col ml-5 w-2/3 flex-wrap mt-5 ml-4">
                        <h3 className="text-xl font-bold mb-2 text-gray-800 text-wrap">
                          {video.title.length > 100
                            ? `${video.title.substring(0, 100)}...`
                            : video.title}
                        </h3>
                        <p className="text-gray-700 text-wrap" >
                          {video.description.length > 100
                            ? `${video.description.substring(0, 100)}...`
                            : video.description}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
        </div>
    </div>
  )
}

export default UserProfile