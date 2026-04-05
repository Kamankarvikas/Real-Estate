
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { FaUser, FaEnvelope, FaPhone } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function Contact({ listing }) {
  const { currentUser } = useSelector((state) => state.user);
  const [message, setMessage] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setSenderPhone(value);
  };

  const handleSendEmail = async () => {
    if (!senderPhone || senderPhone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    try {
      setSending(true);
      const res = await fetch('/api/listing/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: listing._id,
          senderName: currentUser.username,
          senderEmail: currentUser.email,
          senderPhone: senderPhone.trim(),
          message: message.trim(),
        }),
      });
      const data = await res.json();
      if (data.success === false) {
        toast.error(data.message || 'Failed to send email');
        return;
      }
      toast.success('Message sent successfully to the property owner!');
      setSent(true);
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  // Success state
  if (sent) {
    return (
      <div className='bg-white border border-gray-200 rounded-2xl p-6 shadow-sm text-center'>
        <div className='w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4'>
          <svg className='w-8 h-8 text-emerald-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
          </svg>
        </div>
        <h3 className='text-lg font-bold text-slate-800 mb-2'>Message Sent!</h3>
        <p className='text-sm text-gray-500 mb-4'>
          Your inquiry has been sent to <strong>{listing.ownerName || 'the owner'}</strong>. They will reply to your email at <strong>{currentUser.email}</strong>.
        </p>
        <button
          onClick={() => { setSent(false); setMessage(''); setSenderPhone(''); }}
          className='text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors'
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className='bg-white border border-gray-200 rounded-2xl p-6 shadow-sm'>
      {/* Owner Info Header */}
      <div className='flex items-center gap-4 mb-5 pb-5 border-b border-gray-100'>
        <div className='w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center flex-shrink-0'>
          <FaUser className='text-teal-600 text-lg' />
        </div>
        <div>
          <p className='text-sm text-gray-500'>Property Owner</p>
          <p className='font-semibold text-slate-800'>{listing.ownerName || 'N/A'}</p>
        </div>
      </div>

      {/* Owner Contact Info */}
      <div className='space-y-3 mb-5'>
        <div className='flex items-center gap-3 text-sm'>
          <div className='w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0'>
            <FaEnvelope className='text-gray-400 text-xs' />
          </div>
          <div>
            <p className='text-xs text-gray-400'>Email</p>
            <p className='text-gray-700'>{listing.ownerEmail || 'N/A'}</p>
          </div>
        </div>
        <div className='flex items-center gap-3 text-sm'>
          <div className='w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0'>
            <FaPhone className='text-gray-400 text-xs' />
          </div>
          <div>
            <p className='text-xs text-gray-400'>Phone</p>
            <p className='text-gray-700'>{listing.ownerPhone || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Property reference */}
      <div className='bg-gray-50 rounded-xl p-3 mb-5'>
        <p className='text-xs text-gray-400 uppercase tracking-wider mb-1'>Regarding</p>
        <p className='text-sm font-medium text-slate-700'>{listing.name}</p>
      </div>

      {/* Sender phone */}
      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700 mb-2'>Your Phone Number <span className='text-red-400'>*</span></label>
        <input
          type='text'
          inputMode='numeric'
          placeholder='e.g. 9876543210'
          value={senderPhone}
          onChange={handlePhoneChange}
          maxLength='10'
          className='w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal-400 transition-colors bg-white'
        />
        <p className='text-xs text-gray-400 mt-1'>{senderPhone.length}/10 digits</p>
      </div>

      {/* Message input */}
      <label className='block text-sm font-medium text-gray-700 mb-2'>Your Message <span className='text-red-400'>*</span></label>
      <textarea
        name='message'
        id='message'
        rows='4'
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder='Hi, I am interested in this property. Is it still available? I would like to schedule a visit...'
        className='w-full p-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal-400 transition-colors resize-none bg-white'
      ></textarea>

      {/* Send button */}
      {listing.ownerEmail ? (
        <button
          onClick={handleSendEmail}
          disabled={sending}
          className='flex items-center justify-center gap-2 w-full mt-4 py-3.5 text-white font-semibold rounded-xl bg-teal-600 hover:bg-teal-700 transition-colors text-sm disabled:opacity-50'
        >
          <FaEnvelope className='text-sm' />
          {sending ? 'Sending...' : 'Send Message'}
        </button>
      ) : (
        <button
          disabled
          className='flex items-center justify-center gap-2 w-full mt-4 py-3.5 text-white font-semibold rounded-xl bg-gray-300 text-sm cursor-not-allowed'
        >
          <FaEnvelope className='text-sm' />
          Email not available
        </button>
      )}

      <p className='text-xs text-gray-400 text-center mt-3'>
        The owner will receive your message via email and can reply directly
      </p>
    </div>
  );
}
