import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import ConfirmModal from '../components/ConfirmModal';
export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    try {
      setFilePerc(0);
      setFileUploadError(false);
      setFilePerc(50);

      const uploadData = new FormData();
      uploadData.append('image', file);

      const res = await fetch('/api/upload/image', {
        method: 'POST',
        body: uploadData,
      });
      const data = await res.json();

      if (data.success === false) {
        setFileUploadError(true);
        toast.error('Image upload failed');
        return;
      }

      setFormData({ ...formData, avatar: data.url });
      setFilePerc(100);

      // Save avatar to database immediately
      const updateRes = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar: data.url }),
      });
      const updateData = await updateRes.json();
      if (updateData.success !== false) {
        dispatch(updateUserSuccess(updateData));
      }
      toast.success('Profile image updated!');
    } catch (error) {
      setFileUploadError(true);
      toast.error('Image upload failed');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      toast.success('Profile updated successfully!');
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      toast.error('Failed to update profile');
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      toast.success('Account deleted successfully');
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      toast.error('Failed to delete account');
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        toast.error('Failed to sign out');
        return;
      }
      localStorage.removeItem('access_token');
      dispatch(deleteUserSuccess(data));
      toast.success('Signed out successfully!');
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      toast.error('Failed to sign out');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwordData.oldPassword) {
      toast.error('Current password is required');
      return;
    }
    if (!passwordData.newPassword) {
      toast.error('New password is required');
      return;
    }
    if (!passwordData.confirmPassword) {
      toast.error('Confirm new password is required');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Confirm new password does not match');
      return;
    }
    if (passwordData.oldPassword === passwordData.newPassword) {
      toast.error('New password must be different from current password');
      return;
    }
    try {
      setPasswordLoading(true);
      const res = await fetch(`/api/user/change-password/${currentUser._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        }),
      });
      const data = await res.json();
      if (data.success === false) {
        toast.error(data.message);
        return;
      }
      toast.success('Password changed successfully!');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setShowChangePassword(false);
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className='max-w-2xl mx-auto px-4 py-10'>
      {/* Profile Card */}
      <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
        {/* Header banner */}
        <div className='bg-teal-900 h-28'></div>
        <div className='px-6 sm:px-8 pb-8 -mt-14'>
          {/* Avatar */}
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type='file'
            ref={fileRef}
            hidden
            accept='image/*'
          />
          <img
            onClick={() => fileRef.current.click()}
            src={formData.avatar || currentUser.avatar}
            alt='profile'
            className='w-24 h-24 rounded-full object-cover cursor-pointer border-4 border-white shadow-lg hover:opacity-90 transition-opacity'
          />
          <p className='text-sm mt-2'>
            {fileUploadError ? (
              <span className='text-red-500'>
                Error uploading image (max 2 MB)
              </span>
            ) : filePerc > 0 && filePerc < 100 ? (
              <span className='text-teal-600'>{`Uploading ${filePerc}%`}</span>
            ) : filePerc === 100 ? (
              <span className='text-emerald-600'>Image uploaded successfully!</span>
            ) : (
              ''
            )}
          </p>

          <h1 className='text-xl font-bold text-slate-800 mt-3'>{currentUser.username}</h1>
          <p className='text-sm text-gray-400'>{currentUser.email}</p>

          {/* User Info */}
          <div className='mt-6 space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1.5'>Username</label>
              <p className='w-full px-4 py-3 border border-gray-100 rounded-xl text-sm text-gray-600 bg-gray-50'>
                {currentUser.username}
              </p>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1.5'>Email</label>
              <p className='w-full px-4 py-3 border border-gray-100 rounded-xl text-sm text-gray-600 bg-gray-50'>
                {currentUser.email}
              </p>
            </div>
          </div>

          {/* Security Section */}
          <div className='mt-6 pt-6 border-t border-gray-100'>
            <div className='flex items-center justify-between mb-4'>
              <div>
                <h3 className='text-sm font-bold text-slate-800'>Security</h3>
                <p className='text-xs text-gray-400 mt-0.5'>Manage your password</p>
              </div>
              <button
                type='button'
                onClick={() => setShowChangePassword(!showChangePassword)}
                className='text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors'
              >
                {showChangePassword ? 'Cancel' : 'Change Password'}
              </button>
            </div>
          </div>

          {/* Change Password Form */}
          {showChangePassword && (
            <form onSubmit={handleChangePassword} noValidate className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1.5'>Current Password</label>
                <div className='relative'>
                  <input
                    type={showOldPassword ? 'text' : 'password'}
                    placeholder='Enter current password'
                    value={passwordData.oldPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                    className='w-full px-4 py-3 pr-11 border border-gray-200 rounded-xl text-sm hover:border-gray-300 focus:outline-none focus:border-teal-400 transition-colors'
                  />
                  <button type='button' onClick={() => setShowOldPassword(!showOldPassword)} className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'>
                    {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1.5'>New Password</label>
                <div className='relative'>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder='Enter new password (min 6 characters)'
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className='w-full px-4 py-3 pr-11 border border-gray-200 rounded-xl text-sm hover:border-gray-300 focus:outline-none focus:border-teal-400 transition-colors'
                  />
                  <button type='button' onClick={() => setShowNewPassword(!showNewPassword)} className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'>
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1.5'>Confirm New Password</label>
                <div className='relative'>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder='Confirm new password'
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className='w-full px-4 py-3 pr-11 border border-gray-200 rounded-xl text-sm hover:border-gray-300 focus:outline-none focus:border-teal-400 transition-colors'
                  />
                  <button type='button' onClick={() => setShowConfirmPassword(!showConfirmPassword)} className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'>
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <button
                type='submit'
                disabled={passwordLoading}
                className='w-full py-3 text-white font-semibold rounded-xl bg-slate-700 hover:bg-slate-800 transition-colors disabled:opacity-50 text-sm'
              >
                {passwordLoading ? 'Changing...' : 'Update Password'}
              </button>
            </form>
          )}

          {/* Sign out & Delete */}
          <div className='mt-6 pt-6 border-t border-gray-100 space-y-3'>
            <button
              onClick={() => setShowSignOutModal(true)}
              className='flex items-center justify-center gap-2 w-full py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors'
            >
              <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
              </svg>
              Sign Out
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className='flex items-center justify-center gap-2 w-full py-3 text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-50 rounded-xl transition-colors'
            >
              <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
              </svg>
              Delete Account
            </button>
          </div>

          {/* Messages */}
          {error && (
            <div className='mt-4 p-3 bg-red-50 border border-red-100 rounded-xl'>
              <p className='text-sm text-red-600'>{error}</p>
            </div>
          )}
          {updateSuccess && (
            <div className='mt-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl'>
              <p className='text-sm text-emerald-600'>Profile updated successfully!</p>
            </div>
          )}
        </div>
      </div>

      {showSignOutModal && (
        <ConfirmModal
          title='Sign Out'
          message='Are you sure you want to sign out?'
          confirmText='Yes, Sign out'
          onConfirm={() => {
            setShowSignOutModal(false);
            handleSignOut();
          }}
          onCancel={() => setShowSignOutModal(false)}
        />
      )}
      {showDeleteModal && (
        <ConfirmModal
          title='Delete Account'
          message='Are you sure you want to delete your account? This action cannot be undone.'
          confirmText='Yes, Delete'
          onConfirm={() => {
            setShowDeleteModal(false);
            handleDeleteUser();
          }}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
}