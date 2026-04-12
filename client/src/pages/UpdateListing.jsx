
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { EditFormSkeleton } from '../components/Skeleton';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setFetchingData(true);
        const listingId = params.listingId;
        const res = await fetch(`/api/listing/get/${listingId}`);
        const data = await res.json();
        if (data.success === false) {
          toast.error(data.message || 'Failed to load listing');
          return;
        }
        setFormData(data);
      } catch (err) {
        toast.error('Failed to load listing data');
      } finally {
        setFetchingData(false);
      }
    };

    fetchListing();
  }, []);

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
          toast.success(`${urls.length} image(s) uploaded successfully`);
        })
        .catch(() => {
          setImageUploadError(false);
          setUploading(false);
          toast.error('Image upload failed. Please try again.');
        });
    } else {
      toast.error('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    const res = await fetch('/api/upload/image', {
      method: 'POST',
      body: formDataUpload,
    });
    const data = await res.json();
    if (!res.ok || data.success === false) {
      throw new Error(data.message || 'Upload failed');
    }
    return data.url;
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (e.target.id === 'ownerPhone') {
      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
      setFormData({ ...formData, ownerPhone: value });
      return;
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower than regular price');
      if (!formData.ownerPhone || formData.ownerPhone.length !== 10) {
        toast.error('Please enter a valid 10-digit phone number');
        return;
      }
      setLoading(true);
      setError(false);
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
          ownerName: currentUser.username,
          ownerEmail: currentUser.email,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
        toast.error(data.message || 'Failed to update listing');
        return;
      }
      toast.success('Listing updated successfully!');
      navigate('/my-listings');
    } catch (error) {
      setError(error.message);
      setLoading(false);
      toast.error('Something went wrong. Please try again.');
    }
  };
  return (
    <div className='bg-gray-50 min-h-screen'>
      <div className='max-w-5xl mx-auto px-4 sm:px-6 py-10'>
        {/* Header */}
        <div className='mb-8'>
          <button
            type='button'
            onClick={() => navigate('/my-listings')}
            className='inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-teal-600 transition-colors mb-4'
          >
            <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' /></svg>
            Back to Listings
          </button>
          <h1 className='text-2xl lg:text-3xl font-bold text-slate-800 text-center'>Update Listing</h1>
          <p className='text-gray-500 text-sm mt-1 text-center'>Modify the details of your property listing</p>
        </div>

        {fetchingData ? (
          <EditFormSkeleton />
        ) : (
        <form onSubmit={handleSubmit} className='grid lg:grid-cols-5 gap-6'>
          {/* Left - Property Details */}
          <div className='lg:col-span-3 space-y-6'>
            {/* Basic Info Card */}
            <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4'>
              <h3 className='font-bold text-slate-800'>Property Details</h3>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1.5'>Property Name</label>
                <input
                  type='text'
                  placeholder='e.g. Modern 3BHK Apartment'
                  className='w-full px-4 py-3 border border-gray-200 rounded-xl text-sm hover:border-gray-300 focus:outline-none focus:border-teal-400 transition-colors'
                  id='name'
                  maxLength='62'
                  minLength='10'
                  required
                  onChange={handleChange}
                  value={formData.name}
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1.5'>Description</label>
                <textarea
                  placeholder='Describe your property in detail...'
                  className='w-full px-4 py-3 border border-gray-200 rounded-xl text-sm hover:border-gray-300 focus:outline-none focus:border-teal-400 transition-colors min-h-[120px] resize-none'
                  id='description'
                  required
                  maxLength='500'
                  onChange={handleChange}
                  value={formData.description}
                />
                <p className='text-xs text-gray-400 mt-1'>{(formData.description || '').length}/500 characters</p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1.5'>Address</label>
                <input
                  type='text'
                  placeholder='Full property address'
                  className='w-full px-4 py-3 border border-gray-200 rounded-xl text-sm hover:border-gray-300 focus:outline-none focus:border-teal-400 transition-colors'
                  id='address'
                  required
                  onChange={handleChange}
                  value={formData.address}
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1.5'>Contact Phone Number <span className='text-red-400'>*</span></label>
                <input
                  type='text'
                  inputMode='numeric'
                  placeholder='e.g. 9876543210'
                  className='w-full px-4 py-3 border border-gray-200 rounded-xl text-sm hover:border-gray-300 focus:outline-none focus:border-teal-400 transition-colors'
                  id='ownerPhone'
                  maxLength='10'
                  onChange={handleChange}
                  value={formData.ownerPhone || ''}
                />
                <p className='text-xs text-gray-400 mt-1'>
                  {(formData.ownerPhone || '').length}/10 digits — Visible to users who want to contact you
                </p>
              </div>
            </div>

            {/* Type & Features Card */}
            <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5'>
              <h3 className='font-bold text-slate-800'>Type & Features</h3>

              <div>
                <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3'>Listing Type</label>
                <div className='flex gap-3'>
                  {['sale', 'rent'].map((type) => (
                    <label key={type} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 cursor-pointer text-sm font-medium transition-all ${formData.type === type ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                      <input type='checkbox' id={type} className='sr-only' onChange={handleChange} checked={formData.type === type} />
                      {type === 'sale' ? 'For Sale' : 'For Rent'}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3'>Amenities</label>
                <div className='flex flex-wrap gap-3'>
                  {[
                    { id: 'parking', label: 'Parking' },
                    { id: 'furnished', label: 'Furnished' },
                    { id: 'offer', label: 'Special Offer' },
                  ].map((item) => (
                    <label key={item.id} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer text-sm transition-all ${formData[item.id] ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                      <input type='checkbox' id={item.id} className='sr-only' onChange={handleChange} checked={formData[item.id]} />
                      {item.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1.5'>Beds</label>
                  <input type='number' id='bedrooms' min='1' max='10' required className='w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal-400' onChange={handleChange} value={formData.bedrooms} />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1.5'>Baths</label>
                  <input type='number' id='bathrooms' min='1' max='10' required className='w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal-400' onChange={handleChange} value={formData.bathrooms} />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1.5'>Price {formData.type === 'rent' ? '(₹/mo)' : '(₹)'}</label>
                  <input type='number' id='regularPrice' min='50' max='10000000' required className='w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal-400' onChange={handleChange} value={formData.regularPrice} />
                </div>
                {formData.offer && (
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1.5'>Discount {formData.type === 'rent' ? '(₹/mo)' : '(₹)'}</label>
                    <input type='number' id='discountPrice' min='0' max='10000000' required className='w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal-400' onChange={handleChange} value={formData.discountPrice} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right - Images & Submit */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Upload Card */}
            <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-6'>
              <h3 className='font-bold text-slate-800 mb-1'>Photos</h3>
              <p className='text-sm text-gray-400 mb-5'>First image is the cover. Max 6 images.</p>

              <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${files.length > 0 ? 'border-teal-400 bg-teal-50/50' : 'border-gray-200 hover:border-teal-300'}`}>
                <input onChange={(e) => { setFiles(e.target.files); if (e.target.files.length > 0) toast.success(`${e.target.files.length} image(s) selected. Click "Upload Images" to proceed.`); }} className='hidden' type='file' id='images' accept='image/*' multiple />
                <label htmlFor='images' className='cursor-pointer'>
                  {files.length > 0 ? (
                    <>
                      <div className='w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3'>
                        <svg className='w-5 h-5 text-teal-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' /></svg>
                      </div>
                      <p className='text-sm font-semibold text-teal-700'>{files.length} image(s) selected</p>
                      <p className='text-xs text-teal-500 mt-1'>Click to change selection</p>
                    </>
                  ) : (
                    <>
                      <svg className='w-10 h-10 text-gray-300 mx-auto mb-3' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' /></svg>
                      <p className='text-sm text-gray-500'>Click to select images</p>
                      <p className='text-xs text-gray-400 mt-1'>PNG, JPG up to 10MB each</p>
                    </>
                  )}
                </label>
              </div>

              <button
                type='button'
                disabled={uploading || files.length === 0}
                onClick={handleImageSubmit}
                className={`w-full mt-4 py-2.5 text-sm font-semibold rounded-xl transition-all disabled:opacity-50 ${files.length > 0 ? 'bg-teal-600 text-white hover:bg-teal-700' : 'text-teal-600 border border-teal-200 hover:bg-teal-50'}`}
              >
                {uploading ? 'Uploading...' : files.length > 0 ? `Upload ${files.length} Image(s)` : 'Upload Images'}
              </button>

            </div>

            {/* Uploaded images */}
            {formData.imageUrls.length > 0 && (
              <div className='space-y-3'>
                {formData.imageUrls.map((url, index) => (
                  <div key={url} className='flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm'>
                    <div
                      className='w-16 h-16 rounded-lg bg-gray-200 bg-center bg-cover flex-shrink-0'
                      style={{ backgroundImage: `url(${url})` }}
                    ></div>
                    <div className='flex-1'>
                      <p className='text-xs text-gray-500'>Image {index + 1}{index === 0 && ' (Cover)'}</p>
                    </div>
                    <button type='button' onClick={() => handleRemoveImage(index)} className='text-xs font-semibold text-red-500 hover:text-red-700 px-3 py-1.5 bg-red-50 rounded-lg transition-colors'>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Submit */}
            <button
              disabled={loading || uploading}
              className='w-full py-3.5 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors disabled:opacity-50 text-sm shadow-sm'
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            {error && (
              <div className='p-3 bg-red-50 border border-red-100 rounded-xl'>
                <p className='text-sm text-red-600'>{error}</p>
              </div>
            )}
          </div>
        </form>
        )}
      </div>
    </div>
  );
}