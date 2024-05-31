import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
// import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token read from localStorage:", token);

    if (token) {
      setIsAuthenticated(true);
      setToken(token);
    }
    setLoading(false); // Set loading to false after checking token
  }, []);

  const login = async (credentials) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/login",
        credentials
      );

      const data = response.data.data;

      //   console.log(data.user)
      localStorage.setItem("token", data.accessToken);
      setToken(data.accessToken);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error logging in: ", error);
      throw error;
    }
  };

  const register = async (formData) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Register successful:", response.data);
    } catch (error) {
      console.log("Error during registration", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setToken("");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, register, logout, token, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
