
import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
import { FaBed, FaBath } from 'react-icons/fa';

export default function ListingItem({ listing }) {
  return (
    <Link to={`/listing/${listing._id}`} className='group'>
      <div className='bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col'>
        {/* Image using background-image for reliable loading */}
        <div className='relative overflow-hidden'>
          <div
            className='h-[200px] sm:h-[220px] w-full bg-gray-200 bg-center bg-cover group-hover:scale-105 transition-transform duration-500'
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

        {/* Content */}
        <div className='p-5 flex flex-col gap-2 flex-1'>
          {/* Price */}
          <p className='text-xl font-bold text-slate-900'>
            $
            {listing.offer
              ? (listing.discountPrice || 0).toLocaleString('en-US')
              : (listing.regularPrice || 0).toLocaleString('en-US')}
            {listing.type === 'rent' && (
              <span className='text-sm font-normal text-gray-400'>/mo</span>
            )}
          </p>

          {/* Name */}
          <p className='truncate font-semibold text-slate-700'>
            {listing.name}
          </p>

          {/* Location */}
          <div className='flex items-center gap-1'>
            <MdLocationOn className='h-4 w-4 text-blue-500 flex-shrink-0' />
            <p className='text-sm text-gray-500 truncate'>
              {listing.address}
            </p>
          </div>

          {/* Description */}
          <p className='text-sm text-gray-400 line-clamp-2 leading-relaxed'>
            {listing.description}
          </p>

          {/* Beds / Baths */}
          <div className='flex gap-4 mt-auto pt-3 border-t border-gray-100'>
            <div className='flex items-center gap-1.5 text-gray-500'>
              <FaBed className='text-sm text-blue-500' />
              <span className='text-xs font-semibold'>
                {listing.bedrooms || 0} {(listing.bedrooms || 0) > 1 ? 'Beds' : 'Bed'}
              </span>
            </div>
            <div className='flex items-center gap-1.5 text-gray-500'>
              <FaBath className='text-sm text-blue-500' />
              <span className='text-xs font-semibold'>
                {listing.bathrooms || 0} {(listing.bathrooms || 0) > 1 ? 'Baths' : 'Bath'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
