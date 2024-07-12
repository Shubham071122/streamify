import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faWhatsapp,
  faInstagram,
  faLinkedin,
  faFacebook,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { RxCross2 } from 'react-icons/rx';

const SharePopup = ({ showSharePopup, handleClose }) => {

    const handleShare = async (platform) => {
        const urlToShare = window.location.href;
    
        try {
          if (platform === 'whatsapp') {
            if (navigator.share) {
              await navigator.share({
                title: 'Check out this link',
                text: 'Here is the link you requested',
                url: urlToShare,
              });
            } else {
              const whatsappMessage = `Check out this link: ${urlToShare}`;
              const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
                whatsappMessage
              )}`;
              window.open(whatsappUrl, '_blank');
            }
          } else {
            // Handle other platforms like email, Instagram, LinkedIn, etc.
            // console.log('Sharing via:', platform);
          }
        } catch (error) {
          console.error('Error sharing:', error);
        }
      };


  return (
    showSharePopup && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
        <div className="bg-white py-8 px-4 rounded-lg shadow-lg w-5/12 h-auto relative">
          <div className="w-full flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Share with</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-300 rounded-full z-10"
            >
              <RxCross2 className="text-lg font-bold" />
            </button>
          </div>
          <div className="bg-gray-100 rounded-lg shadow-md">
            <div className="flex justify-around items-center gap-5  px-6 py-8">
              <button 
              onClick={() => handleShare('whatsapp')}
              className="flex flex-col items-center hover:text-green-500 transition-all">
                <FontAwesomeIcon icon={faWhatsapp} size="2x" />
                <span className="mt-2">WhatsApp</span>
              </button>
              <button className="flex flex-col items-center hover:text-blue-500 transition-all">
                <FontAwesomeIcon icon={faEnvelope} size="2x" />
                <span className="mt-2">Email</span>
              </button>
              <button className="flex flex-col items-center hover:text-pink-500 transition-all">
                <FontAwesomeIcon icon={faInstagram} size="2x" />
                <span className="mt-2">Instagram</span>
              </button>
              <button className="flex flex-col items-center hover:text-blue-700 transition-all">
                <FontAwesomeIcon icon={faLinkedin} size="2x" />
                <span className="mt-2">LinkedIn</span>
              </button>
              <button className="flex flex-col items-center hover:text-blue-600 transition-all">
                <FontAwesomeIcon icon={faFacebook} size="2x" />
                <span className="mt-2">Facebook</span>
              </button>
              <button className="flex flex-col items-center hover:text-blue-400 transition-all">
                <FontAwesomeIcon icon={faTwitter} size="2x" />
                <span className="mt-2">Twitter</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default SharePopup;
