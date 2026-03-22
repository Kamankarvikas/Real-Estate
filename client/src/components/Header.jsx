
import { FaSearch } from 'react-icons/fa';
import { HiMenu, HiX } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
    setMenuOpen(false);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className='bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50'>
      <div className='flex items-center justify-between max-w-6xl px-4 py-3 mx-auto gap-3'>
        {/* Logo */}
        <Link to='/' className='flex-shrink-0'>
          <h1 className='text-base sm:text-xl font-bold'>
            <span className='text-slate-800'>Kamankar</span>
            <span className='text-blue-600'>Estate</span>
          </h1>
        </Link>

        {/* Search bar */}
        <form
          onSubmit={handleSubmit}
          className='hidden sm:flex items-center flex-1 max-w-md mx-4 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus-within:border-blue-400 transition-colors'
        >
          <input
            type='text'
            placeholder='Search...'
            className='w-full bg-transparent focus:outline-none text-sm text-gray-700 placeholder-gray-400 min-w-0'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className='flex-shrink-0 ml-2'>
            <FaSearch className='text-gray-400 text-sm' />
          </button>
        </form>

        {/* Desktop nav */}
        <nav className='hidden sm:flex items-center gap-4 flex-shrink-0'>
          <Link to='/' className='text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors'>
            Home
          </Link>
          <Link to='/about' className='text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors'>
            About
          </Link>
          <Link to='/profile'>
            {currentUser ? (
              <img
                className='object-cover rounded-full h-8 w-8 border-2 border-gray-200'
                src={currentUser.avatar}
                alt='profile'
              />
            ) : (
              <span className='text-sm font-semibold text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap'>
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
          {/* Mobile search */}
          <form
            onSubmit={handleSubmit}
            className='flex items-center my-3 px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200'
          >
            <input
              type='text'
              placeholder='Search...'
              className='w-full bg-transparent focus:outline-none text-sm text-gray-700 placeholder-gray-400'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className='flex-shrink-0 ml-2'>
              <FaSearch className='text-gray-400 text-sm' />
            </button>
          </form>

          {/* Mobile nav links */}
          <div className='flex flex-col gap-1'>
            <Link
              to='/'
              onClick={() => setMenuOpen(false)}
              className='px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors'
            >
              Home
            </Link>
            <Link
              to='/about'
              onClick={() => setMenuOpen(false)}
              className='px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors'
            >
              About
            </Link>
            <Link
              to='/search'
              onClick={() => setMenuOpen(false)}
              className='px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors'
            >
              Search
            </Link>
            <Link
              to='/profile'
              onClick={() => setMenuOpen(false)}
              className='px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors'
            >
              {currentUser ? 'Profile' : 'Sign in'}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
