import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
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
export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  // firebase storage
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*')

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
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
      dispatch(deleteUserSuccess(data));
      toast.success('Signed out successfully!');
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      toast.error('Failed to sign out');
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
      toast.success('Listing deleted successfully');
    } catch (error) {
      console.log(error.message);
      toast.error('Failed to delete listing');
    }
  };
  return (
    <div className='max-w-2xl mx-auto px-4 py-10'>
      {/* Profile Card */}
      <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
        {/* Header banner */}
        <div className='bg-slate-900 h-28'></div>
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
              <span className='text-blue-600'>{`Uploading ${filePerc}%`}</span>
            ) : filePerc === 100 ? (
              <span className='text-emerald-600'>Image uploaded successfully!</span>
            ) : (
              ''
            )}
          </p>

          <h1 className='text-xl font-bold text-slate-800 mt-3'>{currentUser.username}</h1>
          <p className='text-sm text-gray-400'>{currentUser.email}</p>

          {/* Form */}
          <form onSubmit={handleSubmit} className='mt-6 space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1.5'>Username</label>
              <input
                type='text'
                placeholder='username'
                defaultValue={currentUser.username}
                id='username'
                className='w-full px-4 py-3 border border-gray-200 rounded-xl text-sm hover:border-gray-300 focus:outline-none focus:border-blue-400 transition-colors'
                onChange={handleChange}
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1.5'>Email</label>
              <input
                type='email'
                placeholder='email'
                id='email'
                defaultValue={currentUser.email}
                className='w-full px-4 py-3 border border-gray-200 rounded-xl text-sm hover:border-gray-300 focus:outline-none focus:border-blue-400 transition-colors'
                onChange={handleChange}
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1.5'>Password</label>
              <input
                type='password'
                placeholder='New password'
                onChange={handleChange}
                id='password'
                className='w-full px-4 py-3 border border-gray-200 rounded-xl text-sm hover:border-gray-300 focus:outline-none focus:border-blue-400 transition-colors'
              />
            </div>

            <div className='flex gap-3 pt-2'>
              <button
                disabled={loading}
                className='flex-1 py-3 text-white font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm'
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <Link
                className='flex-1 py-3 text-center text-white font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 transition-colors text-sm'
                to={'/create-listing'}
              >
                Create Listing
              </Link>
            </div>
          </form>

          {/* Delete / Sign out */}
          <div className='flex justify-between mt-6 pt-6 border-t border-gray-100'>
            <button
              onClick={handleDeleteUser}
              className='text-sm text-gray-400 hover:text-red-500 transition-colors font-medium'
            >
              Delete account
            </button>
            <button
              onClick={handleSignOut}
              className='text-sm text-gray-400 hover:text-red-500 transition-colors font-medium'
            >
              Sign out
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

      {/* Show Listings Button */}
      <div className='text-center mt-8'>
        <button
          onClick={handleShowListings}
          className='text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors'
        >
          View My Listings
        </button>
        {showListingsError && <p className='mt-2 text-sm text-red-500'>Error loading listings</p>}
      </div>

      {/* User Listings */}
      {userListings && userListings.length > 0 && (
        <div className='mt-8'>
          <h2 className='text-lg font-bold text-slate-800 mb-4'>Your Listings</h2>
          <div className='space-y-3'>
            {userListings.map((listing) => (
              <div
                key={listing._id}
                className='flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow'
              >
                <Link to={`/listing/${listing._id}`} className='flex-shrink-0'>
                  <div
                    className='w-20 h-16 rounded-lg bg-gray-200 bg-center bg-cover'
                    style={{ backgroundImage: `url(${listing.imageUrls[0]})` }}
                  ></div>
                </Link>
                <Link
                  className='flex-1 font-medium text-sm text-gray-800 truncate hover:text-blue-600 transition-colors'
                  to={`/listing/${listing._id}`}
                >
                  <p>{listing.name}</p>
                </Link>

                <div className='flex items-center gap-2 flex-shrink-0'>
                  <Link to={`/update-listing/${listing._id}`}>
                    <button className='text-xs font-semibold text-blue-600 hover:text-blue-800 px-3 py-1.5 bg-blue-50 rounded-lg transition-colors'>
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => handleListingDelete(listing._id)}
                    className='text-xs font-semibold text-red-500 hover:text-red-700 px-3 py-1.5 bg-red-50 rounded-lg transition-colors'
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}