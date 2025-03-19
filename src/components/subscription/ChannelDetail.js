import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './ChannelDetail.css';
import axios from 'axios';
import { useSubscription } from '../../context/SubscriptionContext';
import Loader from '../loader/Loader';

function ChannelDetail({ channel }) {
  const [channelData, setChannelData] = useState({ avatar: '', fullName: '' });
  const [loading, setLoading] = useState(true);
  const { subscriberCount, fetchSubscriber } = useSubscription();
  const userId = channel.channel; // taking name userId insted of channelId for backend match.
  const currentUserId = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserDetails = async (userId) => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/users/${userId}`,
          {
            withCredentials: true,
          },
        );
        // console.log('CHA RSP:', response);
        setChannelData(response.data.data);
      } catch (error) {
        console.log('Error fetching user details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserDetails(userId);
      let channelId = userId;
      fetchSubscriber(channelId, currentUserId);
    }
    // console.log('subscriberCount:', subscriberCount);
  }, [userId,currentUserId]);
// console.log("sub count:",subscriberCount);
  return (
    <div className='w-full'>
      {loading ? (
        <Loader />
      ) : (
        <div className="w-full">
          <NavLink to={`user/${userId}`}>
            <div className="w-full border rounded-2xl mb-8 flex items-center gap-10 p-5 back  shadow-md">
              <div className="rounded-full border-2 border-red-500">
                <img
                  src={channelData.avatar}
                  alt="avatar"
                  className="w-36 h-36 rounded-full object-cover"
                />
              </div>
              <div>
                <p className="text-xl font-semibold">{channelData.fullName}</p>
                <p className="text-lg font-semibold text-gray-200">{subscriberCount[userId]} <span>subscribers</span></p>
              </div>
            </div>
          </NavLink>
          <div className="w-8/12 h-[0.5px] bg-gray-500 mb-8 mx-auto"></div>
        </div>
      )}
    </div>
  );
}

export default ChannelDetail;
