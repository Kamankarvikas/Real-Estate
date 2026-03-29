import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword) {
      toast.error('Please enter a new password');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (!confirmPassword) {
      toast.error('Please confirm your new password');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Confirm password do not match');
      return;
    }
    if (!token) {
      toast.error('Invalid reset link');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();
      if (data.success === false) {
        toast.error(data.message);
        return;
      }
      setSuccess(true);
      toast.success('Password reset successfully!');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
        <div className='text-center'>
          <div className='w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6'>
            <svg className='w-10 h-10 text-red-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </div>
          <h2 className='text-2xl font-bold text-slate-800 mb-2'>Invalid Link</h2>
          <p className='text-gray-500 text-sm mb-8'>This password reset link is invalid or has expired.</p>
          <Link to='/forgot-password' className='inline-block bg-teal-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-teal-700 transition-colors text-sm'>
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex'>
      {/* Left Panel */}
      <div className='hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-600 via-teal-700 to-slate-900 relative overflow-hidden'>
        <div className='absolute top-0 left-0 w-full h-full'>
          <div className='absolute top-10 right-10 w-64 h-64 bg-white/5 rounded-full'></div>
          <div className='absolute top-32 right-32 w-40 h-40 bg-white/5 rounded-full'></div>
          <div className='absolute bottom-20 left-10 w-80 h-80 bg-white/5 rounded-full'></div>
        </div>
        <div className='relative flex flex-col items-center justify-center px-14 z-10 w-full text-center'>
          <h2 className='text-2xl font-bold mb-12'>
            <span className='text-white'>Kamankar</span>
            <span className='text-teal-200'>Estate</span>
          </h2>
          <h1 className='text-4xl font-extrabold text-white leading-tight mb-4'>
            Create a new<br />secure password
          </h1>
          <p className='text-teal-100/70 text-base leading-relaxed max-w-md'>
            Choose a strong password to keep your account safe. Use a mix of letters, numbers, and special characters.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className='flex-1 flex flex-col bg-gray-50'>
        <div className='flex justify-end px-6 pt-5'>
          <Link to='/sign-in' className='text-sm font-medium text-gray-500 hover:text-teal-600 transition-colors'>
            ← Back to Sign In
          </Link>
        </div>

        <div className='flex-1 flex items-center justify-center px-6 py-8'>
          <div className='w-full max-w-[420px]'>
            {/* Mobile logo */}
            <div className='text-center mb-10 lg:hidden'>
              <h2 className='text-2xl font-bold'>
                <span className='text-slate-800'>Kamankar</span>
                <span className='text-teal-600'>Estate</span>
              </h2>
            </div>

            {!success ? (
              <>
                {/* Icon */}
                <div className='w-20 h-20 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-teal-100'>
                  <div className='w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center'>
                    <svg className='w-7 h-7 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                    </svg>
                  </div>
                </div>

                <h1 className='text-2xl font-bold text-slate-800 mb-2 text-center'>Reset Password</h1>
                <p className='text-gray-400 text-sm mb-8 text-center'>Enter your new password below.</p>

                <form onSubmit={handleSubmit} noValidate className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1.5'>New Password</label>
                    <div className='relative'>
                      <input
                        type={showNew ? 'text' : 'password'}
                        placeholder='Enter new password (min 6 characters)'
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className='w-full px-4 py-3 pr-11 border border-gray-200 rounded-xl text-sm hover:border-gray-300 focus:outline-none focus:border-teal-400 transition-colors bg-white'
                      />
                      <button type='button' onClick={() => setShowNew(!showNew)} className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'>
                        {showNew ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1.5'>Confirm New Password</label>
                    <div className='relative'>
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        placeholder='Confirm new password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className='w-full px-4 py-3 pr-11 border border-gray-200 rounded-xl text-sm hover:border-gray-300 focus:outline-none focus:border-teal-400 transition-colors bg-white'
                      />
                      <button type='button' onClick={() => setShowConfirm(!showConfirm)} className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'>
                        {showConfirm ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                  <button
                    type='submit'
                    disabled={loading}
                    className='w-full py-3 text-white font-semibold rounded-xl bg-teal-600 hover:bg-teal-700 transition-colors disabled:opacity-50 text-sm mt-2'
                  >
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </form>
              </>
            ) : (
              <div className='text-center'>
                <div className='w-24 h-24 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-teal-100'>
                  <div className='w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center'>
                    <svg className='w-8 h-8 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M5 13l4 4L19 7' />
                    </svg>
                  </div>
                </div>

                <h2 className='text-2xl font-bold text-slate-800 mb-2'>Password Reset!</h2>
                <p className='text-gray-400 text-sm mb-8 max-w-xs mx-auto'>
                  Your password has been reset successfully. You can now sign in with your new password.
                </p>

                <Link
                  to='/sign-in'
                  className='inline-block w-full py-3.5 text-white font-semibold rounded-xl bg-teal-600 hover:bg-teal-700 transition-colors text-sm'
                >
                  Sign In to Your Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
