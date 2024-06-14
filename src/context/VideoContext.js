import axios from 'axios';
import React, { createContext,useContext, useState } from 'react'

const VideoContext = createContext();

export const VideoProvider = ({children}) => {
    const [videos,setVideos] = useState([]);
    const [errors, setErrors] = useState("");
    const [loading,setLoading] = useState(false);

    //* FETCHING VIDEO FOR HOME SCREEN:
    const fetchVideos = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `${process.env.REACT_APP_SERVER_URL}/videos/`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        //   console.log("Res vid:",response); 
          if(response.data && response.data.message.videos){
              setVideos(response.data.message.videos);
          }
        } catch (error) {
          console.log("Error while fetching videos:", error);
          setErrors(error.message);
        }finally{
          setLoading(false);
        }
      };

      //* FETCHING VIDEO BY Search QUERY:
      const fetchVideoByQuery = async(query) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
              `${process.env.REACT_APP_SERVER_URL}/videos/search?query=${query}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            console.log("Res vid:",response); 
            if(response.data && response.data.message.videos){
                setVideos(response.data.message.videos);
            }
          } catch (error) {
            console.log("Error while fetching videos:", error);
            setErrors(error.message);
          }finally{
            setLoading(false);
          }
        };



    return (
        <VideoContext.Provider
            value={{videos,errors,loading,fetchVideos,fetchVideoByQuery}}
        >
            {children}
        </VideoContext.Provider>
    )
};

export const useVideo = () => useContext(VideoContext);
