import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaRegEye, FaRegEyeSlash, FaSpinner } from 'react-icons/fa';
import { MdOutlineModeEditOutline } from 'react-icons/md';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import Loader from '../loader/Loader';
import { FaExclamationCircle } from 'react-icons/fa';

function Profile() {
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [deleteEmail, setDeleteEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [delError, setDelError] = useState(false);
  const [passError, setPassError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [delLoading, setDelLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [coverImageLoading, setCoverImageLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    username: '',
    coverImage: '',
    avatar: '',
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setProfileLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/users/current-user`,
          {
            withCredentials: true,
          },
        );
        // console.log(response.data.data);
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

      // console.log('formadata:', formData.get(name));

      try {
        const apiUrl = `${process.env.REACT_APP_SERVER_URL}/users/${
          name === 'coverImage' ? 'cover-image' : 'avatar'
        }`;
        console.log('API URL:', apiUrl);

        const response = await axios.patch(apiUrl, formData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('res', response);
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
        // console.log('Inside finaly file.');
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
      const response = await axios.patch(
        `${process.env.REACT_APP_SERVER_URL}/users/update-account`,
        {
          fullName: userData.fullName,
          email: userData.email,
        },
        {
          withCredentials: true,
        },
      );

      if (response.data && response.data.data) {
        setUserData(response.data.data);
        setSuccess('Profile updated successfully');
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      console.log('Error while updating profile:', error);
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
      setShowEditPopup(false);
    }
  };

  //*VEFIFING OLD PASSWORD:
  const verifyOldPassword = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/users/verify-password`,
        {
          password: passwordData.oldPassword,
        },
        {
          withCredentials: true,
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
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/users/change-password`,
        {
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        },
        {
          withCredentials: true,
        },
      );
      // console.log(response);

      if (response.data.success === true) {
        setPasswordData({
          oldPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        });
        toast.success('Password updated successfully!');
      }
    } catch (error) {
      console.log('Error while updating password:', error);
      setPassError(error.message);
    } finally {
      setPassLoading(false);
      navigate('/profile');
    }
  };

  //* HANDLE DELETE ACCOUNT:
  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    try {
      setDelLoading(true);
      setDelError(null);
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/users/delete-account`,
        {
          email: deleteEmail,
        },
        {
          withCredentials: true,
        },
      );
      // console.log('del Resp:', response);
      setSuccess(response.data.message);
      toast.success('Account deleted successfully!');
      if (response.data.message === 'success') {
        setTimeout(() => {
          setShowDeletePopup(false);
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          navigate('/login');
        }, 3000);
      }
    } catch (error) {
      console.log('Error while deleting account:', error);
      setDelError('something went wrong!');
      toast.error(error.message);
    } finally {
      setDelLoading(false);
    }
  };

  const isUserDataEmpty = (data) => {
    return !data.fullName && !data.email && !data.username;
  };

  // IF PROFILE NOT FOUND
  if (profileLoading) {
    return (
      <div className="w-full h-full">
        <Loader />
      </div>
    );
  }

  if (isUserDataEmpty(userData)) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-center font-bold text-2xl text-gray-500">
          Profile not found!
        </p>
      </div>
    );
  }

  return (
    <div className="my-3 mx-14">
      <div className="w-full min-h-screen p-5 bg-gray-100 rounded-lg relative pb-5">
        {/* TOP PART */}
        <div className="w-full mb-10">
          {/* COVER IMAGE */}
          <div className="w-full h-64 relative rounded-md shadow-md">
            {coverImageLoading ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-300 rounded-md">
                <FaSpinner className="animate-spin text-4xl text-gray-600" />
              </div>
            ) : (
              <img
                src={userData.coverImage}
                alt="coverImage"
                className="w-full h-64 object-cover rounded-md"
              />
            )}
            <div className="absolute top-4 right-4 px-2 py-2 bg-white text-xl rounded-full shadow-md">
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
          <div className="w-44 h-44 absolute top-40 left-14 rounded-full border-1 border-white shadow-md bg-gray-300">
            {avatarLoading ? (
              <div className="w-44 h-44 flex items-center justify-center bg-gray-300 rounded-full">
                <FaSpinner className="animate-spin text-4xl text-gray-600" />
              </div>
            ) : (
              <img
                src={userData.avatar}
                alt="avatar"
                className="w-44 h-44 object-cover rounded-full border-4 border-white text-center"
              />
            )}
            <div className="absolute bottom-4 right-4 px-2 py-2 bg-white text-xl rounded-full shadow-md">
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
        <div className="mt-28 p-5 w-full bg-gray-300 mb-5 rounded-md">
          <h2 className="text-3xl font-bold text-gray-800">
            Profile Information
          </h2>
          {/* Name */}
          <div className="mt-6 flex items-center gap-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="fullName"
            >
              Name
            </label>
            <p className="text-lg text-gray-700 border border-red-400 px-2 py-1 rounded-md bg-gray-50 shadow-sm">
              {userData.fullName}
            </p>
          </div>
          {/* Username */}
          <div className="mt-6 flex items-center gap-4">
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <p className="text-lg text-gray-700 border border-red-400 px-2 py-1 rounded-md bg-gray-50 shadow-sm">
              {userData.username}
            </p>
          </div>
          {/* Email */}
          <div className="mt-6 flex items-center gap-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <p className="text-lg text-gray-700 border border-red-400 px-2 py-1 rounded-md bg-gray-50 shadow-sm">
              {userData.email}
            </p>
          </div>

          <div className="flex justify-end">
            {/* Edit profile */}
            <button
              onClick={() => setShowEditPopup(true)}
              className="px-4 py-2 bg-orange-500 text-white rounded-md shadow-md flex items-center"
            >
              <p>Edit Profile</p>
            </button>
          </div>
        </div>
        {/* Password */}
        <div className="w-full bg-gray-300 p-5 rounded-md mb-5">
          <h3 className="text-xl font-semibold mb-2">Password</h3>
          <form onSubmit={handleChangePassword}>
            <div className="w-full flex items-start justify-between">
              <div>
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
                  className="w-72 mt-1 p-2 border rounded-md shadow-md bg-gray-50"
                  required
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="newPassword"
                >
                  New Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordInputChange}
                  className="w-72 mt-1 p-2 border rounded-md shadow-md bg-gray-50"
                  required
                />
              </div>
              <div className="relative">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="confirmNewPassword"
                >
                  Confirm New Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmNewPassword"
                  value={passwordData.confirmNewPassword}
                  onChange={handlePasswordInputChange}
                  className="w-72 mt-1 p-2 border rounded-md shadow-md bg-gray-50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-9 right-3 text-gray-500 text-lg"
                >
                  {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                </button>
              </div>
            </div>
            {passError && <p className="text-red-500 mt-2">{passError}</p>}
            <div className="flex justify-end mt-5">
              <button
                type="submit"
                className="px-4 py-2 bg-orange-500 text-white rounded-md shadow-md w-20 flex items-center justify-center"
                disabled={passLoading}
              >
                {passLoading ? (
                  <FaSpinner className="animate-spin text-2xl" />
                ) : (
                  'Update'
                )}
              </button>
            </div>
          </form>
        </div>
        {/* Delete */}
        <div className="w-full bg-red-300 p-5 rounded-md">
          <div className="w-full">
            <h3 className="text-xl font-semibold mb-2">Delete Account</h3>
            <p>
              Would you like to delete account?<br></br>
              Deleting your account is permanent and will remove all the contain
              associated with it.
              <span className="italic">
                Your Follower, Videos, Subscription, Watch History, Playlists.
              </span>
              And you no more able to recover it!
            </p>
          </div>
          <button
            onClick={() => setShowDeletePopup(true)}
            className="mt-5 px-4 py-3 bg-red-600 text-white rounded-md shadow-md flex items-center italic"
          >
            I want to delete
            <RiDeleteBin6Line className="text-lg ml-2" />
          </button>
        </div>

        {/* EDIT USER DATA POPUP */}
        {showEditPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[500px]">
              <h2 className="text-xl font-bold mb-4">Update you profile</h2>
              <p className="mb-4">Enter your data:</p>
              <form onSubmit={handleSubmit}>
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="fullName"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={userData.fullName}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border rounded-md shadow-sm"
                />
                <label
                  className="block text-sm font-medium text-gray-700 mt-4"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border rounded-md shadow-sm"
                />
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => setShowEditPopup(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 text-white rounded-md shadow-md w-36 flex items-center justify-center"
                    disabled={loading}
                  >
                    {loading ? (
                      <FaSpinner className="animate-spin text-sl" />
                    ) : (
                      'Save changes'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* SHOW DELETE POPUP */}
        {showDeletePopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="w-full flex items-center justify-center">
                <FaExclamationCircle className="w-16 h-16 text-red-700 text-center mb-4" />
              </div>
              <h2 className="text-xl font-bold mb-4 text-center">
                Confirm Delete Account
              </h2>
              <p className="mb-4">
                Please enter your email to confirm account deletion:
              </p>
              <form onSubmit={handleDeleteAccount}>
                <input
                  type="email"
                  name="deleteEmail"
                  value={deleteEmail}
                  onChange={(e) => setDeleteEmail(e.target.value)}
                  className="p-2 w-full border rounded-md shadow-sm mb-4"
                  required
                />
                {delError && <p className="text-red-500 mt-2">{delError}</p>}
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => setShowDeletePopup(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 text-white rounded-md w-20 flex items-center justify-center"
                    disabled={delLoading}
                  >
                    {delLoading ? (
                      <FaSpinner className="animate-spin text-xl" />
                    ) : (
                      'Delete'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
