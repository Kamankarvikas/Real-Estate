
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MdLocationOn } from 'react-icons/md';
import { FaBed, FaBath, FaHeart, FaRegHeart } from 'react-icons/fa';
import toast from 'react-hot-toast';

// Props:
// - listing: listing data (required)
// - isFavorited: favorite status from API (skips check API call when provided)
// - onFavoriteChange: callback when favorite is toggled (used to refresh Favorites page)
export default function ListingItem({ listing, isFavorited, onFavoriteChange }) {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [favorited, setFavorited] = useState(isFavorited || false);
  const [toggling, setToggling] = useState(false);

  // Sync with prop when it changes
  useEffect(() => {
    if (isFavorited !== undefined) {
      setFavorited(isFavorited);
    }
  }, [isFavorited]);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) {
      toast('Please log in to keep your favorites', { icon: '⚠️' });
      navigate('/sign-in');
      return;
    }

    if (toggling) return;
    setToggling(true);

    try {
      const res = await fetch(`/api/favorite/toggle/${listing._id}`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success === false) {
        toast.error(data.message || 'Something went wrong');
        return;
      }
      setFavorited(data.favorited);
      toast.success(data.favorited ? 'Saved to favorites!' : 'Removed from favorites');
      if (onFavoriteChange) onFavoriteChange();
    } catch (error) {
      toast.error('Unable to update favorite. Please try again.');
    } finally {
      setToggling(false);
    }
  };

  return (
    <Link to={`/listing/${listing._id}`} className='group block h-full'>
      <div className='bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col'>
        {/* Image - fixed height for consistency */}
        <div className='relative overflow-hidden flex-shrink-0'>
          <div
            className='h-48 w-full bg-gray-200 bg-center bg-cover group-hover:scale-105 transition-transform duration-500'
            style={{
              backgroundImage: `url(${
                listing.imageUrls[0] ||
                'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
              })`,
            }}
          ></div>
          {/* Type badge */}
          <div className='absolute top-3 left-3'>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full text-white shadow-sm ${listing.type === 'rent' ? 'bg-teal-600' : 'bg-emerald-600'}`}>
              {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
            </span>
          </div>
          {listing.offer && (
            <div className='absolute top-3 right-14'>
              <span className='text-xs font-semibold px-3 py-1 rounded-full bg-amber-500 text-white shadow-sm'>
                Offer
              </span>
            </div>
          )}
          {/* Favorite button */}
          <button
            onClick={handleFavoriteClick}
            className='absolute top-3 right-3 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform'
          >
            {favorited ? (
              <FaHeart className='text-red-500 text-base' />
            ) : (
              <FaRegHeart className='text-gray-500 text-base' />
            )}
          </button>
        </div>

        {/* Content - flex-1 ensures equal height cards */}
        <div className='p-4 flex flex-col flex-1'>
          {/* Price */}
          <p className='text-lg font-bold text-slate-900 mb-1'>
            ₹
            {listing.offer
              ? (listing.discountPrice || 0).toLocaleString('en-IN')
              : (listing.regularPrice || 0).toLocaleString('en-IN')}
            {listing.type === 'rent' && (
              <span className='text-sm font-normal text-gray-400'>/mo</span>
            )}
          </p>

          {/* Name */}
          <p className='truncate font-semibold text-slate-700 text-sm mb-1'>
            {listing.name}
          </p>

          {/* Location */}
          <div className='flex items-center gap-1 mb-2'>
            <MdLocationOn className='h-3.5 w-3.5 text-teal-500 flex-shrink-0' />
            <p className='text-xs text-gray-500 truncate'>
              {listing.address}
            </p>
          </div>

          {/* Description */}
          <p className='text-xs text-gray-400 line-clamp-2 leading-relaxed mb-3'>
            {listing.description}
          </p>

          {/* Beds / Baths / Likes - pushed to bottom */}
          <div className='flex items-center gap-4 mt-auto pt-3 border-t border-gray-100'>
            <div className='flex items-center gap-1.5'>
              <FaBed className='text-xs text-teal-500' />
              <span className='text-xs font-semibold text-gray-500'>
                {listing.bedrooms || 0} {(listing.bedrooms || 0) > 1 ? 'Beds' : 'Bed'}
              </span>
            </div>
            <div className='flex items-center gap-1.5'>
              <FaBath className='text-xs text-teal-500' />
              <span className='text-xs font-semibold text-gray-500'>
                {listing.bathrooms || 0} {(listing.bathrooms || 0) > 1 ? 'Baths' : 'Bath'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
