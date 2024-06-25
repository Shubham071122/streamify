import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { UserProvider } from './context/UserContext';
import { VideoProvider } from './context/VideoContext';
import { Toaster } from 'react-hot-toast';
import { PlaylistProvider } from './context/PlaylistContext';
import { LikeProvider } from './context/LikeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <UserProvider>
        <PlaylistProvider>
          <VideoProvider>
            <LikeProvider>
              <SubscriptionProvider>
                <App />
                <Toaster />
              </SubscriptionProvider>
            </LikeProvider>
          </VideoProvider>
        </PlaylistProvider>
    </UserProvider>
  </AuthProvider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
