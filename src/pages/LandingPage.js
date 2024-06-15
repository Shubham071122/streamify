import React, { useState } from "react";
import { Link,NavLink } from "react-router-dom";
import logo from "../assets/Streamify.png";
import WatchVideoImage from '../assets/watch-video.png';
import PublishVideoImage from '../assets/publish-video.png';
import tweet from '../assets/twitter.webp'
import subscribeImage from '../assets/subscribe.png';
import Footer from '../pages/home/Footer'


function LandingPage() {
  const backgroundImage = `url(${require("../assets/bg1.jpeg")})`;
  const [isLogin,setIsLogin] = useState(false);
  return (
    <div className="w-full h-screen text-white bg-black">
      {/* HERO BANNER */}
      <div>
        <div
          className="w-full h-[700px] relative"
          style={{
            backgroundImage,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(25%)",
          }}
        ></div>

        <div className="absolute top-0 w-full px-40 h-[700px] bottom-0 left-0  bg-gradient-to-t from-black via-transparent">
          <nav className="w-full flex items-center justify-between pt-5">
            <Link to="/">
              <img src={logo} alt="logo" width="250px" />
            </Link>
            <div>
              <NavLink
                to="/login"
                className="text-[16px] px-3 py-2 bg-red-500 rounded-sm hover:bg-red-600 hover:transition-all 0.4s ease mr-3"
                onClick={() => setIsLogin(!isLogin)}
              >
                Log In
              </NavLink>
              <NavLink
                to="/register"
                className="text-[16px] px-3 py-2 bg-red-500 rounded-sm hover:bg-red-600 hover:transition-all 0.4s ease"
              >
                Create account
              </NavLink>
            </div>
          </nav>

          <div className="flex flex-col items-center justify-center h-full -mt-14">
            <h1 className="text-[60px] font-bold">Welcome to streamify</h1>
            <p className="text-[30px]">
              India's no. 1 video streaming platform.
            </p>
          </div>
        </div>
      </div>

      {/* BOTTOM PART */}

      <div className="w-10/12 h-screen mx-auto">
        {/* VIDEO */}
        <div className="absolutew-full h-2 bg-gray-500 rounded-sm"></div>
        <div className="flex justify-between items-center my-5 mx-5">
          <div>
            <h2 className="text-[35px] font-semibold space-x-1">Watch Video</h2>
            <p className="text-[20px]">
              Watch latest video from different channel
            </p>
          </div>
          <div>
            <img src={WatchVideoImage} alt="logo" />
          </div>
        </div>

        {/* PUBLISH */}
        <div className="absolutew-full h-2 bg-gray-500 rounded-sm"></div>
        <div className="flex justify-between items-center my-5 mx-5">
          <div>
            <img src={PublishVideoImage} alt="logo" />
          </div>
          <div>
            <h2 className="text-[35px] font-semibold space-x-1">
              Publish Video
            </h2>
            <p className="text-[20px]">
              Publish your thoughts , video , idea on this platfrom for free
            </p>
          </div>
        </div>

        {/* TWEET */}
        <div className="absolutew-full h-2 bg-gray-500 rounded-sm"></div>
        <div className="flex justify-between items-center my-10 mx-5">
          <div>
            <h2 className="text-[35px] font-semibold space-x-1">
              Tweet your thoughts
            </h2>
            <p className="text-[20px]">
              Now you can tweet your thoughts , idea like same as in tweeter
            </p>
          </div>
          <div>
            <img src={tweet} alt="logo" width="300px" />
          </div>
        </div>

        {/* SUBSCRIBE */}
        <div className="absolutew-full h-2 bg-gray-500 rounded-sm"></div>
        <div className="flex justify-between items-center my-10 mx-5">
          <div>
            <img src={subscribeImage} alt="logo" />
          </div>
          <div className="w-[500px]">
            <h2 className="text-[35px] font-semibold space-x-1">
              Subscribe channel
            </h2>
            <p className="text-[20px]">
              If you like someone's and want get notified in future press
              subscribe you'll notified in future if they upload something.
            </p>
          </div>
        </div>
        <div className="w-full h-[.5px] bg-slate-500"></div>
        <Footer />
      </div>
    </div>
  );
}

export default LandingPage;
