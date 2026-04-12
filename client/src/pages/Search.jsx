
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';
import { CardGridSkeleton } from '../components/Skeleton';

export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: '',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });

  const PAGE_SIZE = 10;
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || '',
        parking: parkingFromUrl === 'true' ? true : false,
        furnished: furnishedFromUrl === 'true' ? true : false,
        offer: offerFromUrl === 'true' ? true : false,
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const pageFromUrl = parseInt(urlParams.get('page')) || 1;
    setCurrentPage(pageFromUrl);

    const fetchListings = async () => {
      setLoading(true);
      const apiParams = new URLSearchParams();
      apiParams.set('page', String(pageFromUrl));
      apiParams.set('pageSize', String(PAGE_SIZE));
      if (searchTermFromUrl) apiParams.set('searchTerm', searchTermFromUrl);
      if (typeFromUrl && typeFromUrl !== 'all') apiParams.set('type', typeFromUrl);
      if (parkingFromUrl === 'true') apiParams.set('parking', 'true');
      if (furnishedFromUrl === 'true') apiParams.set('furnished', 'true');
      if (offerFromUrl === 'true') apiParams.set('offer', 'true');
      if (sortFromUrl) apiParams.set('sort', sortFromUrl);
      if (orderFromUrl) apiParams.set('order', orderFromUrl);
      const res = await fetch(`/api/listing/get?${apiParams.toString()}`);
      const data = await res.json();
      setListings(data.listings);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === 'all' ||
      e.target.id === 'rent' ||
      e.target.id === 'sale'
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === 'true' ? true : false,
      });
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at';

      const order = e.target.value.split('_')[1] || 'desc';

      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    if (sidebardata.searchTerm) urlParams.set('searchTerm', sidebardata.searchTerm);
    if (sidebardata.type && sidebardata.type !== 'all') urlParams.set('type', sidebardata.type);
    if (sidebardata.parking) urlParams.set('parking', 'true');
    if (sidebardata.furnished) urlParams.set('furnished', 'true');
    if (sidebardata.offer) urlParams.set('offer', 'true');
    if (sidebardata.sort !== 'created_at') urlParams.set('sort', sidebardata.sort);
    if (sidebardata.order !== 'desc') urlParams.set('order', sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(searchQuery ? `/search?${searchQuery}` : '/search');
  };

  const hasActiveFilters = sidebardata.searchTerm || sidebardata.type || sidebardata.parking || sidebardata.furnished || sidebardata.offer || sidebardata.sort !== 'created_at' || sidebardata.order !== 'desc';

  const clearFilters = () => {
    setSidebardata({
      searchTerm: '',
      type: '',
      parking: false,
      furnished: false,
      offer: false,
      sort: 'created_at',
      order: 'desc',
    });
    navigate('/search');
  };

  const goToPage = (page) => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('page', String(page));
    navigate(`/search?${urlParams.toString()}`);
  };
  return (
    <div className='flex flex-col md:flex-row min-h-screen bg-gray-50'>
      <div className='w-full md:w-80 lg:w-96 bg-white md:min-h-screen md:shadow-lg'>
        <div className='p-6'>
          {/* Mobile: Search bar + filter toggle */}
          <div className='md:hidden'>
            <form onSubmit={handleSubmit}>
              <div className='flex items-center gap-2'>
                <div className='relative flex-1'>
                  <svg className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                  </svg>
                  <input
                    type='text'
                    id='searchTerm'
                    placeholder='Search properties...'
                    className='w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-all'
                    value={sidebardata.searchTerm}
                    onChange={handleChange}
                  />
                </div>
                <button
                  type='button'
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center justify-center w-10 h-10 rounded-xl border transition-all shrink-0 ${showFilters ? 'bg-teal-50 border-teal-400 text-teal-600' : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'}`}
                >
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z' />
                  </svg>
                </button>
                <button
                  type='submit'
                  className='flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md shadow-teal-200 shrink-0 hover:from-teal-600 hover:to-teal-700 transition-all active:scale-95'
                >
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                  </svg>
                </button>
              </div>
            </form>

            {/* Collapsible filters on mobile */}
            {showFilters && (
              <div className='mt-4 pt-4 border-t border-gray-100'>
                <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
                  {/* Property Type */}
                  <div>
                    <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3'>
                      Property Type
                    </label>
                    <div className='grid grid-cols-2 gap-2'>
                      <label htmlFor='all-mobile' className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border cursor-pointer transition-all text-sm ${sidebardata.type === 'all' ? 'border-teal-400 bg-teal-50 text-teal-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}>
                        <input
                          type='checkbox'
                          id='all'
                          className='w-4 h-4 rounded accent-teal-500'
                          onChange={handleChange}
                          checked={sidebardata.type === 'all'}
                        />
                        <span className='font-medium'>Rent & Sale</span>
                      </label>
                      <label htmlFor='rent-mobile' className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border cursor-pointer transition-all text-sm ${sidebardata.type === 'rent' ? 'border-teal-400 bg-teal-50 text-teal-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}>
                        <input
                          type='checkbox'
                          id='rent'
                          className='w-4 h-4 rounded accent-teal-500'
                          onChange={handleChange}
                          checked={sidebardata.type === 'rent'}
                        />
                        <span className='font-medium'>Rent</span>
                      </label>
                      <label htmlFor='sale-mobile' className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border cursor-pointer transition-all text-sm ${sidebardata.type === 'sale' ? 'border-teal-400 bg-teal-50 text-teal-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}>
                        <input
                          type='checkbox'
                          id='sale'
                          className='w-4 h-4 rounded accent-teal-500'
                          onChange={handleChange}
                          checked={sidebardata.type === 'sale'}
                        />
                        <span className='font-medium'>Sale</span>
                      </label>
                      <label htmlFor='offer-mobile' className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border cursor-pointer transition-all text-sm ${sidebardata.offer ? 'border-teal-400 bg-teal-50 text-teal-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}>
                        <input
                          type='checkbox'
                          id='offer'
                          className='w-4 h-4 rounded accent-teal-500'
                          onChange={handleChange}
                          checked={sidebardata.offer}
                        />
                        <span className='font-medium'>Offer</span>
                      </label>
                    </div>
                  </div>

                  <hr className='border-gray-100' />

                  {/* Amenities */}
                  <div>
                    <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3'>
                      Amenities
                    </label>
                    <div className='grid grid-cols-2 gap-2'>
                      <label htmlFor='parking-mobile' className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border cursor-pointer transition-all text-sm ${sidebardata.parking ? 'border-teal-400 bg-teal-50 text-teal-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}>
                        <input
                          type='checkbox'
                          id='parking'
                          className='w-4 h-4 rounded accent-teal-500'
                          onChange={handleChange}
                          checked={sidebardata.parking}
                        />
                        <span className='font-medium'>Parking</span>
                      </label>
                      <label htmlFor='furnished-mobile' className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border cursor-pointer transition-all text-sm ${sidebardata.furnished ? 'border-teal-400 bg-teal-50 text-teal-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}>
                        <input
                          type='checkbox'
                          id='furnished'
                          className='w-4 h-4 rounded accent-teal-500'
                          onChange={handleChange}
                          checked={sidebardata.furnished}
                        />
                        <span className='font-medium'>Furnished</span>
                      </label>
                    </div>
                  </div>

                  <hr className='border-gray-100' />

                  {/* Sort */}
                  <div>
                    <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2'>
                      Sort By
                    </label>
                    <div className='relative'>
                      <select
                        onChange={handleChange}
                        defaultValue={'created_at_desc'}
                        id='sort_order'
                        className='w-full px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-all appearance-none cursor-pointer'
                      >
                        <option value='regularPrice_desc'>Price high to low</option>
                        <option value='regularPrice_asc'>Price low to hight</option>
                        <option value='createdAt_desc'>Latest</option>
                        <option value='createdAt_asc'>Oldest</option>
                      </select>
                      <svg className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                      </svg>
                    </div>
                  </div>

                  {/* Apply Filters Button */}
                  <button className='w-full py-3 text-sm font-semibold text-white uppercase tracking-wider rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-md shadow-teal-200 hover:shadow-lg hover:shadow-teal-200 transition-all active:scale-[0.98]'>
                    Apply Filters
                  </button>
                  {hasActiveFilters && (
                    <button
                      type='button'
                      onClick={clearFilters}
                      className='w-full py-2.5 text-sm font-medium text-gray-500 rounded-xl border border-gray-200 hover:bg-gray-50 hover:text-gray-700 transition-all'
                    >
                      Clear Filters
                    </button>
                  )}
                </form>
              </div>
            )}
          </div>

          {/* Desktop: Full sidebar */}
          <div className='hidden md:block'>
            <h2 className='text-lg font-bold text-slate-800 mb-1'>Filter Properties</h2>
            <p className='text-sm text-gray-400 mb-6'>Find your perfect property</p>

            <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
              {/* Search Input */}
              <div>
                <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2'>
                  Search
                </label>
                <div className='relative'>
                  <svg className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                  </svg>
                  <input
                    type='text'
                    id='searchTerm'
                    placeholder='Search properties...'
                    className='w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-all'
                    value={sidebardata.searchTerm}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <hr className='border-gray-100' />

              {/* Property Type */}
              <div>
                <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3'>
                  Property Type
                </label>
                <div className='grid grid-cols-2 gap-2'>
                  <label htmlFor='all' className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border cursor-pointer transition-all text-sm ${sidebardata.type === 'all' ? 'border-teal-400 bg-teal-50 text-teal-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}>
                    <input
                      type='checkbox'
                      id='all'
                      className='w-4 h-4 rounded accent-teal-500'
                      onChange={handleChange}
                      checked={sidebardata.type === 'all'}
                    />
                    <span className='font-medium'>Rent & Sale</span>
                  </label>
                  <label htmlFor='rent' className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border cursor-pointer transition-all text-sm ${sidebardata.type === 'rent' ? 'border-teal-400 bg-teal-50 text-teal-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}>
                    <input
                      type='checkbox'
                      id='rent'
                      className='w-4 h-4 rounded accent-teal-500'
                      onChange={handleChange}
                      checked={sidebardata.type === 'rent'}
                    />
                    <span className='font-medium'>Rent</span>
                  </label>
                  <label htmlFor='sale' className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border cursor-pointer transition-all text-sm ${sidebardata.type === 'sale' ? 'border-teal-400 bg-teal-50 text-teal-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}>
                    <input
                      type='checkbox'
                      id='sale'
                      className='w-4 h-4 rounded accent-teal-500'
                      onChange={handleChange}
                      checked={sidebardata.type === 'sale'}
                    />
                    <span className='font-medium'>Sale</span>
                  </label>
                  <label htmlFor='offer' className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border cursor-pointer transition-all text-sm ${sidebardata.offer ? 'border-teal-400 bg-teal-50 text-teal-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}>
                    <input
                      type='checkbox'
                      id='offer'
                      className='w-4 h-4 rounded accent-teal-500'
                      onChange={handleChange}
                      checked={sidebardata.offer}
                    />
                    <span className='font-medium'>Offer</span>
                  </label>
                </div>
              </div>

              <hr className='border-gray-100' />

              {/* Amenities */}
              <div>
                <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3'>
                  Amenities
                </label>
                <div className='flex flex-col gap-2'>
                  <label htmlFor='parking' className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all text-sm ${sidebardata.parking ? 'border-teal-400 bg-teal-50 text-teal-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}>
                    <input
                      type='checkbox'
                      id='parking'
                      className='w-4 h-4 rounded accent-teal-500'
                      onChange={handleChange}
                      checked={sidebardata.parking}
                    />
                    <div className='flex items-center gap-2'>
                      <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' />
                      </svg>
                      <span className='font-medium'>Parking</span>
                    </div>
                  </label>
                  <label htmlFor='furnished' className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all text-sm ${sidebardata.furnished ? 'border-teal-400 bg-teal-50 text-teal-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}>
                    <input
                      type='checkbox'
                      id='furnished'
                      className='w-4 h-4 rounded accent-teal-500'
                      onChange={handleChange}
                      checked={sidebardata.furnished}
                    />
                    <div className='flex items-center gap-2'>
                      <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
                      </svg>
                      <span className='font-medium'>Furnished</span>
                    </div>
                  </label>
                </div>
              </div>

              <hr className='border-gray-100' />

              {/* Sort */}
              <div>
                <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2'>
                  Sort By
                </label>
                <div className='relative'>
                  <select
                    onChange={handleChange}
                    defaultValue={'created_at_desc'}
                    id='sort_order'
                    className='w-full px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-all appearance-none cursor-pointer'
                  >
                    <option value='regularPrice_desc'>Price high to low</option>
                    <option value='regularPrice_asc'>Price low to hight</option>
                    <option value='createdAt_desc'>Latest</option>
                    <option value='createdAt_asc'>Oldest</option>
                  </select>
                  <svg className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                  </svg>
                </div>
              </div>

              {/* Search Button */}
              <button className='w-full py-3 text-sm font-semibold text-white uppercase tracking-wider rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-md shadow-teal-200 hover:shadow-lg hover:shadow-teal-200 transition-all active:scale-[0.98]'>
                Search
              </button>
              {hasActiveFilters && (
                <button
                  type='button'
                  onClick={clearFilters}
                  className='w-full py-2.5 text-sm font-medium text-gray-500 rounded-xl border border-gray-200 hover:bg-gray-50 hover:text-gray-700 transition-all'
                >
                  Clear Filters
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
      <div className='flex-1'>
        <h1 className='px-6 py-5 text-xl font-bold border-b text-slate-800'>
          Listing results {total > 0 && <span className='text-sm font-normal text-gray-400'>({total})</span>}
        </h1>
        <div className='p-6'>
          {!loading && listings.length === 0 && (
            <div className='text-center py-16'>
              <p className='text-lg font-semibold text-slate-700 mb-1'>No listing found!</p>
              <p className='text-sm text-gray-400'>Try adjusting your search or filters</p>
            </div>
          )}
          {loading && <CardGridSkeleton count={6} cols={3} />}

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
            {!loading &&
              listings &&
              listings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} isFavorited={listing.favorited} />
              ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && !loading && (
            <div className='flex flex-col items-center gap-3 mt-8 pb-4'>
              <p className='text-xs text-gray-400'>
                Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, total)} of {total} properties
              </p>
              <div className='flex items-center justify-center flex-wrap gap-1.5'>
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-all ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100 cursor-pointer'}`}
                >
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                  </svg>
                  Prev
                </button>

                {currentPage > 2 && (
                  <button
                    onClick={() => goToPage(1)}
                    className='w-9 h-9 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100 transition-all'
                  >
                    1
                  </button>
                )}
                {currentPage > 3 && (
                  <span className='w-6 h-9 flex items-center justify-center text-gray-400 text-sm'>...</span>
                )}
                {currentPage > 1 && (
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    className='w-9 h-9 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100 transition-all'
                  >
                    {currentPage - 1}
                  </button>
                )}
                <button
                  className='w-9 h-9 text-sm font-semibold rounded-lg bg-teal-500 text-white shadow-sm'
                >
                  {currentPage}
                </button>
                {currentPage < totalPages && (
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    className='w-9 h-9 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100 transition-all'
                  >
                    {currentPage + 1}
                  </button>
                )}
                {currentPage < totalPages - 2 && (
                  <span className='w-6 h-9 flex items-center justify-center text-gray-400 text-sm'>...</span>
                )}
                {currentPage < totalPages - 1 && (
                  <button
                    onClick={() => goToPage(totalPages)}
                    className='w-9 h-9 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100 transition-all'
                  >
                    {totalPages}
                  </button>
                )}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-all ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100 cursor-pointer'}`}
                >
                  Next
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
