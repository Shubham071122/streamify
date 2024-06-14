import React, { useEffect, useState } from 'react'
import { FaRegBell } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import logo from "../../assets/Streamify.png";
import { NavLink } from 'react-router-dom';
import './Navbar.css'
import { useVideo } from '../../context/VideoContext';

function Navbar() {
  // const [erros,setErrors] = useState();
  const [avatar,setAvatar] = useState("");
  const [query,setSearchQuery] = useState("")
  const {fetchVideoByQuery} = useVideo();

  useEffect(() => {
    const fetchAvatar = async() => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/users/current-user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log("Response avatar: ",response);
        const data = await response.json();
        setAvatar(data.data.avatar);
        // console.log("Avatar:",data.data);
        
      } catch (error) {
        console.log('Error while fetching avatar:',error);
      }
    }
    fetchAvatar();
  },[])

  const handleSearch = () => {
    if (query.trim() !== '') {
      fetchVideoByQuery(query);
    }
  }

  return (
    <div className="w-full flex items-center justify-between py-[.5px] px-10  bg-red-900 nav-shadow">
      <div className="-ml-6">
        <img src={logo} alt="" width="250px" />
      </div>

      <div className="flex items-center ">
        <input
          type="search"
          name="search"
          value={query}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search"
          className="max-w-[600px] w-[550px]  py-2 px-6 rounded-full outline-none  bg-gray-100 text-black font-medium tracking-wide"
        />
        <button onClick={handleSearch} className="py-3 bg-gray-100 px-3 rounded-full ml-2 text-center hover:bg-red-200 transition-all 0.4s ease-in-out">
          <IoSearch style={{ fontSize: "20px" }} />
        </button>
      </div>

      <div className="flex items-center">
        <div className="text-white text-[20px] mr-5 hover:bg-red-400 transition-all 0.4s ease-in-out px-3 py-3 rounded-full">
          <FaRegBell />
        </div>
        <div className="w-12 h-12 rounded-full border-2 border-red-400 box-border">
          <NavLink to="/profile">
            <img
              src={avatar}
              alt="profile"
              className="w-11 h-11 rounded-full object-cover"
            />
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Navbar