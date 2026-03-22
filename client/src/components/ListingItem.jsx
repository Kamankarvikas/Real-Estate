
import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
import { FaBed, FaBath } from 'react-icons/fa';

export default function ListingItem({ listing }) {
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
            <span className={`text-xs font-semibold px-3 py-1 rounded-full text-white shadow-sm ${listing.type === 'rent' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
              {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
            </span>
          </div>
          {listing.offer && (
            <div className='absolute top-3 right-3'>
              <span className='text-xs font-semibold px-3 py-1 rounded-full bg-amber-500 text-white shadow-sm'>
                Offer
              </span>
            </div>
          )}
        </div>

        {/* Content - flex-1 ensures equal height cards */}
        <div className='p-4 flex flex-col flex-1'>
          {/* Price */}
          <p className='text-lg font-bold text-slate-900 mb-1'>
            $
            {listing.offer
              ? (listing.discountPrice || 0).toLocaleString('en-US')
              : (listing.regularPrice || 0).toLocaleString('en-US')}
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
            <MdLocationOn className='h-3.5 w-3.5 text-blue-500 flex-shrink-0' />
            <p className='text-xs text-gray-500 truncate'>
              {listing.address}
            </p>
          </div>

          {/* Description */}
          <p className='text-xs text-gray-400 line-clamp-2 leading-relaxed mb-3'>
            {listing.description}
          </p>

          {/* Beds / Baths - pushed to bottom */}
          <div className='flex gap-4 mt-auto pt-3 border-t border-gray-100'>
            <div className='flex items-center gap-1.5'>
              <FaBed className='text-xs text-blue-500' />
              <span className='text-xs font-semibold text-gray-500'>
                {listing.bedrooms || 0} {(listing.bedrooms || 0) > 1 ? 'Beds' : 'Bed'}
              </span>
            </div>
            <div className='flex items-center gap-1.5'>
              <FaBath className='text-xs text-blue-500' />
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
