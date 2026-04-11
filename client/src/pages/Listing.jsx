
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaTag,
  FaCheckCircle,
  FaHeart,
  FaRegHeart,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import Contact from '../components/Contact';

export default function Listing() {
  SwiperCore.use([Navigation, Autoplay]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [contact, setContact] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [toggling, setToggling] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [params.listingId]);

  // Set favorited from listing data (comes from API response)
  useEffect(() => {
    if (listing && listing.favorited !== undefined) {
      setFavorited(listing.favorited);
    }
  }, [listing]);

  const handleFavoriteToggle = async () => {
    if (!currentUser) {
      toast('Please log in to keep your favorites', { icon: '⚠️' });
      navigate('/sign-in');
      return;
    }
    if (toggling) return;
    setToggling(true);
    try {
      const res = await fetch(`/api/favorite/toggle/${params.listingId}`, { method: 'POST' });
      const data = await res.json();
      if (data.success === false) {
        toast.error(data.message || 'Something went wrong');
        return;
      }
      setFavorited(data.favorited);
      toast.success(data.favorited ? 'Saved to favorites!' : 'Removed from favorites');
    } catch (error) {
      toast.error('Unable to update favorite. Please try again.');
    } finally {
      setToggling(false);
    }
  };

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main className='bg-gray-50 min-h-screen'>
      {loading && (
        <div className='flex items-center justify-center py-20'>
          <div className='text-center'>
            <div className='w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4'></div>
            <p className='text-gray-500 text-sm'>Loading property details...</p>
          </div>
        </div>
      )}
      {error && (
        <div className='flex items-center justify-center py-20'>
          <div className='text-center'>
            <p className='text-xl font-semibold text-slate-800 mb-2'>Something went wrong</p>
            <p className='text-gray-500 text-sm'>Unable to load this property. Please try again.</p>
          </div>
        </div>
      )}
      {listing && !loading && !error && (
        <div>
          {/* Image Carousel */}
          <div className='max-w-6xl mx-auto px-4 sm:px-6 pt-8'>
            <div className='relative rounded-2xl overflow-hidden shadow-lg'>
              <Swiper navigation autoplay={{ delay: 3000, disableOnInteraction: false }} loop={true}>
                {listing.imageUrls.map((url) => (
                  <SwiperSlide key={url}>
                    <div className='h-[250px] sm:h-[350px] lg:h-[420px]'>
                      <img
                        src={url}
                        alt={listing.name}
                        className='w-full h-full object-cover'
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Image count badge */}
              <div className='absolute bottom-4 right-4 z-10 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full'>
                {listing.imageUrls.length} photos
              </div>
            </div>
          </div>

          {/* Content */}
          <div className='max-w-6xl mx-auto px-4 sm:px-6 py-8'>
            <div className='flex flex-col lg:flex-row gap-8'>

              {/* Left Column - Property Details */}
              <div className='flex-1'>
                {/* Badges + Favorite */}
                <div className='flex items-center justify-between mb-4'>
                  <div className='flex flex-wrap gap-2'>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${listing.type === 'rent' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>
                      <FaTag className='text-[10px]' />
                      {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                    </span>
                    {listing.offer && (
                      <span className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700'>
                        <FaCheckCircle className='text-[10px]' />
                        Special Offer
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleFavoriteToggle}
                    disabled={toggling}
                    className='w-9 h-9 rounded-full border border-gray-200 hover:bg-red-50 flex items-center justify-center transition-colors disabled:opacity-50'
                  >
                    {favorited ? (
                      <FaHeart className='text-red-500 text-base' />
                    ) : (
                      <FaRegHeart className='text-gray-400 text-base' />
                    )}
                  </button>
                </div>

                {/* Title & Price */}
                <h1 className='text-2xl sm:text-3xl font-bold text-slate-800 mb-2 break-words'>
                  {listing.name}
                </h1>
                <div className='flex items-baseline gap-2 mb-4'>
                  <p className='text-2xl sm:text-3xl font-bold text-teal-600'>
                    ₹{listing.offer
                      ? listing.discountPrice.toLocaleString('en-IN')
                      : listing.regularPrice.toLocaleString('en-IN')}
                    {listing.type === 'rent' && <span className='text-base font-normal text-gray-500'> / month</span>}
                  </p>
                  {listing.offer && (
                    <p className='text-base text-gray-400 line-through'>
                      ₹{listing.regularPrice.toLocaleString('en-IN')}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div className='flex items-start gap-2 mb-6 pb-6 border-b border-gray-200'>
                  <FaMapMarkerAlt className='text-teal-600 mt-0.5 flex-shrink-0' />
                  <p className='text-gray-600 text-sm'>{listing.address}</p>
                </div>

                {/* Features Grid */}
                <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 pb-6 border-b border-gray-200'>
                  <div className='bg-white rounded-xl p-4 text-center border border-gray-100'>
                    <FaBed className='text-teal-600 text-xl mx-auto mb-2' />
                    <p className='text-lg font-bold text-slate-800'>{listing.bedrooms || 0}</p>
                    <p className='text-xs text-gray-500'>{(listing.bedrooms || 0) > 1 ? 'Bedrooms' : 'Bedroom'}</p>
                  </div>
                  <div className='bg-white rounded-xl p-4 text-center border border-gray-100'>
                    <FaBath className='text-teal-600 text-xl mx-auto mb-2' />
                    <p className='text-lg font-bold text-slate-800'>{listing.bathrooms || 0}</p>
                    <p className='text-xs text-gray-500'>{(listing.bathrooms || 0) > 1 ? 'Bathrooms' : 'Bathroom'}</p>
                  </div>
                  <div className='bg-white rounded-xl p-4 text-center border border-gray-100'>
                    <FaParking className='text-teal-600 text-xl mx-auto mb-2' />
                    <p className='text-lg font-bold text-slate-800'>{listing.parking ? 'Yes' : 'No'}</p>
                    <p className='text-xs text-gray-500'>Parking</p>
                  </div>
                  <div className='bg-white rounded-xl p-4 text-center border border-gray-100'>
                    <FaChair className='text-teal-600 text-xl mx-auto mb-2' />
                    <p className='text-lg font-bold text-slate-800'>{listing.furnished ? 'Yes' : 'No'}</p>
                    <p className='text-xs text-gray-500'>Furnished</p>
                  </div>
                </div>

                {/* Description */}
                <div className='mb-6'>
                  <h2 className='text-lg font-bold text-slate-800 mb-3'>About this property</h2>
                  <p className='text-gray-600 text-sm leading-relaxed break-words whitespace-pre-wrap'>
                    {listing.description}
                  </p>
                </div>

                {/* Offer savings */}
                {listing.offer && (
                  <div className='bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6'>
                    <p className='text-emerald-800 text-sm font-semibold'>
                      You save ₹{(+listing.regularPrice - +listing.discountPrice).toLocaleString('en-IN')} with this offer!
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column - Contact */}
              <div className='lg:w-[380px] flex-shrink-0'>
                <div className='lg:sticky lg:top-6'>
                  {listing.userRef !== (currentUser?._id) && !contact && (
                    <div className='bg-white border border-gray-200 rounded-2xl p-6 shadow-sm'>
                      <h3 className='text-lg font-bold text-slate-800 mb-2'>Interested in this property?</h3>
                      <p className='text-sm text-gray-500 mb-5'>Get in touch with the property owner to schedule a visit or ask questions.</p>
                      <button
                        onClick={() => {
                          if (!currentUser) {
                            navigate(`/sign-in?redirect=/listing/${params.listingId}`);
                            return;
                          }
                          setContact(true);
                        }}
                        className='w-full py-3.5 text-white font-semibold rounded-xl bg-teal-600 hover:bg-teal-700 transition-colors text-sm'
                      >
                        Contact Owner
                      </button>
                      {!currentUser && (
                        <p className='text-xs text-gray-400 text-center mt-3'>Sign in required to contact owner</p>
                      )}
                    </div>
                  )}
                  {contact && <Contact listing={listing} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
