import React, { useEffect } from 'react';
import { useSubscription } from '../../context/SubscriptionContext';
import ChannelDetail from './ChannelDetail';

function Subscription() {
  const { subscribedChannels, fetchSubscribedChannels } = useSubscription([]);

  useEffect(() => {
    const currentUserId = localStorage.getItem('userId');
    fetchSubscribedChannels(currentUserId);
  }, []);

  if (subscribedChannels.length < 1) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-2xl font-semibold text-gray-500">No channel found!</p>
      </div>
    );
  }

  return (
    <div className='mx-14 my-5'>
    <div className="w-full min-h-screen p-10 bg-white rounded-lg">
      {subscribedChannels &&
        subscribedChannels.map((channel) => (
          <ChannelDetail key={channel._id} channel={channel} />
        ))}
    </div>
    </div>
  );
}

export default Subscription;
