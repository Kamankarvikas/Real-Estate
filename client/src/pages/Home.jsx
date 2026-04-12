import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';
import { CardGridSkeleton, CarouselSkeleton } from '../components/Skeleton';
import { FaSearch, FaRegCalendarCheck, FaKey, FaHome } from 'react-icons/fa';

// ===== Count-up hook =====
function useCountUp(target, duration = 2000, enabled = true) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    if (!enabled || !ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const animate = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration, enabled]);

  return { count, ref };
}

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [loadingDone, setLoadingDone] = useState(false);
  SwiperCore.use([Navigation, Autoplay]);

  // Count-up for stats
  const stat1 = useCountUp(200, 2000, loadingDone);
  const stat2 = useCountUp(150, 2000, loadingDone);
  const stat3 = useCountUp(50, 1500, loadingDone);

  useEffect(() => {
    const fetchAllListings = async () => {
      try {
        const [offerRes, rentRes, saleRes] = await Promise.all([
          fetch('/api/listing/get?offer=true&pageSize=4'),
          fetch('/api/listing/get?type=rent&pageSize=4'),
          fetch('/api/listing/get?type=sale&pageSize=4'),
        ]);
        const [offerData, rentData, saleData] = await Promise.all([
          offerRes.json(),
          rentRes.json(),
          saleRes.json(),
        ]);
        setOfferListings(Array.isArray(offerData?.listings) ? offerData.listings : []);
        setRentListings(Array.isArray(rentData?.listings) ? rentData.listings : []);
        setSaleListings(Array.isArray(saleData?.listings) ? saleData.listings : []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingDone(true);
      }
    };
    fetchAllListings();
  }, []);

  // Combine all listings and deduplicate by _id for the carousel
  const allListings = [...offerListings, ...rentListings, ...saleListings];
  const seenIds = new Set();
  const uniqueCarouselListings = allListings.filter((listing) => {
    if (seenIds.has(listing._id)) return false;
    seenIds.add(listing._id);
    return true;
  });

  const hasListings = offerListings.length > 0 || rentListings.length > 0 || saleListings.length > 0;

  return (
    <div>
      {/* ========== MAINTENANCE BANNER ========== */}
      <div className='bg-red-600 text-white overflow-hidden py-2.5 border-b border-red-700'>
        <div className='flex whitespace-nowrap animate-marquee'>
          <span className='flex items-center gap-3 px-8 text-sm font-semibold'>
            <svg className='w-4 h-4 shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' />
            </svg>
            Server down for maintenance — user registration & some features may be temporarily unavailable. We'll be back soon!
          </span>
          <span className='flex items-center gap-3 px-8 text-sm font-semibold' aria-hidden='true'>
            <svg className='w-4 h-4 shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' />
            </svg>
            Server down for maintenance — user registration & some features may be temporarily unavailable. We'll be back soon!
          </span>
          <span className='flex items-center gap-3 px-8 text-sm font-semibold' aria-hidden='true'>
            <svg className='w-4 h-4 shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' />
            </svg>
            Server down for maintenance — user registration & some features may be temporarily unavailable. We'll be back soon!
          </span>
        </div>
      </div>

      {/* ========== HERO ========== */}
      <div className='bg-teal-900 text-white'>
        <div className='max-w-6xl mx-auto px-6 py-24 lg:py-32'>
          <p className='text-teal-400 text-sm font-semibold uppercase tracking-widest mb-4 hero-animate hero-delay-1'>
            <span className='typing-animation'>Welcome to Kamankar Estate</span>
          </p>
          <h1 className='text-4xl lg:text-6xl font-extrabold leading-tight mb-6 hero-animate hero-delay-2'>
            Find your next<br />
            <span className='text-teal-400'>perfect place</span>
          </h1>
          <p className='text-slate-400 text-base sm:text-lg max-w-xl mb-10 leading-relaxed hero-animate hero-delay-3'>
            Discover the ideal property that matches your lifestyle. Whether
            you're buying, selling, or renting — we make it simple.
          </p>
          <div className='hero-animate hero-delay-4'>
            <Link
              to='/search'
              className='inline-block bg-teal-600 text-white font-semibold px-8 py-3.5 rounded-lg hover:bg-teal-700 transition-colors text-sm sm:text-base'
            >
              Browse Properties
            </Link>
          </div>

          {/* Stats row with count-up */}
          <div className='grid grid-cols-3 gap-8 mt-16 pt-10 border-t border-teal-700/50 max-w-lg hero-animate hero-delay-5'>
            <div ref={stat1.ref}>
              <p className='text-2xl lg:text-3xl font-bold'>{stat1.count}+</p>
              <p className='text-slate-400 text-sm mt-1'>Properties</p>
            </div>
            <div ref={stat2.ref}>
              <p className='text-2xl lg:text-3xl font-bold'>{stat2.count}+</p>
              <p className='text-slate-400 text-sm mt-1'>Happy Clients</p>
            </div>
            <div ref={stat3.ref}>
              <p className='text-2xl lg:text-3xl font-bold'>{stat3.count}+</p>
              <p className='text-slate-400 text-sm mt-1'>Cities</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========== FEATURED CAROUSEL ========== */}
      {!loadingDone && (
        <div className='bg-white'>
          <div className='max-w-6xl mx-auto px-4 sm:px-6 py-12'>
            <div className='mb-6'>
              <div className='h-3 w-20 bg-gray-200 rounded animate-pulse mb-2' />
              <div className='h-7 w-44 bg-gray-200 rounded animate-pulse' />
            </div>
            <CarouselSkeleton />
          </div>
        </div>
      )}
      {loadingDone && uniqueCarouselListings.length > 0 && (
        <div className='bg-white'>
          <div className='max-w-6xl mx-auto px-4 sm:px-6 py-12'>
            <div className='flex items-end justify-between mb-6'>
              <div>
                <p className='text-teal-600 text-xs font-semibold uppercase tracking-widest mb-1'>Featured</p>
                <h2 className='text-2xl font-bold text-slate-800'>Top Properties</h2>
              </div>
            </div>
            <div className='rounded-2xl overflow-hidden shadow-lg'>
              <Swiper
                navigation
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                loop={true}
              >
                {uniqueCarouselListings.map((listing) => (
                  <SwiperSlide key={listing._id}>
                    <Link to={`/listing/${listing._id}`}>
                      <div className='relative h-[250px] sm:h-[350px] lg:h-[420px]'>
                        <img
                          src={listing.imageUrls[0]}
                          alt={listing.name}
                          className='w-full h-full object-cover'
                        />
                        {/* Type badge */}
                        <div className='absolute top-4 left-4 z-10'>
                          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full text-white shadow-md ${listing.type === 'rent' ? 'bg-teal-600' : 'bg-emerald-600'}`}>
                            {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                          </span>
                        </div>
                        {listing.offer && (
                          <div className='absolute top-4 right-4 z-10'>
                            <span className='text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-500 text-white shadow-md'>
                              Special Offer
                            </span>
                          </div>
                        )}
                        {/* Bottom overlay */}
                        <div className='absolute inset-0 flex items-end'>
                          <div className='w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent px-6 pb-5 pt-24'>
                            <p className='text-white text-lg sm:text-xl font-bold'>{listing.name}</p>
                            <div className='flex items-center gap-4 mt-1.5'>
                              <p className='text-teal-300 font-bold text-base sm:text-lg'>
                                ₹{listing.offer
                                  ? listing.discountPrice.toLocaleString('en-IN')
                                  : listing.regularPrice.toLocaleString('en-IN')}
                                {listing.type === 'rent' && <span className='text-sm font-normal text-gray-300'> / month</span>}
                              </p>
                              {listing.offer && (
                                <p className='text-gray-400 text-sm line-through'>
                                  ₹{listing.regularPrice.toLocaleString('en-IN')}
                                </p>
                              )}
                            </div>
                            <div className='flex items-center gap-3 mt-2 text-gray-300 text-xs'>
                              <span>{listing.bedrooms} {listing.bedrooms > 1 ? 'Beds' : 'Bed'}</span>
                              <span className='w-1 h-1 bg-gray-400 rounded-full'></span>
                              <span>{listing.bathrooms} {listing.bathrooms > 1 ? 'Baths' : 'Bath'}</span>
                              {listing.parking && (
                                <>
                                  <span className='w-1 h-1 bg-gray-400 rounded-full'></span>
                                  <span>Parking</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      )}

      {/* ========== HOW IT WORKS ========== */}
      <div className='bg-white'>
        <div className='max-w-6xl mx-auto px-6 py-20'>
          <div className='text-center mb-14'>
            <p className='text-teal-600 text-xs font-semibold uppercase tracking-widest mb-2'>Simple Process</p>
            <h2 className='text-2xl lg:text-3xl font-bold text-slate-800'>How It Works</h2>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {/* Step 1 */}
            <div className='text-center px-4'>
              <div className='w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-5'>
                <FaSearch className='text-teal-600 text-xl' />
              </div>
              <div className='w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold'>1</div>
              <h3 className='font-bold text-slate-800 text-lg mb-2'>Search Property</h3>
              <p className='text-gray-500 text-sm leading-relaxed'>
                Browse through our wide range of properties. Filter by location, price, type, and amenities to find what suits you.
              </p>
            </div>
            {/* Step 2 */}
            <div className='text-center px-4'>
              <div className='w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5'>
                <FaRegCalendarCheck className='text-emerald-600 text-xl' />
              </div>
              <div className='w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold'>2</div>
              <h3 className='font-bold text-slate-800 text-lg mb-2'>Schedule a Visit</h3>
              <p className='text-gray-500 text-sm leading-relaxed'>
                Contact the property owner directly through our platform and schedule a visit at your convenience.
              </p>
            </div>
            {/* Step 3 */}
            <div className='text-center px-4'>
              <div className='w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-5'>
                <FaKey className='text-amber-600 text-xl' />
              </div>
              <div className='w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold'>3</div>
              <h3 className='font-bold text-slate-800 text-lg mb-2'>Get Your Keys</h3>
              <p className='text-gray-500 text-sm leading-relaxed'>
                Finalize the deal with confidence. Move into your new home or start renting with complete peace of mind.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========== LISTINGS ========== */}
      <div className='bg-gray-50'>
        <div className='max-w-6xl mx-auto px-6 py-20'>

          {/* Loading Skeletons */}
          {!loadingDone && (
            <>
              <div className='mb-16'>
                <div className='mb-6'>
                  <div className='h-3 w-20 bg-gray-200 rounded animate-pulse mb-2' />
                  <div className='h-7 w-48 bg-gray-200 rounded animate-pulse' />
                </div>
                <CardGridSkeleton count={4} cols={4} />
              </div>
              <div className='mb-16'>
                <div className='mb-6'>
                  <div className='h-3 w-16 bg-gray-200 rounded animate-pulse mb-2' />
                  <div className='h-7 w-40 bg-gray-200 rounded animate-pulse' />
                </div>
                <CardGridSkeleton count={4} cols={4} />
              </div>
              <div>
                <div className='mb-6'>
                  <div className='h-3 w-16 bg-gray-200 rounded animate-pulse mb-2' />
                  <div className='h-7 w-40 bg-gray-200 rounded animate-pulse' />
                </div>
                <CardGridSkeleton count={4} cols={4} />
              </div>
            </>
          )}

          {/* Empty state when no listings load */}
          {loadingDone && !hasListings && (
            <div className='text-center py-16'>
              <div className='w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6'>
                <FaHome className='text-teal-400 text-4xl' />
              </div>
              <h3 className='text-2xl font-bold text-slate-800 mb-3'>No Properties Available Right Now</h3>
              <p className='text-gray-500 max-w-md mx-auto mb-8 leading-relaxed'>
                We're updating our listings. Check back soon or try searching to explore available properties in your area.
              </p>
              <div className='flex flex-col sm:flex-row gap-3 justify-center'>
                <Link
                  to='/search'
                  className='inline-block bg-teal-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-teal-700 transition-colors text-sm'
                >
                  Search Properties
                </Link>
                <Link
                  to='/create-listing'
                  className='inline-block border-2 border-slate-200 text-slate-700 font-semibold px-8 py-3 rounded-lg hover:border-slate-300 hover:bg-white transition-colors text-sm'
                >
                  List Your Property
                </Link>
              </div>
            </div>
          )}

          {loadingDone && offerListings && offerListings.length > 0 && (
            <div className='mb-16'>
              <div className='flex items-end justify-between mb-6'>
                <div>
                  <p className='text-teal-600 text-xs font-semibold uppercase tracking-widest mb-1'>Special Deals</p>
                  <h2 className='text-2xl font-bold text-slate-800'>Recent Offers</h2>
                </div>
                <Link className='text-sm font-semibold text-teal-600 hover:text-teal-800 transition-colors hidden sm:block' to={'/search?offer=true'}>
                  View all →
                </Link>
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
                {offerListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} isFavorited={listing.favorited} />
                ))}
              </div>
            </div>
          )}

          {loadingDone && rentListings && rentListings.length > 0 && (
            <div className='mb-16'>
              <div className='flex items-end justify-between mb-6'>
                <div>
                  <p className='text-teal-600 text-xs font-semibold uppercase tracking-widest mb-1'>For Rent</p>
                  <h2 className='text-2xl font-bold text-slate-800'>Places for Rent</h2>
                </div>
                <Link className='text-sm font-semibold text-teal-600 hover:text-teal-800 transition-colors hidden sm:block' to={'/search?type=rent'}>
                  View all →
                </Link>
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
                {rentListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} isFavorited={listing.favorited} />
                ))}
              </div>
            </div>
          )}

          {loadingDone && saleListings && saleListings.length > 0 && (
            <div>
              <div className='flex items-end justify-between mb-6'>
                <div>
                  <p className='text-teal-600 text-xs font-semibold uppercase tracking-widest mb-1'>For Sale</p>
                  <h2 className='text-2xl font-bold text-slate-800'>Places for Sale</h2>
                </div>
                <Link className='text-sm font-semibold text-teal-600 hover:text-teal-800 transition-colors hidden sm:block' to={'/search?type=sale'}>
                  View all →
                </Link>
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
                {saleListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} isFavorited={listing.favorited} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========== CTA BANNER ========== */}
      <div className='bg-teal-900'>
        <div className='max-w-6xl mx-auto px-6 py-20 text-center'>
          <h2 className='text-3xl lg:text-4xl font-extrabold text-white mb-4'>
            Ready to Find Your Dream Home?
          </h2>
          <p className='text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed'>
            Whether you want to buy, sell, or rent — Kamankar Estate is here to help you every step of the way. Start exploring today.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              to='/search'
              className='inline-block bg-teal-600 text-white font-semibold px-10 py-4 rounded-lg hover:bg-teal-700 transition-colors text-sm sm:text-base'
            >
              Explore Properties
            </Link>
            <Link
              to='/create-listing'
              className='inline-block border-2 border-slate-600 text-white font-semibold px-10 py-4 rounded-lg hover:bg-slate-800 transition-colors text-sm sm:text-base'
            >
              List Your Property
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
