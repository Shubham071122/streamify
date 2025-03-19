import React, { useContext, useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './LoginPage.css';
import toast from 'react-hot-toast';
import coverPlaceholder from '../assets/cover-placeholder.png';
import avatarPlaceholder from '../assets/avatar-placeholder.png';

function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    avatar: '',
    coverImage: '',
  });

  const handleChange = (e) => {
    if (e.target.type === 'file') {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Full name is required!';
    if (!formData.email) newErrors.email = 'Email is required!';
    if (!formData.username) newErrors.username = 'Username is required!';
    if (!formData.password) newErrors.password = 'Password is required!';
    if (!formData.avatar) newErrors.avatar = 'Avatar is required!';
    // console.log("formdavt:",formData.avatar);
    if (!formData.coverImage) newErrors.coverImage = 'CoverImage is required!';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!validateForm()) {
      toast.error(
        'Please fill all required fields, including Avatar,CoverImage',
      );
      setLoading(false);
      return;
    }
    try {
      const response = await register(formData);
      // console.log('register res:', response);
      if (response.status === 200) {
        navigate('/login');
        toast.success('Accout created successfully!');
      }
    } catch (error) {
      console.log('Error while creating:', error);
      toast.error('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full h-[1200px]
    bg-slate-700 flex items-center justify-center relative"
    >
      <div className="bg-image w-full h-full bg-cover"></div>
      <div className="max-w-[700px] w-4/12 p-8 bg-stone-500 bg rounded-md my-5">
        <h2 className="text-center text-[30px] font-bold text-white">
          Create new account
        </h2>
        <p className="text-center text-[20px] font-medium text-white mb-10">
          India's no.1 video Streaimg platform
        </p>
        <div>
          <div className="mb-5">
            <label className="text-white text-base" htmlFor="fullName">
              Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Jone Doe"
              required
              className="px-4 py-2 w-full rounded-md outline-none mt-1"
            />
            {errors.fullName && (
              <span className="text-red-500 italic">{errors.fullName}</span>
            )}
          </div>

          <div className="mb-5">
            <label className="text-white text-base" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="jone@gamil.com"
              required
              className="px-4 py-2 w-full rounded-md outline-none mt-1"
            />
            {errors.email && (
              <span className="text-red-500 italic">{errors.email}</span>
            )}
          </div>

          <div className="mb-5">
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
              className="px-4 py-2 w-full rounded-md outline-none mt-1"
            />
            {errors.username && (
              <span className="text-red-500 italic">{errors.username}</span>
            )}
          </div>

          <div className="w-full relative mb-5">
            <label className="text-white text-base" htmlFor="password">
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="px-4 py-2 w-full rounded-md outline-none mt-1 relative"
            />
            {errors.password && (
              <span className="text-red-500 italic">{errors.password}</span>
            )}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 text-gray-400 text-lg"
            >
              {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          </div>

          <label className="text-white text-base block mb-2" htmlFor="avatar">
            Avatar
          </label>
          <div className="mb-5 w-full flex items-center justify-center flex-col">
            <div
              className="w-28 h-28 rounded-full border-2 border-gray-300 cursor-pointer overflow-hidden relative bg-center bg-cover"
              style={{
                backgroundImage: formData.avatar
                  ? `url(${URL.createObjectURL(formData.avatar)})`
                  : `url(${avatarPlaceholder})`,
              }}
              onClick={() => document.getElementById('avatarInput').click()}
            >
              <input
                type="file"
                id="avatarInput"
                name="avatar"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
                required
              />
            </div>
            {errors.avatar && (
              <span className="text-red-500 italic">{errors.avatar}</span>
            )}
          </div>

          <label
            className="text-white text-base block mb-2"
            htmlFor="coverImage"
          >
            Cover Image
          </label>
          <div className="mb-5">
            <div
              className="w-full h-48 border-2 border-gray-300 cursor-pointer overflow-hidden relative bg-center bg-cover rounded-md"
              style={{
                backgroundImage: formData.coverImage
                  ? `url(${URL.createObjectURL(formData.coverImage)})`
                  : `url(${coverPlaceholder})`,
              }}
              onClick={() => document.getElementById('coverImageInput').click()}
            >
              <input
                type="file"
                id="coverImageInput"
                name="coverImage"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
                required
              />
            </div>
            {errors.coverImage && (
              <span className="text-red-500 italic">{errors.coverImage}</span>
            )}
          </div>

          <button
            className="btn w-full"
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Register'}
          </button>
        </div>
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

//TODO: CHECK LATER BETTER UI:

// <div className="w-full h-screen bg-slate-700 flex items-center justify-center relative overflow-hidden">
//   <div className="fixed top-0 left-0 w-full h-full bg-cover bg-no-repeat bg-image"></div>
//   <div className="max-w-[900px] w-5/12 p-8 bg-stone-500 bg rounded-md my-5 relative z-10 overflow-y-auto max-h-[calc(100vh-40px)] scrollbar">
//     <h2 className="text-center text-[30px] font-bold text-white">
//       Create new account
//     </h2>
//     <p className="text-center text-[20px] font-medium text-white mb-10">
//       India's no.1 video streaming platform
//     </p>
//     <form onSubmit={handleSubmit}>
//       <div>
//         <label className="text-white text-base" htmlFor="fullName">
//           Full Name
//         </label>
//         <input
//           type="text"
//           name="fullName"
//           value={formData.fullName}
//           onChange={handleChange}
//           placeholder="Full name"
//           required
//           className="px-4 py-2 w-full rounded-md outline-none mb-5 mt-1"
//         />
//         {errors.fullName && (
//           <span className="text-red-500">{errors.fullName}</span>
//         )}
//       </div>

//       <div>
//         <label className="text-white text-base" htmlFor="email">
//           Email
//         </label>
//         <input
//           type="email"
//           name="email"
//           value={formData.email}
//           onChange={handleChange}
//           placeholder="email@gmail.com"
//           required
//           className="px-4 py-2 w-full rounded-md outline-none mb-5 mt-1"
//         />
//         {errors.email && (
//           <span className="text-red-500">{errors.email}</span>
//         )}
//       </div>

//       <div>
//         <label className="text-white text-base" htmlFor="username">
//           Username
//         </label>
//         <input
//           type="text"
//           name="username"
//           value={formData.username}
//           onChange={handleChange}
//           placeholder="JohnDoe"
//           required
//           className="px-4 py-2 w-full rounded-md outline-none mb-5 mt-1"
//         />
//         {errors.username && (
//           <span className="text-red-500">{errors.username}</span>
//         )}
//       </div>

//       <div className="w-full relative">
//         <label className="text-white text-base" htmlFor="password">
//           Password
//         </label>
//         <input
//           type={showPassword ? 'text' : 'password'}
//           name="password"
//           value={formData.password}
//           onChange={handleChange}
//           placeholder="Password"
//           required
//           className="px-4 py-2 w-full rounded-md outline-none mb-5 mt-1 relative"
//         />
//         {errors.password && (
//           <span className="text-red-500">{errors.password}</span>
//         )}
//         <button
//           type="button"
//           onClick={() => setShowPassword(!showPassword)}
//           className="absolute right-3 top-11 text-white"
//         >
//           {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
//         </button>
//       </div>

//       {/* <div>
//         <label className="text-white text-base" htmlFor="avatar">
//           Avatar
//         </label>
//         <input
//           type="file"
//           name="avatar"
//           onChange={handleChange}
//           className="px-4 py-2 w-full rounded-md outline-none mb-5 mt-1 text-white pr-4"
//         />
//         {formData.avatar && (
//           <img
//             src={URL.createObjectURL(formData.avatar)}
//             alt="Avatar Preview"
//             className="w-20 h-20 object-cover mt-2"
//           />
//         )}
//       </div>

//       <div>
//         <label className="text-white text-base" htmlFor="coverImage">
//           Cover Image
//         </label>
//         <input
//           type="file"
//           name="coverImage"
//           onChange={handleChange}
//           className="px-4 py-2 w-full rounded-md outline-none mb-4 mt-1 text-white pr-4"
//         />
//         {formData.coverImage && (
//           <img
//             src={URL.createObjectURL(formData.coverImage)}
//             alt="Cover Image Preview"
//             className="w-full h-40 object-cover mt-2"
//           />
//         )}
//       </div> */}

//       <label className="text-white text-base block mb-2" htmlFor="avatar">
//         Avatar
//       </label>
//       <div className="mb-5 w-full flex items-center justify-center">
//         <div
//           className="w-28 h-28 rounded-full border-2 border-gray-300 cursor-pointer overflow-hidden relative bg-center bg-cover"
//           style={{
//             backgroundImage: formData.avatar
//               ? `url(${URL.createObjectURL(formData.avatar)})`
//               : `url(${avatarPlaceholder})`
//           }}
//           onClick={() => document.getElementById('avatarInput').click()}
//         >
//           <input
//             type="file"
//             id="avatarInput"
//             name="avatar"
//             accept="image/*"
//             onChange={handleChange}
//             className="hidden"
//             required
//           />
//         </div>
//       </div>

//       <label
//         className="text-white text-base block mb-2"
//         htmlFor="coverImage"
//       >
//         Cover Image
//       </label>
//       <div className="mb-5">
//         <div
//           className="w-full h-48 border-2 border-gray-300 cursor-pointer overflow-hidden relative bg-center bg-cover rounded-md"
//           style={{
//             backgroundImage: formData.coverImage
//               ? `url(${URL.createObjectURL(formData.coverImage)})`
//               : `url(${coverPlaceholder})`,
//           }}
//           onClick={() => document.getElementById('coverImageInput').click()}
//         >
//           <input
//             type="file"
//             id="coverImageInput"
//             name="coverImage"
//             accept="image/*"
//             onChange={handleChange}
//             className="hidden"
//             required
//           />
//         </div>
//       </div>

//       <button className="btn w-full" type="submit" disabled={loading}>
//         {loading ? 'Creating...' : 'Register'}
//       </button>
//     </form>
//     <div className="w-full h-[0.2px] bg-white my-5"></div>
//     <div className="text-center text-sm">
//       <span className="text-white">Already have an account? </span>
//       <Link to="/login" className="text-blue-400">
//         Sign In
//       </Link>
//     </div>
//   </div>
// </div>
