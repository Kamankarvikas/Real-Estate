
import { FaSearch } from 'react-icons/fa';
import { HiMenu, HiX } from 'react-icons/hi';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { signOutUserStart, signOutUserSuccess, signOutUserFailure } from '../redux/user/userSlice';
import toast from 'react-hot-toast';
import ConfirmModal from './ConfirmModal';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const isActive = (path) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        toast.error('Failed to sign out');
        return;
      }
      localStorage.removeItem('access_token');
      dispatch(signOutUserSuccess(data));
      toast.success('Signed out successfully');
      setMenuOpen(false);
      navigate('/');
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
      toast.error('Failed to sign out');
    }
  };

  return (
    <header className='bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50'>
      <div className='flex items-center justify-between max-w-6xl px-4 py-3 mx-auto gap-3'>
        {/* Logo */}
        <Link to='/' className='flex-shrink-0'>
          <h1 className='text-lg sm:text-xl font-bold tracking-tight'>
            <span className='text-slate-800'>Kamankar</span>
            <span className='text-teal-600'>Estate</span>
          </h1>
        </Link>

        {/* Desktop nav */}
        <nav className='hidden sm:flex items-center gap-1 flex-shrink-0'>
          <Link
            to='/'
            className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${isActive('/') ? 'text-teal-700 bg-teal-50' : 'text-gray-600 hover:text-teal-600 hover:bg-gray-50'}`}
          >
            Home
          </Link>
          <Link
            to='/about'
            className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${isActive('/about') ? 'text-teal-700 bg-teal-50' : 'text-gray-600 hover:text-teal-600 hover:bg-gray-50'}`}
          >
            About
          </Link>
          <Link
            to='/search'
            className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${isActive('/search') ? 'text-teal-700 bg-teal-50' : 'text-gray-600 hover:text-teal-600 hover:bg-gray-50'}`}
          >
            Explore
          </Link>
          {currentUser && (
            <Link
              to='/my-listings'
              className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${isActive('/my-listings') ? 'text-teal-700 bg-teal-50' : 'text-gray-600 hover:text-teal-600 hover:bg-gray-50'}`}
            >
              Listings
            </Link>
          )}

          <div className='w-px h-6 bg-gray-200 mx-2'></div>

          <Link to='/profile'>
            {currentUser ? (
              <img
                className='object-cover rounded-full h-9 w-9 border-2 border-gray-200 hover:border-teal-400 transition-colors'
                src={currentUser.avatar}
                alt='profile'
              />
            ) : (
              <span className='text-sm font-semibold text-white bg-teal-600 px-5 py-2 rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap'>
                Sign in
              </span>
            )}
          </Link>
        </nav>

        {/* Mobile: search icon + hamburger */}
        <div className='flex items-center gap-3 sm:hidden'>
          <Link to='/search'>
            <FaSearch className='text-gray-500 text-lg' />
          </Link>
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <HiX className='text-gray-700 text-2xl' />
            ) : (
              <HiMenu className='text-gray-700 text-2xl' />
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className='sm:hidden border-t border-gray-100 bg-white px-4 pb-4'>
          {/* User info at top if logged in */}
          {currentUser && (
            <div className='flex items-center gap-3 py-4 border-b border-gray-100'>
              <img
                className='w-10 h-10 rounded-full object-cover border-2 border-gray-200'
                src={currentUser.avatar}
                alt='profile'
              />
              <div>
                <p className='text-sm font-semibold text-slate-800'>{currentUser.username}</p>
                <p className='text-xs text-gray-400'>{currentUser.email}</p>
              </div>
            </div>
          )}

          {/* Mobile nav links */}
          <div className='flex flex-col gap-1 mt-2'>
            <Link
              to='/'
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${isActive('/') ? 'text-teal-700 bg-teal-50' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              Home
            </Link>
            <Link
              to='/about'
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${isActive('/about') ? 'text-teal-700 bg-teal-50' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              About
            </Link>
            <Link
              to='/search'
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${isActive('/search') ? 'text-teal-700 bg-teal-50' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              Explore Properties
            </Link>
            {currentUser && (
              <Link
                to='/my-listings'
                onClick={() => setMenuOpen(false)}
                className={`px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${isActive('/my-listings') ? 'text-teal-700 bg-teal-50' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                My Listings
              </Link>
            )}
            <Link
              to='/profile'
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${isActive('/profile') ? 'text-teal-700 bg-teal-50' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              {currentUser ? 'Profile' : 'Sign in'}
            </Link>

            {/* Sign Out */}
            {currentUser && (
              <>
                <div className='border-t border-gray-100 my-1'></div>
                <button
                  onClick={() => setShowSignOutModal(true)}
                  className='px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left'
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Sign Out Confirmation Modal */}
      {showSignOutModal && (
        <ConfirmModal
          title='Sign Out'
          message='Are you sure you want to sign out?'
          confirmText='Yes, Sign Out'
          onConfirm={() => {
            setShowSignOutModal(false);
            handleSignOut();
          }}
          onCancel={() => setShowSignOutModal(false)}
        />
      )}
    </header>
  );
}
