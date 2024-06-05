import React, { useEffect, useState } from "react";
import Video from "./Video";
import Loader from "../loader/Loader";

function Home() {
  const [videos, setVideos] = useState([]);
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${process.env.SERVER_URL}/videos/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log(response);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        // console.log("data", data);
        setVideos(data.message.videos);
      } catch (error) {
        console.log("Error while fetching videos:", error);
        setErrors(error.message);
      }finally{
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  if(loading){
    return <Loader/>
  }
  console.log("videosss:",videos);

  return (
    <div className="w-full h-screen flex justify-between px-14 py-14 flex-wrap">
      {errors > 0 ? (
        <div>{errors}</div>
      ) : videos.length > 0 ? (
        videos?.map((video, id) => (
          <div key={id} className="mb-3">
            <Video video={video} />
          </div>
        ))
      ) : (
        <div>Error while fetching</div>
      )}
    </div>
  );
}

export default Home;
