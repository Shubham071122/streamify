import React, { useContext, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "./LoginPage.css";

function RegisterPage() {
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    avatar: "",
    coverImage: "",
  });

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      register(formData);
      navigate("/login");
    } catch (error) {}
  };

  return (
    <div
      className="w-full h-[1200px] 
    bg-slate-700 flex items-center justify-center relative"
    >
      <div className="bg-image w-full h-full bg-cover"></div>
      <div className="max-w-[700px] w-4/12 p-8 bg-stone-500 bg rounded-md my-5 ">
        <h2 className="text-center text-[30px] font-bold text-white">
          Create an account
        </h2>
        <p className="text-center text-[20px] font-medium text-white mb-10">
          India's no.1 video Streaimg platform
        </p>
        <form onSubmit={handleSubmit}>
          <div>
            <label className="text-white text-base" htmlFor="fullName">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="full name"
              required
              className="px-4 py-2 w-full rounded-md outline-none mb-5 mt-1"
            />
            {errors.fullName && <span>{errors.fullName}</span>}
          </div>

          <div>
            <label className="text-white text-base" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@gamil.com"
              required
              className="px-4 py-2 w-full rounded-md outline-none mb-5 mt-1"
            />
            {errors.email && <span>{errors.email}</span>}
          </div>

          <div>
            <label className="text-white text-base" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Jone00"
              required
              className="px-4 py-2 w-full rounded-md outline-none mb-5 mt-1"
            />
            {errors.username && <span>{errors.username}</span>}
          </div>

          <div className="w-full relative">
            <label className="text-white text-base" htmlFor="password">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="password"
              required
              className="px-4 py-2 w-full rounded-md outline-none mb-5 mt-1 relative"
            />
            {errors.password && <span>{errors.password}</span>}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-11"
            >
              {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          </div>

          <div>
            <label className="text-white text-base" htmlFor="avatar">
              Avatar
            </label>
            <input
              type="file"
              name="avatar"
              onChange={handleChange}
              required
              className="px-4 py-2 w-full rounded-md outline-none mb-5 mt-1 text-white pr-4"
            />
          </div>

          <div>
            <label className="text-white text-base" htmlFor="coverImage">
              Cover Image
            </label>
            <input
              type="file"
              name="coverImage"
              onChange={handleChange}
              required
              className="px-4 py-2 w-full rounded-md outline-none mb-4 mt-1 text-white pr-4"
            />
          </div>

          <button className="btn w-full" type="submit">
            Register
          </button>
        </form>
        <div className="w-full h-[0.2px] bg-white my-5"></div>
        <div className="text-center text-sm">
          <span className="text-white ">Already have accout? </span>
          <Link to="/login" className="text-blue-400">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
