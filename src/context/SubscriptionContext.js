import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const [subscriberCount, setSubscriberCount] = useState({});
  const [isSubscribed, setIsSubscribed] = useState({});
  const [buttonClicked, setButtonClicked] = useState(false);
  const [subscribedChannels,setSubscribedChannels] = useState([]);

  //*GETTING SUBSCRIBER COUNT:
  const fetchSubscriber = async (channelId,currentUserId) => {
    const token = localStorage.getItem('token');
    // console.log("token:",token);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/subscriptions/c/${channelId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      // console.log('Subscriber:', response);
      // Set the subscriber count in the state
      if (response.data && response.data.data) {
        setSubscriberCount((prevCounts) => ({
          ...prevCounts,
          [channelId]: response.data.data.length, // Ensure you're setting the correct count
        }));
      }

      //Checking if the current user is subscribed
      const isAlreadySubscribed = response.data.data.some(
        (sub) => sub.subscriber === currentUserId && sub.channel === channelId,
      );
      // console.log('isAlreadySubscribed:', isAlreadySubscribed);
      setIsSubscribed((prevIsSubscribed) => ({
        ...prevIsSubscribed,
        [channelId]: isAlreadySubscribed,
      }));
    } catch (error) {
      console.log('Error while fetching subscriber:', error);
    }
  };

  //* TOGGLE SUBSCRIBER
  const toggleSubscription = async (channelId) => {
    const token = localStorage.getItem('token');

    // console.log('token:', token);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/subscriptions/c/${channelId}`,
        {}, // Empty body for the POST request
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      // console.log('subscribed:', response);
      // Toggle the subscription state
      setIsSubscribed((prevIsSubscribed) => {
        const newIsSubscribed = !prevIsSubscribed[channelId];
        
        // Update the subscriber count
        setSubscriberCount((prevCount) => ({
          ...prevCount,
          [channelId]: newIsSubscribed
            ? prevCount[channelId] + 1
            : prevCount[channelId] - 1,
        }));
        
        return {
          ...prevIsSubscribed,
          [channelId]: newIsSubscribed,
        };
      });

      setButtonClicked(true);// Hanling ui of button
      setTimeout(() => setButtonClicked(false), 1000); // Remove class after animation
    } catch (error) {
      console.log('Error while toggle subscription:', error);
    }
  };

  //* GETTING SUBSCRIBED CHANNELS LIST:
  const fetchSubscribedChannels = async(currentUserId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/subscriptions/u/${currentUserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      // console.log("Channels res:",response);
      // Set the channels in the state
      if (response.data && response.data.data) {
        setSubscribedChannels(response.data.data);
      }
    } catch (error) {
      console.log("Error while fetching channels:",error);
    }
  }

  return (
    <SubscriptionContext.Provider
      value={{
        subscribedChannels,
        subscriberCount,
        isSubscribed,
        buttonClicked,
        fetchSubscriber,
        toggleSubscription,
        fetchSubscribedChannels
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => useContext(SubscriptionContext);
