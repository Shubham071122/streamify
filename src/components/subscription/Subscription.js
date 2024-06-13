import React, { useEffect } from 'react';
import { useSubscription } from '../../context/SubscriptionContext';
import ChannelDetail from './ChannelDetail';

function Subscription() {
  const { subscribedChannels, fetchSubscribedChannels } = useSubscription();

  useEffect(() => {
    const currentUserId = localStorage.getItem('userId');
    fetchSubscribedChannels(currentUserId);
  }, []);

  if (!subscribedChannels) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-white">
        <p className="text-xl font-semibold">No channel found!</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen p-10">
      {subscribedChannels &&
        subscribedChannels.map((channel) => (
          <ChannelDetail key={channel._id} channel={channel} />
        ))}
    </div>
  );
}

export default Subscription;
