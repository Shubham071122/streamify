import React, { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash, FaSpinner } from "react-icons/fa";
import './LoginPage.css'
import toast from 'react-hot-toast';

const LoginPage = () => {
  // const backgroundImage = `url(${require("../assets/bg1.jpeg")})`;
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(credentials);
      console.log("Login successful:", data);
      navigate("/");
      toast.success("Login successfully!")
    } catch (error) {
      setError("Login failed. Please check your credentials and try again.");
      toast.error("Login failed,Check your credentials!")
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-slate-700 flex items-center justify-center relative">
      <div className="bg-image w-full h-screen"></div>
      <div className="max-w-[400px] w-3/12 p-8 bg-stone-500 bg rounded-md">
        <h2 className="text-center text-[30px] font-bold text-white">LogIn</h2>
        <p className="text-center text-[20px] font-medium text-white mb-10">
          Welcome to streamify
        </p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email" className="text-white text-lg">
            Email
          </label>
          <br></br>
          <input
            type="email"
            name="email"
            placeholder="Username or Email"
            value={credentials.email}
            onChange={handleChange}
            required
            className="px-4 py-2 w-full rounded-md outline-none mb-5 mt-1"
          />
          <div className="w-full relative">
            <label htmlFor="password" className="text-white text-lg">
              Password
            </label>
            <br></br>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={credentials.password}
              onChange={handleChange}
              required
              className={`px-4 py-2 w-full rounded-md outline-none mb-1 mt-1 relative ${showPassword === false ? '' : ''}`}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-11 text-gray-400 text-lg"
            >
              {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          </div>
          <p>
            <Link
              to="/forgot-password"
              className="text-blue-200 text-xs"
            >
              Forgot Password?
            </Link>
          </p>
          <button className="btn w-full shadow-md flex items-center justify-center" type="submit"
          disabled={loading}
          >
            {
              loading ? (
                <FaSpinner className="animate-spin text-2xl" />  
              ):(
                "Sign In"
              )
            }
          </button>
          {/* {error && <p style={{ color: "red" }}>{error}</p>} */}
        </form>
        <div className="w-full h-[0.2px] bg-white my-5"></div>
        <div className="text-center text-sm">
          <span className="text-white ">Don't have an account? </span>
          <Link to="/register" className="text-blue-400">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
