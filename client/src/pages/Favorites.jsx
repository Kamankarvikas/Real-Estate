import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaHome, FaSearch, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ListingItem from '../components/ListingItem';
import toast from 'react-hot-toast';
import { CardGridSkeleton } from '../components/Skeleton';

export default function Favorites() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  const fetchFavorites = useCallback(async (page = 1, search = '', type = 'all') => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      if (search) params.set('search', search);
      if (type && type !== 'all') params.set('type', type);

      const res = await fetch(`/api/favorite/my-favorites?${params}`);
      const data = await res.json();
      if (data.success === false) {
        toast.error(data.message || 'Failed to load favorites');
        setListings([]);
        return;
      }
      // Support both paginated response and array response
      const listingsData = Array.isArray(data) ? data : (data.listings || []);
      setListings(listingsData);
      setTotal(Array.isArray(data) ? data.length : (data.total || 0));
      setTotalPages(Array.isArray(data) ? 1 : (data.totalPages || 0));
      setCurrentPage(Array.isArray(data) ? 1 : (data.page || 1));
    } catch (error) {
      toast.error('Unable to load favorites. Please check your connection.');
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites(1, searchTerm, typeFilter);
  }, [searchTerm, typeFilter, fetchFavorites]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchTerm('');
  };

  const handlePageChange = (page) => {
    fetchFavorites(page, searchTerm, typeFilter);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, total);

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl sm:text-3xl font-bold text-slate-800'>My Favorites</h1>
            <p className='text-gray-400 text-sm mt-0.5'>
              {total} {total === 1 ? 'property' : 'properties'} saved
            </p>
          </div>
          <Link
            to='/search'
            className='inline-flex items-center justify-center gap-1.5 bg-teal-600 text-white font-semibold px-3 py-2 sm:px-5 sm:py-2.5 rounded-xl hover:bg-teal-700 transition-colors text-xs sm:text-sm'
          >
            Explore More
          </Link>
        </div>
      </div>

      {/* Search & Filters */}
      <div className='max-w-6xl mx-auto px-4 sm:px-6 pb-6'>
        {/* Search */}
        <form onSubmit={handleSearch} className='flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-teal-400 shadow-sm transition-colors mb-3'>
          <FaSearch className='text-gray-400 text-sm flex-shrink-0' />
          <input
            type='text'
            placeholder='Search by name or address...'
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className='w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none'
          />
          {searchInput && (
            <button type='button' onClick={handleClearSearch} className='text-gray-400 hover:text-gray-600 flex-shrink-0'>
              <FaTimes className='text-xs' />
            </button>
          )}
          <button type='submit' className='text-xs font-semibold text-teal-600 hover:text-teal-700 flex-shrink-0 pl-2 border-l border-gray-200'>
            Search
          </button>
        </form>

        {/* Type Filter */}
        <div className='flex items-center gap-2'>
          {['all', 'sale', 'rent'].map((type) => (
            <button
              key={type}
              onClick={() => { setTypeFilter(type); setCurrentPage(1); }}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 text-sm font-medium rounded-xl transition-colors ${
                typeFilter === type
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100 shadow-sm'
              }`}
            >
              {type === 'all' ? 'All' : type === 'sale' ? 'For Sale' : 'For Rent'}
            </button>
          ))}
        </div>

        {/* Active filters */}
        {(searchTerm || typeFilter !== 'all') && (
          <div className='flex items-center gap-2 mt-3 flex-wrap'>
            <span className='text-xs text-gray-400'>Filters:</span>
            {searchTerm && (
              <span className='inline-flex items-center gap-1.5 text-xs bg-teal-50 text-teal-700 px-3 py-1 rounded-full'>
                "{searchTerm}"
                <button onClick={handleClearSearch}><FaTimes className='text-[10px]' /></button>
              </span>
            )}
            {typeFilter !== 'all' && (
              <span className='inline-flex items-center gap-1.5 text-xs bg-teal-50 text-teal-700 px-3 py-1 rounded-full'>
                {typeFilter === 'sale' ? 'For Sale' : 'For Rent'}
                <button onClick={() => setTypeFilter('all')}><FaTimes className='text-[10px]' /></button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className='max-w-6xl mx-auto px-4 sm:px-6 pb-10'>
        {/* Loading */}
        {loading && <CardGridSkeleton count={8} cols={4} />}

        {/* Empty State */}
        {!loading && listings.length === 0 && (
          <div className='py-20 text-center'>
            <div className='w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5'>
              <FaHeart className='text-red-300 text-3xl' />
            </div>
            {searchTerm || typeFilter !== 'all' ? (
              <>
                <h3 className='text-lg font-bold text-slate-800 mb-2'>No Results Found</h3>
                <p className='text-sm text-gray-400 mb-6 max-w-sm mx-auto'>
                  No favorites match your filters. Try a different search or filter.
                </p>
                <button
                  onClick={() => { handleClearSearch(); setTypeFilter('all'); }}
                  className='text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors'
                >
                  Clear Filters
                </button>
              </>
            ) : (
              <>
                <h3 className='text-lg font-bold text-slate-800 mb-2'>No Favorites Yet</h3>
                <p className='text-sm text-gray-400 mb-6 max-w-sm mx-auto'>
                  Explore properties and tap the heart icon to save your favorites here.
                </p>
                <Link
                  to='/search'
                  className='inline-flex items-center gap-2 bg-teal-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-teal-700 transition-colors text-sm'
                >
                  <FaHome className='text-xs' />
                  Explore Properties
                </Link>
              </>
            )}
          </div>
        )}

        {/* Listing Cards */}
        {!loading && listings.length > 0 && (
          <>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
              {listings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} isFavorited={true} onFavoriteChange={() => fetchFavorites(currentPage, searchTerm, typeFilter)} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages >= 1 && (
              <div className='flex flex-col sm:flex-row items-center justify-between gap-4 mt-8'>
                <p className='text-sm text-gray-500'>
                  Showing <span className='font-semibold text-slate-700'>{startItem}-{endItem}</span> of <span className='font-semibold text-slate-700'>{total}</span> favorites
                </p>

                <div className='flex items-center gap-1.5'>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className='w-9 h-9 flex items-center justify-center text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
                  >
                    <FaChevronLeft className='text-xs' />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      if (totalPages <= 5) return true;
                      if (page === 1 || page === totalPages) return true;
                      if (Math.abs(page - currentPage) <= 1) return true;
                      return false;
                    })
                    .reduce((acc, page, idx, arr) => {
                      if (idx > 0 && page - arr[idx - 1] > 1) {
                        acc.push('...');
                      }
                      acc.push(page);
                      return acc;
                    }, [])
                    .map((item, idx) =>
                      item === '...' ? (
                        <span key={`dots-${idx}`} className='w-9 h-9 flex items-center justify-center text-gray-400 text-sm'>...</span>
                      ) : (
                        <button
                          key={item}
                          onClick={() => handlePageChange(item)}
                          className={`w-9 h-9 flex items-center justify-center text-sm font-medium rounded-lg transition-colors ${
                            currentPage === item
                              ? 'bg-teal-600 text-white shadow-sm'
                              : 'text-gray-600 bg-white border border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {item}
                        </button>
                      )
                    )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className='w-9 h-9 flex items-center justify-center text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
                  >
                    <FaChevronRight className='text-xs' />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
