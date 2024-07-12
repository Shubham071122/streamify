import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords not matched!');
      toast.error('Passwords not matched!')
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/users/reset-password/${token}`,
        { newPassword },
      );
      // console.log('Rt res:', response);
      setMessage('Password updated successfully!');
      toast.success('Password updated successfully!')
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response.data.message || 'An error occurred');
      toast.error(err.response.data.message || 'An error occurred')
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-gray-300 rounded shadow">
        <h2 className="text-2xl font-bold text-center">Reset Password</h2>
        {/* {message && <p className="text-green-600">{message}</p>} */}
        {/* {error && <p className="text-red-600">{error}</p>} */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full p-2 mt-1 border rounded"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4 relative">
            <label className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full p-2 mt-1 border rounded"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            className="w-full p-2 text-white bg-red-600 rounded hover:bg-red-700"
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
