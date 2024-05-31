import React, { createContext, useEffect, useState } from "react";
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user,setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token){
            const decodedUser = jwtDecode(token);
            setUser(decodedUser);
        }
    },[]);

    const login = async (credentials) => {
        try {
            const response = await axios.post('http://localhost:8000/api/v1/users/login',credentials);

            console.log("Response:",response);
            const data = response.data.data;

            console.log("data:",data);
            console.log(data.accessToken)
            localStorage.setItem('token',data.accessToken);

            const decodedUser = jwtDecode(data.accessToken);

            console.log("Decoded token: ",decodedUser);
            setUser(decodedUser);
        } catch (error) {
            console.error("Error logging in: ",error);
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
            console.log("Register successful:",response.data);
        } catch (error) {
            console.log("Error during registration",error);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return(
        <AuthContext.Provider value={{user,login,register,logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
