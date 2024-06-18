import './App.css';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NoPage from './pages/NoPage';
import LandingPage from "./pages/LandingPage";
import PrivateRoute from './components/PrivateRoute';
import  AuthContext from './context/AuthContext';
import { useContext } from 'react';
// import HomePage from './pages/home/HomePage';
import Subscription from './components/subscription/Subscription';
import Dashboard from './components/dashboard/Dashboard';
import Playlist from './components/playlist/Playlist';
import About from './components/about/About';
import Home from './components/home/Home';
import Layout from './components/layout/Layout';
import WatchHistory from './components/watchHistory/WatchHistory';
import Stream from "./components/streaming/Stream";
import Profile from './components/profile/Profile';
import ForgotPassword from './auth/ForgotPassword';
import ResetPassword from './auth/ResetPassword';

function App() {
  const { isAuthenticated } = useContext(AuthContext);

  const ProtectedRoutes = () => (
    <PrivateRoute>
      <Layout/>
    </PrivateRoute>
  )

  return (
    <>
      <Router>
        <Routes>
          {/* Unprotected Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected Routes */}
          {!isAuthenticated ? (
            <Route path="/" element={<LandingPage />} />
          ) : (
            <Route path="/" element={<ProtectedRoutes />}>
              <Route index element={<Home />} />
              <Route path="video/:videoId" element={<Stream />} />
              <Route path="profile" element={<Profile />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="subscription" element={<Subscription />} />
              <Route path="playlist" element={<Playlist />} />
              <Route path="watch-history" element={<WatchHistory />} />
              <Route path="about" element={<About />} />
              <Route path="user/:userId"/>
            </Route>
          )}
          <Route path="*" element={<NoPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
