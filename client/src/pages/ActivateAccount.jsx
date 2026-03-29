import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

export default function ActivateAccount() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link.');
      return;
    }

    const verifyAccount = async () => {
      try {
        const res = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await res.json();

        if (data.success) {
          setStatus(data.alreadyVerified ? 'already' : 'success');
          setMessage(data.message);
        } else {
          setStatus('error');
          setMessage(data.message || 'Verification failed');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
      }
    };

    verifyAccount();
  }, [searchParams]);

  return (
    <div className='min-h-screen flex'>
      {/* Left Panel */}
      <div className='hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-600 via-teal-700 to-slate-900 relative overflow-hidden'>
        <div className='absolute top-0 left-0 w-full h-full'>
          <div className='absolute top-10 right-10 w-64 h-64 bg-white/5 rounded-full'></div>
          <div className='absolute top-32 right-32 w-40 h-40 bg-white/5 rounded-full'></div>
          <div className='absolute bottom-20 left-10 w-80 h-80 bg-white/5 rounded-full'></div>
          <div className='absolute -bottom-20 right-20 w-60 h-60 bg-teal-400/10 rounded-full'></div>
        </div>

        <div className='relative flex flex-col items-center justify-center px-14 z-10 w-full text-center'>
          <h2 className='text-2xl font-bold mb-12'>
            <span className='text-white'>Kamankar</span>
            <span className='text-teal-200'>Estate</span>
          </h2>

          <h1 className='text-4xl font-extrabold text-white leading-tight mb-4'>
            Your property<br />journey starts here
          </h1>
          <p className='text-teal-100/70 text-base leading-relaxed max-w-md mb-12'>
            Buy, sell, or rent properties with confidence. Join thousands of happy users finding their perfect home.
          </p>

          <div className='flex justify-center gap-10 pt-8 border-t border-white/10 w-full'>
            <div>
              <p className='text-2xl font-bold text-white'>200+</p>
              <p className='text-teal-200/50 text-sm'>Properties</p>
            </div>
            <div>
              <p className='text-2xl font-bold text-white'>150+</p>
              <p className='text-teal-200/50 text-sm'>Clients</p>
            </div>
            <div>
              <p className='text-2xl font-bold text-white'>50+</p>
              <p className='text-teal-200/50 text-sm'>Cities</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className='flex-1 flex flex-col bg-gray-50'>
        <div className='flex justify-end px-6 pt-5'>
          <Link to='/' className='text-sm font-medium text-gray-500 hover:text-teal-600 transition-colors'>
            ← Back to Home
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

            {/* Verifying */}
            {status === 'verifying' && (
              <div className='text-center'>
                <div className='w-20 h-20 mx-auto mb-8 relative'>
                  <div className='w-20 h-20 border-4 border-teal-100 rounded-full'></div>
                  <div className='absolute inset-0 w-20 h-20 border-4 border-teal-600 border-t-transparent rounded-full animate-spin'></div>
                </div>
                <h2 className='text-2xl font-bold text-slate-800 mb-3'>Verifying Your Account</h2>
                <p className='text-gray-400 text-sm'>Please wait while we verify your email address...</p>
              </div>
            )}

            {/* Success */}
            {status === 'success' && (
              <div className='text-center'>
                <div className='w-24 h-24 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-teal-100'>
                  <div className='w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center'>
                    <svg className='w-8 h-8 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M5 13l4 4L19 7' />
                    </svg>
                  </div>
                </div>

                <h2 className='text-2xl font-bold text-slate-800 mb-2'>Account Verified!</h2>
                <p className='text-gray-400 text-sm mb-8 max-w-xs mx-auto leading-relaxed'>
                  Your email has been verified successfully. You're all set to explore properties, save favorites, and connect with owners.
                </p>

                <div className='bg-teal-50 rounded-xl p-4 mb-8'>
                  <div className='flex items-center justify-center gap-2 mb-2'>
                    <svg className='w-4 h-4 text-teal-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' />
                    </svg>
                    <p className='text-teal-700 text-sm font-semibold'>Email Verified</p>
                  </div>
                  <p className='text-teal-600/70 text-xs'>Your account is now secure and ready to use</p>
                </div>

                <Link
                  to='/sign-in'
                  className='inline-block w-full py-3.5 text-white font-semibold rounded-xl bg-teal-600 hover:bg-teal-700 transition-colors text-sm'
                >
                  Sign In to Your Account
                </Link>

                <Link
                  to='/'
                  className='inline-block w-full py-3 text-gray-500 font-medium text-sm mt-3 hover:text-teal-600 transition-colors'
                >
                  Go to Homepage
                </Link>
              </div>
            )}

            {/* Already Verified */}
            {status === 'already' && (
              <div className='text-center'>
                <div className='w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-blue-100'>
                  <div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center'>
                    <svg className='w-8 h-8 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                    </svg>
                  </div>
                </div>

                <h2 className='text-2xl font-bold text-slate-800 mb-2'>Already Verified</h2>
                <p className='text-gray-400 text-sm mb-8 max-w-xs mx-auto leading-relaxed'>
                  Great news! Your account is already verified. You can sign in anytime to access your properties.
                </p>

                <Link
                  to='/sign-in'
                  className='inline-block w-full py-3.5 text-white font-semibold rounded-xl bg-teal-600 hover:bg-teal-700 transition-colors text-sm'
                >
                  Sign In
                </Link>
              </div>
            )}

            {/* Error */}
            {status === 'error' && (
              <div className='text-center'>
                <div className='w-24 h-24 bg-gradient-to-br from-red-50 to-orange-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-red-100'>
                  <div className='w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center'>
                    <svg className='w-8 h-8 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M6 18L18 6M6 6l12 12' />
                    </svg>
                  </div>
                </div>

                <h2 className='text-2xl font-bold text-slate-800 mb-2'>Verification Failed</h2>
                <p className='text-gray-400 text-sm mb-3 max-w-xs mx-auto leading-relaxed'>
                  {message}
                </p>
                <p className='text-gray-300 text-xs mb-8'>
                  The link may have expired or is invalid. Please try creating a new account or request a new verification link.
                </p>

                <Link
                  to='/sign-up'
                  className='inline-block w-full py-3.5 text-white font-semibold rounded-xl bg-teal-600 hover:bg-teal-700 transition-colors text-sm'
                >
                  Create New Account
                </Link>

                <Link
                  to='/sign-in'
                  className='inline-block w-full py-3 text-gray-500 font-medium text-sm mt-3 hover:text-teal-600 transition-colors'
                >
                  Back to Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
