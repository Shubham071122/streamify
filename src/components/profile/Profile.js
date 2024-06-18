import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { MdOutlineModeEditOutline } from 'react-icons/md';
import { FaSpinner } from 'react-icons/fa';
import Loader from '../loader/Loader';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

function Profile() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [passError, setPassError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [coverImageLoading, setCoverImageLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    username: '',
    coverImage: '',
    avatar: '',
  });
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setProfileLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/users/current-user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log(response.data.data);
        if (response.data && response.data.data) {
          setUserData(response.data.data);
        }
      } catch (error) {
        console.log('Error while fetching current user:', error);
        setError(error.message);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchUserData();
  }, []);

  //*HANDLE INPUT CHANGE:
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  //* HANDLE FILE CHANGE:
  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      const file = files[0];
      const formData = new FormData();
      formData.append(name, file);

      if (name === 'coverImage') setCoverImageLoading(true);
      if (name === 'avatar') setAvatarLoading(true);

      try {
        const token = localStorage.getItem('token');
        const response = await axios.patch(
          `${process.env.REACT_APP_SERVER_URL}/users/${
            name === 'coverImage' ? 'cover-image' : 'avatar'
          }`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        if (response.data && response.data.data) {
          setUserData((prevData) => ({
            ...prevData,
            [name]: response.data.data[name],
          }));
          setSuccess(
            `${
              name === 'coverImage' ? 'Cover image' : 'Avatar'
            } updated successfully!`,
          );
        }
      } catch (error) {
        console.log(`Error while updating ${name}:`, error);
        setError(error.message);
      } finally {
        if (name === 'coverImage') setCoverImageLoading(false);
        if (name === 'avatar') setAvatarLoading(false);
      }
    }
  };

  //* HANDLE SUBMIT:
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${process.env.REACT_APP_SERVER_URL}/users/update-account`,
        {
          fullName: userData.fullName,
          email: userData.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data && response.data.data) {
        setUserData(response.data.data);
        setSuccess('Profile updated successfully');
        setEditMode(false);
      }
    } catch (error) {
      console.log('Error while updating profile:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  //*VEFIFING OLD PASSWORD:
  const verifyOldPassword = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/users/verify-password`,
        {
          password: passwordData.oldPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data.success;
    } catch (error) {
      console.log('Error while verifing old password', error);
      return false;
    }
  };

  //* HANDLE PASSWORD CHANGE:
  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassLoading(true);
    setPassError('');
    setPassSuccess('');

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPassError('New password do not match!');
      setPassLoading(false);
      return;
    }
    const isOldPasswordValid = await verifyOldPassword();
    if (!isOldPasswordValid) {
      setPassError('Old password not matched!');
      setPassLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/users/change-password`,
        {
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      // console.log(response);

      if (response.data.success === true) {
        setPassSuccess('Password updated successfully');
        setChangePasswordMode(false);
        setPasswordData({
          oldPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        });
      }
    } catch (error) {
      console.log('Error while updating password:', error);
      setPassError(error.message);
    } finally {
      setPassLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="w-full h-full">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-8/12 min-h-screen instead m-5 bg-gray-200 rounded-lg mx-auto relative pb-5">
      {/* TOP PART */}
      <div className="w-full">
        {/* COVER IMAGE */}
        <div className="w-full h-60 relative rounded-md">
          {coverImageLoading ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-300 rounded-md">
              <FaSpinner className="animate-spin text-4xl text-gray-600" />
            </div>
          ) : (
            <img
              src={userData.coverImage}
              alt="coverImage"
              className="w-full h-60 object-cover rounded-md border-b-4"
            />
          )}
          <div className="absolute top-4 right-4 px-1 py-1 bg-white text-xl rounded-full">
            <label htmlFor="coverImage" className="cursor-pointer">
              <MdOutlineModeEditOutline />
            </label>
            <input
              type="file"
              name="coverImage"
              id="coverImage"
              onChange={handleFileChange}
              className="opacity-0 w-0 h-0 absolute"
            />
          </div>
        </div>
        {/* AVATAR */}
        <div className="w-44 h-40 absolute top-32 left-14">
          {avatarLoading ? (
            <div className="w-40 h-40 flex items-center justify-center bg-gray-300 rounded-full border-4">
              <FaSpinner className="animate-spin text-4xl text-gray-600" />
            </div>
          ) : (
            <img
              src={userData.avatar}
              alt="avatar"
              className="w-40 h-40 object-cover rounded-full object-center border-4 bg-gray-300"
            />
          )}
          <div className="absolute bottom-4 right-6 px-1 py-1 bg-white text-xl rounded-full">
            <label htmlFor="avatar" className="cursor-pointer">
              <MdOutlineModeEditOutline />
            </label>
            <input
              type="file"
              name="avatar"
              id="avatar"
              onChange={handleFileChange}
              className="opacity-0 w-0 h-0 absolute"
            />
          </div>
        </div>
      </div>

      {/* BOTTOM PART */}
      <div className="mt-20 px-5 w-full ">
        <h2 className="text-2xl font-bold">Profile Information</h2>
        {/* Name */}
        <div className="mt-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="fullName"
          >
            Name
          </label>
          {editMode ? (
            <input
              type="text"
              name="fullName"
              value={userData.fullName}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md"
            />
          ) : (
            <p className="mt-1">{userData.fullName}</p>
          )}
        </div>
        {/* UserName */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <p className="mt-1">{userData.username}</p>
        </div>
        {/* Email */}
        <div className="mt-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="email"
          >
            Email
          </label>
          {editMode ? (
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md"
            />
          ) : (
            <p className="mt-1">{userData.email}</p>
          )}
        </div>
        {/* Password */}
        <div className="mt-4">
          <p className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </p>
          {changePasswordMode ? (
            <form onSubmit={handleChangePassword}>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="oldPassword"
              >
                Old Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handlePasswordInputChange}
                className="mt-1 p-2 w-full border rounded-md"
                required
              />
              <label
                className="block text-sm font-medium text-gray-700 mt-4"
                htmlFor="newPassword"
              >
                New Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordInputChange}
                className="mt-1 p-2 w-full border rounded-md"
                required
              />
              <div className="relative">
                <label
                  className="block text-sm font-medium text-gray-700 mt-4"
                  htmlFor="confirmNewPassword"
                >
                  Confirm New Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmNewPassword"
                  value={passwordData.confirmNewPassword}
                  onChange={handlePasswordInputChange}
                  className="mt-1 p-2 w-full border rounded-md"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-600"
                >
                  {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                </button>
              </div>
              <button
                type="submit"
                className="w-44 mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
                disabled={passLoading}
              >
                {passLoading ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  'Change Password'
                )}
              </button>
              {passError && <p className="text-red-500 mt-2">{passError}</p>}
            </form>
          ) : (
            <button
              onClick={() => setChangePasswordMode(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Change Password
            </button>
          )}
          {passSuccess && <p className="text-green-500 mt-2">{passSuccess}</p>}
        </div>

        {editMode && (
          <button
            onClick={handleSubmit}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md"
            disabled={loading}
          >
            {loading ? <FaSpinner className="animate-spin" /> : 'Save Changes'}
          </button>
        )}
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-md"
          >
            Edit Profile
          </button>
        )}
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-500 mt-2">{success}</p>}
      </div>
    </div>
  );
}

export default Profile;
