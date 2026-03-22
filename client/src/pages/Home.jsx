import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';
import { FaSearch, FaRegCalendarCheck, FaKey, FaHome } from 'react-icons/fa';

// ===== Count-up hook =====
function useCountUp(target, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
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
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [loadingDone, setLoadingDone] = useState(false);
  SwiperCore.use([Navigation, Autoplay]);
  console.log(offerListings);

  // Count-up for stats
  const stat1 = useCountUp(200, 2000);
  const stat2 = useCountUp(150, 2000);
  const stat3 = useCountUp(50, 1500);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
        setLoadingDone(true);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
        setLoadingDone(true);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
        setLoadingDone(true);
      } catch (error) {
        log(error);
        setLoadingDone(true);
      }
    };
    fetchOfferListings();
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
      {/* ========== HERO ========== */}
      <div className='bg-slate-900 text-white'>
        <div className='max-w-6xl mx-auto px-6 py-24 lg:py-32'>
          <p className='text-blue-400 text-sm font-semibold uppercase tracking-widest mb-4 hero-animate hero-delay-1'>
            <span className='typing-animation'>Welcome to Kamankar Estate</span>
          </p>
          <h1 className='text-4xl lg:text-6xl font-extrabold leading-tight mb-6 hero-animate hero-delay-2'>
            Find your next<br />
            <span className='text-blue-400'>perfect place</span>
          </h1>
          <p className='text-slate-400 text-base sm:text-lg max-w-xl mb-10 leading-relaxed hero-animate hero-delay-3'>
            Discover the ideal property that matches your lifestyle. Whether
            you're buying, selling, or renting — we make it simple.
          </p>
          <div className='hero-animate hero-delay-4'>
            <Link
              to='/search'
              className='inline-block bg-blue-600 text-white font-semibold px-8 py-3.5 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base'
            >
              Browse Properties
            </Link>
          </div>

          {/* Stats row with count-up */}
          <div className='grid grid-cols-3 gap-8 mt-16 pt-10 border-t border-slate-700/50 max-w-lg hero-animate hero-delay-5'>
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

      {/* ========== CAROUSEL (full width, unique images) ========== */}
      {uniqueCarouselListings.length > 0 && (
        <Swiper
          navigation
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={true}
        >
          {uniqueCarouselListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <Link to={`/listing/${listing._id}`}>
                <div
                  className='h-[300px] sm:h-[400px] lg:h-[500px]'
                  style={{
                    background: `url(${listing.imageUrls[0]}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                >
                  {/* Overlay with listing info */}
                  <div className='h-full flex items-end'>
                    <div className='w-full bg-gradient-to-t from-black/70 to-transparent px-6 pb-6 pt-20'>
                      <div className='max-w-6xl mx-auto'>
                        <p className='text-white text-lg sm:text-xl font-bold'>{listing.name}</p>
                        <p className='text-gray-300 text-sm mt-1'>
                          ${listing.offer
                            ? listing.discountPrice.toLocaleString('en-US')
                            : listing.regularPrice.toLocaleString('en-US')}
                          {listing.type === 'rent' && ' / month'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* ========== HOW IT WORKS ========== */}
      <div className='bg-white'>
        <div className='max-w-6xl mx-auto px-6 py-20'>
          <div className='text-center mb-14'>
            <p className='text-blue-600 text-xs font-semibold uppercase tracking-widest mb-2'>Simple Process</p>
            <h2 className='text-2xl lg:text-3xl font-bold text-slate-800'>How It Works</h2>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {/* Step 1 */}
            <div className='text-center px-4'>
              <div className='w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-5'>
                <FaSearch className='text-blue-600 text-xl' />
              </div>
              <div className='w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold'>1</div>
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

          {/* Empty state when no listings load */}
          {loadingDone && !hasListings && (
            <div className='text-center py-16'>
              <div className='w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6'>
                <FaHome className='text-blue-400 text-4xl' />
              </div>
              <h3 className='text-2xl font-bold text-slate-800 mb-3'>No Properties Available Right Now</h3>
              <p className='text-gray-500 max-w-md mx-auto mb-8 leading-relaxed'>
                We're updating our listings. Check back soon or try searching to explore available properties in your area.
              </p>
              <div className='flex flex-col sm:flex-row gap-3 justify-center'>
                <Link
                  to='/search'
                  className='inline-block bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm'
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

          {offerListings && offerListings.length > 0 && (
            <div className='mb-16'>
              <div className='flex items-end justify-between mb-6'>
                <div>
                  <p className='text-blue-600 text-xs font-semibold uppercase tracking-widest mb-1'>Special Deals</p>
                  <h2 className='text-2xl font-bold text-slate-800'>Recent Offers</h2>
                </div>
                <Link className='text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors hidden sm:block' to={'/search?offer=true'}>
                  View all →
                </Link>
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
                {offerListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}

          {rentListings && rentListings.length > 0 && (
            <div className='mb-16'>
              <div className='flex items-end justify-between mb-6'>
                <div>
                  <p className='text-blue-600 text-xs font-semibold uppercase tracking-widest mb-1'>For Rent</p>
                  <h2 className='text-2xl font-bold text-slate-800'>Places for Rent</h2>
                </div>
                <Link className='text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors hidden sm:block' to={'/search?type=rent'}>
                  View all →
                </Link>
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
                {rentListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}

          {saleListings && saleListings.length > 0 && (
            <div>
              <div className='flex items-end justify-between mb-6'>
                <div>
                  <p className='text-blue-600 text-xs font-semibold uppercase tracking-widest mb-1'>For Sale</p>
                  <h2 className='text-2xl font-bold text-slate-800'>Places for Sale</h2>
                </div>
                <Link className='text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors hidden sm:block' to={'/search?type=sale'}>
                  View all →
                </Link>
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
                {saleListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========== CTA BANNER ========== */}
      <div className='bg-slate-900'>
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
              className='inline-block bg-blue-600 text-white font-semibold px-10 py-4 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base'
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
