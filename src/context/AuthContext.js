//! ************** THIS A WAY TO STORE TOKEN DIRECTLY IN LOCAL STORAGE AND THATS IT. ************* */
import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
// import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state
  const [userData, setUserData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/users/check-auth`,
          { withCredentials: true },
        );
        // console.log('Check auth: ', response);
        if (response.status === 200) {
          setIsAuthenticated(true);
          setUserData(response.data?.user);
          localStorage.setItem('userId', response.data?.user._id);
          setLoading(false); // Set loading to false after checking token
        } else {
          navigate('/');
          setLoading(false);
        }
      } catch (error) {
        navigate('/');
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  //* LOGIN
  const login = async (credentials) => {
    try {
      // console.log('Process:', process.env.REACT_APP_SERVER_URL);
      // console.log('credentials:', credentials);
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/users/login`,
        credentials,
        { withCredentials: true },
      );

      if (response.status === 200) {
        setUserData(response.data?.data.user);
        localStorage.setItem('userId', response.data?.data.user._id);
        setIsAuthenticated(true);
        setLoading(false);
      }

      // console.log('Data user: ', response);
      // localStorage.setItem('token', data.accessToken);
      return response;
    } catch (error) {
      console.error('Error logging in: ', error);
      setLoading(false);
      throw error;
    }
  };

  //* REGISTER
  const register = async (formData) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/users/register`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      // console.log('Register successful:', response);
      return response;
    } catch (error) {
      console.log('Error during registration', error);
    }
  };

  //* LOGOUT
  const logout = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/users/logout`,
        {},
        {
          withCredentials: true,
        },
      );
      if (response.status === 200) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setIsAuthenticated(false);
        toast.success('Logout successfully!');
      }
      return response;
    } catch (error) {
      console.log('Error during logout: ', error);
      toast.error('Error while logout!');
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, register, logout, loading, userData }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
