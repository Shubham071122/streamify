import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './ChannelDetail.css';
import axios from 'axios';
import { useSubscription } from '../../context/SubscriptionContext';

function ChannelDetail({ channel }) {
  const [channelData, setChannelData] = useState({ avatar: '', fullName: '' });
  const {subscriberCount,fetchSubscriber } = useSubscription();
  const userId = channel.channel;// taking name userId insted of channelId for backend match.
  const currentUserId = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserDetails = async (userId) => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log("CHA RSP:",response);
        setChannelData(response.data.data);
      } catch (error) {
        console.log("Error fetching user details:",error);
      }
    };

    if(userId){
        fetchUserDetails(userId);
        let channelId = userId;
        fetchSubscriber(channelId,currentUserId)
    }
    console.log("subscriberCount:",subscriberCount)

  },[userId]);

  return (
    <div className="w-full">
      <NavLink to={`user/${userId}`}>
        <div className="w-full p-5 bg-gray-100 border rounded-2xl mb-8 flex items-center gap-10 b back">
          <div className="rounded-full border-2 border-red-500">
            <img
              src={channelData.avatar}
              alt="avatar"
              width={100}
              className="rounded-full"
            />
          </div>
          <div>
            <p className="text-xl font-semibold">{channelData.fullName}</p>
            <p>{subscriberCount[userId]}</p>
          </div>
        </div>
      </NavLink>
      <div className="w-8/12 h-[0.5px] bg-gray-500 mb-8 mx-auto"></div>
    </div>
  );
}

export default ChannelDetail;
