import axios from "axios";
import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({children}) => {
    const [channelData,setChannelData] = useState([]);

    //** FETCHINHG USER DETAIL BY ID */
    const fetchUserDetails = async(userId) => {
        const token = localStorage.getItem("token");

        try {
            const response = await axios.get(
                `${process.env.REACT_APP_SERVER_URL}/users/${userId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                },
              );
              console.log("channel data res:",response);
              if(response.data.data){
                setChannelData(response.data.data)
              }
        } catch (error) {
            console.log("Error while fetching channel data:",error);
        }
    }

    return(
        <UserContext.Provider value={{channelData,fetchUserDetails}}>
            {children}
        </UserContext.Provider>
    )
};

export const useUserContext = () => useContext(UserContext);
