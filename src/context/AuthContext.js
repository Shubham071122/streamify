
//! ************** THIS A WAY TO STORE TOKEN DIRECTLY IN LOCAL STORAGE AND THATS IT. ************* */
import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
// import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    // console.log('Token read from localStorage:', token);

    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false); // Set loading to false after checking token
  }, []);

  //* LOGIN
  const login = async (credentials) => {
    try {
      // console.log('Process:', process.env.REACT_APP_SERVER_URL);
      // console.log('credentials:', credentials);
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/users/login`,
        credentials,
      );

      const data = response.data.data;

      // console.log('Data user: ', data.user);
      localStorage.setItem('userId', data.user._id);
      localStorage.setItem('token', data.accessToken);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error logging in: ', error);
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
      // console.log('Register successful:', response.data);
    } catch (error) {
      console.log('Error during registration', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
    toast.success('LogOut successfully!');
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, register, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

//! ************** THIS A WAY TO STORE TOKEN DIRECTLY IN MEMORY AND CALL REFRESHACCESSTOKEN WHEN THE TOKEN GOT NULL:. ************* */
// import React, {
//   createContext,
//   useEffect,
//   useLayoutEffect,
//   useState,
// } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [token, setToken] = useState();

//   useEffect(() => {
//     if (token) {
//       setToken(token);
//       setIsAuthenticated(true);
//     }

//     setLoading(false);
//   }, []);

//   const login = async (credentials) => {
//     console.log('crd:', credentials);
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_SERVER_URL}/users/login`,
//         credentials,
//         { withCredentials: true },
//       );
//       console.log('RESLogin:', response);
//       const { accessToken } = response.data.data;
//       setToken(accessToken);
//       localStorage.setItem("token",accessToken);
//       setIsAuthenticated(true);
//     } catch (err) {
//       console.log('Error login:', err);
//       setToken(null);
//       // throw err;
//     }
//   };

//   console.log('Tokeenn:', token);

//   const register = async (formData) => {
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_SERVER_URL}/users/register`,
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         },
//       );

//       console.log('Register successful:', response.data);
//       toast.success('Registered successfully!');
//     } catch (error) {
//       console.error('Error during registration', error);
//       throw error;
//     }
//   };

//   const logout = async () => {
//     try {
//       await axios.post(
//         `${process.env.REACT_APP_SERVER_URL}/users/logout`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       );
//       setToken(null);
//       setIsAuthenticated(false);
//       toast.success('Logged out successfully!');
//     } catch (error) {
//       console.log('Error while logout:', error);
//       toast.error('Something went wrong!');
//     }
//   };

//   // Example: Set up Axios interceptor to automatically refresh token on 401 responses
//   useLayoutEffect(() => {
//     const authInterceptor = axios.interceptors.request.use((config) => {
//       config.headers.Authorization =
//         !config._retry && token
//           ? `Bearer ${token}`
//           : config.headers.Authorization;
//       return config;
//     });

//     return () => {
//       axios.interceptors.request.eject(authInterceptor);
//     };
//   }, [token]);

//   useLayoutEffect(() => {
//     const refreshInterceptor = axios.interceptors.response.use(
//       async (res) => {
//         const originalRequest = res.config;
//         console.log('resRFFF:', res.status);
//         if (res.status === 401) {
//           try {
//             const response = await axios.post(
//               `${process.env.REACT_APP_SERVER_URL}/users/refresh-token`,
//               {},
//               { withCredentials: true },
//             );

//             setToken(response.data.data.accessToken);
//             setIsAuthenticated(true);
//             originalRequest.headers.Authorization = `Bearer ${response.data.data.accessToken}`;
//             originalRequest._retry = true;

//             return axios(originalRequest);
//           } catch (error) {
//             console.log('Error while getting new accessToken:', error);
//             setToken(null);
//           }
//         }
//         return res;
//       },
//       (error) => {
//         return Promise.reject(error);
//       },
//     );

//     return () => {
//       axios.interceptors.response.eject(refreshInterceptor);
//     };
//   }, []);

//   return (
//     <AuthContext.Provider
//       value={{ isAuthenticated, login, register, logout, token, loading }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => React.useContext(AuthContext);

// export default AuthContext;

//! ************** IN THIS STORE TOKEN DIRECTLY IN LOCAL STORAGE AND CALL REFRESHACCESSTOKEN WHEN THE TOKEN GOT NULL:. ************* */
// import React, { createContext, useEffect, useState } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { jwtDecode } from 'jwt-decode';
// import { useNavigate } from 'react-router-dom';
// import Cookies from 'js-cookie';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [token, setToken] = useState();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedToken = localStorage.getItem('token');
//     if (storedToken) {
//       setToken(storedToken);
//       setIsAuthenticated(true);
//       verifyTokenExpiry(storedToken);
//     } else {
//       refreshAuthToken();
//     }

//     setLoading(false);
//   }, []);

//   const login = async (credentials) => {
//     console.log('crd:', credentials);
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_SERVER_URL}/users/login`,
//         credentials,
//         { withCredentials: true },
//       );
//       console.log('RESLogin:', response);
//       const { accessToken, user } = response.data.data;
//       localStorage.setItem('userId', user._id);
//       localStorage.setItem('token', accessToken);
//       setToken(accessToken);
//       setIsAuthenticated(true);
//     } catch (err) {
//       console.log('Error login:', err);
//       setToken(null);
//     }
//   };

//   console.log('Tokeenn:', token);

//   const register = async (formData) => {
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_SERVER_URL}/users/register`,
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         },
//       );

//       console.log('Register successful:', response.data);
//       toast.success('Registered successfully!');
//     } catch (error) {
//       console.error('Error during registration', error);
//       throw error;
//     }
//   };

//   const logout = async () => {
//     try {
//       await axios.post(
//         `${process.env.REACT_APP_SERVER_URL}/users/logout`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       );
//       localStorage.removeItem('userId');
//       localStorage.removeItem('token');
//       setToken(null);
//       setIsAuthenticated(false);
//       navigate('/');
//       toast.success('Logged out successfully!');
//     } catch (error) {
//       console.log('Error while logout:', error);
//       toast.error('Something went wrong!');
//     }
//   };

//   const getRefreshTokenFromCookies = () => {
//     return Cookies.get('refreshToken');
//   };

//   console.log('getRefTkFCook:', getRefreshTokenFromCookies());

//   const refreshAuthToken = async () => {
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_SERVER_URL}/users/refresh-token`,
//         {},
//         { withCredentials: true },
//       );
//       const { accessToken, user } = response.data.data;
//       localStorage.setItem('userId', user._id);
//       localStorage.setItem('token', accessToken);
//       setToken(accessToken);
//       setIsAuthenticated(true);
//     } catch (err) {
//       console.log('Error refreshing auth token:', err);
//       setToken(null);
//       setIsAuthenticated(false);
//       navigate('/');
//     }
//   };

//   const verifyTokenExpiry = async (token) => {
//     const decodedToken = jwtDecode(token);
//     if (decodedToken.exp * 1000 < Date.now()) {
//       const refToken = getRefreshTokenFromCookies();
//       if (refToken) {
//         await refreshAuthToken();
//       } else {
//         setToken(null);
//         setIsAuthenticated(false);
//         navigate('/login');
//       }
//     }
//   };

//   useEffect(() => {
//     const requestInterceptor = axios.interceptors.request.use(
//       async (config) => {
//         const storedToken = localStorage.getItem('token');
//         if (storedToken) {
//           await verifyTokenExpiry(storedToken);
//           config.headers.Authorization = `Bearer ${localStorage.getItem(
//             'token',
//           )}`;
//         }
//         return config;
//       },
//       (error) => Promise.reject(error),
//     );

//     return () => {
//       axios.interceptors.request.eject(requestInterceptor);
//     };
//   }, []);

//   useEffect(() => {
//     const interceptor = axios.interceptors.response.use(
//       (response) => response,
//       async (error) => {
//         const originalRequest = error.config;
//         if (error.status === 401 && !originalRequest._retry) {
//           originalRequest._retry = true;
//           await refreshAuthToken(); // Refresh the token
//           originalRequest.headers.Authorization = `Bearer ${localStorage.getItem(
//             'accessToken',
//           )}`;
//           return axios(originalRequest);
//         }
//         return Promise.reject(error);
//       },
//     );

//     return () => {
//       axios.interceptors.response.eject(interceptor);
//     };
//   }, []);

//   return (
//     <AuthContext.Provider
//       value={{ isAuthenticated, login, register, logout, token, loading }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => React.useContext(AuthContext);

// export default AuthContext;
