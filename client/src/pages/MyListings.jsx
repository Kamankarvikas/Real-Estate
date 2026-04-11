
import { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaBed, FaBath, FaMapMarkerAlt, FaParking, FaChair, FaSearch, FaPlus, FaHome, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';

export default function MyListings() {
  const { currentUser } = useSelector((state) => state.user);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [deleteId, setDeleteId] = useState(null);
  const [viewListing, setViewListing] = useState(null);
  const pageSize = 10;

  const fetchListings = useCallback(async (page = 1, search = '', type = 'all') => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      if (search) params.set('search', search);
      if (type && type !== 'all') params.set('type', type);

      const res = await fetch(`/api/user/listings/${currentUser._id}?${params}`);
      const data = await res.json();
      if (data.success === false) {
        toast.error('Failed to load listings');
        setListings([]);
        return;
      }
      setListings(data.listings || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 0);
      setCurrentPage(data.page || 1);
    } catch (error) {
      toast.error('Something went wrong');
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser._id]);

  useEffect(() => {
    fetchListings(1, searchTerm, typeFilter);
  }, [searchTerm, typeFilter, fetchListings]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchTerm('');
  };

  const handlePageChange = (page) => {
    fetchListings(page, searchTerm, typeFilter);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/listing/delete/${deleteId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success === false) {
        toast.error('Failed to delete listing');
        return;
      }
      toast.success('Listing deleted successfully');
      fetchListings(currentPage, searchTerm, typeFilter);
    } catch (error) {
      toast.error('Failed to delete listing');
    } finally {
      setDeleteId(null);
    }
  };

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, total);

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl sm:text-3xl font-bold text-slate-800'>My Listings</h1>
            <p className='text-gray-400 text-sm mt-0.5'>{total} {total === 1 ? 'property' : 'properties'} listed</p>
          </div>
          <Link
            to='/create-listing'
            className='inline-flex items-center justify-center gap-1.5 bg-teal-600 text-white font-semibold px-3 py-2 sm:px-5 sm:py-2.5 rounded-xl hover:bg-teal-700 transition-colors text-xs sm:text-sm'
          >
            <FaPlus className='text-[10px] sm:text-xs' />
            Create Listing
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

        {/* Filters + Create (mobile) */}
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
        {loading && (
          <div className='flex items-center justify-center py-20'>
            <div className='text-center'>
              <div className='w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4'></div>
              <p className='text-gray-500 text-sm'>Loading your listings...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && listings.length === 0 && (
          <div className='py-20 text-center'>
            <div className='w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-5'>
              <FaHome className='text-teal-400 text-3xl' />
            </div>
            {searchTerm || typeFilter !== 'all' ? (
              <>
                <h3 className='text-lg font-bold text-slate-800 mb-2'>No Results Found</h3>
                <p className='text-sm text-gray-400 mb-6 max-w-sm mx-auto'>
                  No listings match your filters. Try a different search or filter.
                </p>
                <button
                  onClick={() => { handleClearSearch(); setTypeFilter('all'); }}
                  className='text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors'
                >
                  Clear All Filters
                </button>
              </>
            ) : (
              <>
                <h3 className='text-lg font-bold text-slate-800 mb-2'>No Listings Yet</h3>
                <p className='text-sm text-gray-400 mb-6 max-w-sm mx-auto'>
                  Start listing your property to reach potential buyers and renters.
                </p>
                <Link
                  to='/create-listing'
                  className='inline-flex items-center gap-2 bg-teal-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-teal-700 transition-colors text-sm'
                >
                  <FaPlus className='text-xs' />
                  Create Your First Listing
                </Link>
              </>
            )}
          </div>
        )}

        {/* Listing Cards */}
        {!loading && listings.length > 0 && (
          <>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
              {listings.map((listing) => (
                <div
                  key={listing._id}
                  className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all group'
                >
                  {/* Image */}
                  <div className='relative overflow-hidden'>
                    <div
                      className='h-48 bg-gray-200 bg-center bg-cover group-hover:scale-105 transition-transform duration-300'
                      style={{ backgroundImage: `url(${listing.imageUrls?.[0]})` }}
                    ></div>
                    <span className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full text-white shadow-sm ${listing.type === 'rent' ? 'bg-teal-600' : 'bg-emerald-600'}`}>
                      {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                    </span>
                    {listing.offer && (
                      <span className='absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full text-white shadow-sm bg-amber-500'>
                        Offer
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className='p-4'>
                    <p className='text-lg font-bold text-slate-900 mb-1'>
                      ₹{listing.offer
                        ? (listing.discountPrice || 0).toLocaleString('en-IN')
                        : (listing.regularPrice || 0).toLocaleString('en-IN')}
                      {listing.type === 'rent' && (
                        <span className='text-sm font-normal text-gray-400'>/mo</span>
                      )}
                    </p>

                    <h3 className='font-semibold text-sm text-slate-800 truncate mb-2'>{listing.name}</h3>

                    <div className='flex items-start gap-1.5 mb-3'>
                      <FaMapMarkerAlt className='text-teal-600 text-xs mt-0.5 flex-shrink-0' />
                      <p className='text-xs text-gray-500 truncate'>{listing.address}</p>
                    </div>

                    <div className='flex items-center gap-3 text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100'>
                      <span className='flex items-center gap-1'>
                        <FaBed className='text-gray-400' />
                        {listing.bedrooms || 0} {(listing.bedrooms || 0) > 1 ? 'Beds' : 'Bed'}
                      </span>
                      <span className='flex items-center gap-1'>
                        <FaBath className='text-gray-400' />
                        {listing.bathrooms || 0} {(listing.bathrooms || 0) > 1 ? 'Baths' : 'Bath'}
                      </span>
                      {listing.parking && (
                        <span className='flex items-center gap-1'><FaParking className='text-gray-400' /> Parking</span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className='flex items-center gap-2'>
                      <Link
                        to={`/update-listing/${listing._id}`}
                        className='flex-1 py-2 text-center text-xs font-semibold text-teal-600 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors'
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => setDeleteId(listing._id)}
                        className='flex-1 py-2 text-center text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors'
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setViewListing(listing)}
                        className='flex-1 py-2 text-center text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors'
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages >= 1 && (
              <div className='flex flex-col sm:flex-row items-center justify-between gap-4 mt-8'>
                <p className='text-sm text-gray-500'>
                  Showing <span className='font-semibold text-slate-700'>{startItem}-{endItem}</span> of <span className='font-semibold text-slate-700'>{total}</span> listings
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

      {/* View Listing Modal */}
      {viewListing && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4' onClick={() => setViewListing(null)}>
          <div
            className='bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto'
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image */}
            <div className='relative'>
              <div
                className='h-56 bg-gray-200 bg-center bg-cover rounded-t-2xl'
                style={{ backgroundImage: `url(${viewListing.imageUrls?.[0]})` }}
              ></div>
              <button
                onClick={() => setViewListing(null)}
                className='absolute top-3 right-3 w-9 h-9 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors'
              >
                <FaTimes className='text-sm' />
              </button>
              <div className='absolute bottom-3 left-3 flex gap-2'>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full text-white ${viewListing.type === 'rent' ? 'bg-teal-600' : 'bg-emerald-600'}`}>
                  {viewListing.type === 'rent' ? 'For Rent' : 'For Sale'}
                </span>
                {viewListing.offer && (
                  <span className='text-xs font-semibold px-3 py-1 rounded-full text-white bg-amber-500'>Offer</span>
                )}
              </div>
              {viewListing.imageUrls?.length > 1 && (
                <span className='absolute bottom-3 right-3 text-xs bg-black/50 text-white px-2.5 py-1 rounded-full'>
                  {viewListing.imageUrls.length} photos
                </span>
              )}
            </div>

            {/* Modal Content */}
            <div className='p-6'>
              <h2 className='text-xl font-bold text-slate-800 mb-1'>{viewListing.name}</h2>

              <p className='text-2xl font-bold text-teal-600 mb-3'>
                ₹{viewListing.offer
                  ? (viewListing.discountPrice || 0).toLocaleString('en-IN')
                  : (viewListing.regularPrice || 0).toLocaleString('en-IN')}
                {viewListing.type === 'rent' && <span className='text-sm font-normal text-gray-400'> / month</span>}
                {viewListing.offer && (
                  <span className='text-sm text-gray-400 line-through ml-2'>
                    ₹{(viewListing.regularPrice || 0).toLocaleString('en-IN')}
                  </span>
                )}
              </p>

              <div className='flex items-start gap-2 mb-4 pb-4 border-b border-gray-100'>
                <FaMapMarkerAlt className='text-teal-600 text-sm mt-0.5 flex-shrink-0' />
                <p className='text-sm text-gray-600'>{viewListing.address}</p>
              </div>

              {/* Features */}
              <div className='grid grid-cols-4 gap-3 mb-4 pb-4 border-b border-gray-100'>
                <div className='text-center p-3 bg-gray-50 rounded-xl'>
                  <FaBed className='text-teal-600 mx-auto mb-1' />
                  <p className='text-sm font-bold text-slate-800'>{viewListing.bedrooms || 0}</p>
                  <p className='text-[10px] text-gray-400'>Beds</p>
                </div>
                <div className='text-center p-3 bg-gray-50 rounded-xl'>
                  <FaBath className='text-teal-600 mx-auto mb-1' />
                  <p className='text-sm font-bold text-slate-800'>{viewListing.bathrooms || 0}</p>
                  <p className='text-[10px] text-gray-400'>Baths</p>
                </div>
                <div className='text-center p-3 bg-gray-50 rounded-xl'>
                  <FaParking className='text-teal-600 mx-auto mb-1' />
                  <p className='text-sm font-bold text-slate-800'>{viewListing.parking ? 'Yes' : 'No'}</p>
                  <p className='text-[10px] text-gray-400'>Parking</p>
                </div>
                <div className='text-center p-3 bg-gray-50 rounded-xl'>
                  <FaChair className='text-teal-600 mx-auto mb-1' />
                  <p className='text-sm font-bold text-slate-800'>{viewListing.furnished ? 'Yes' : 'No'}</p>
                  <p className='text-[10px] text-gray-400'>Furnished</p>
                </div>
              </div>

              {/* Description */}
              <div className='mb-4 pb-4 border-b border-gray-100'>
                <h3 className='text-sm font-bold text-slate-800 mb-2'>Description</h3>
                <p className='text-sm text-gray-600 leading-relaxed break-words whitespace-pre-wrap'>{viewListing.description}</p>
              </div>

              {/* Owner Info */}
              {(viewListing.ownerName || viewListing.ownerEmail || viewListing.ownerPhone) && (
                <div className='mb-5'>
                  <h3 className='text-sm font-bold text-slate-800 mb-2'>Contact Info</h3>
                  <div className='bg-gray-50 rounded-xl p-3 space-y-1.5 text-sm'>
                    {viewListing.ownerName && (
                      <div className='flex justify-between'>
                        <span className='text-gray-400'>Name</span>
                        <span className='text-slate-700 font-medium'>{viewListing.ownerName}</span>
                      </div>
                    )}
                    {viewListing.ownerEmail && (
                      <div className='flex justify-between'>
                        <span className='text-gray-400'>Email</span>
                        <span className='text-slate-700 font-medium'>{viewListing.ownerEmail}</span>
                      </div>
                    )}
                    {viewListing.ownerPhone && (
                      <div className='flex justify-between'>
                        <span className='text-gray-400'>Phone</span>
                        <span className='text-slate-700 font-medium'>{viewListing.ownerPhone}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <ConfirmModal
          title='Delete Listing'
          message='Are you sure you want to delete this listing? This action cannot be undone.'
          confirmText='Yes, Delete'
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
