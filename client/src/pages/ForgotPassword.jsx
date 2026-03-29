import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success === false) {
        toast.error(data.message);
        return;
      }
      setSent(true);
      toast.success('Reset link sent to your email!');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Reset link sent again! Check your inbox.');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to resend. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
            Don't worry,<br />we've got you
          </h1>
          <p className='text-teal-100/70 text-base leading-relaxed max-w-md mb-12'>
            Forgot your password? It happens to the best of us. Enter your email and we'll send you a link to reset it.
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

            {!sent ? (
              <>
                {/* Icon */}
                <div className='w-20 h-20 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-teal-100'>
                  <div className='w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center'>
                    <svg className='w-7 h-7 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' />
                    </svg>
                  </div>
                </div>

                <h1 className='text-2xl font-bold text-slate-800 mb-2 text-center'>Forgot Password?</h1>
                <p className='text-gray-400 text-sm mb-8 text-center'>Enter your email address and we'll send you a link to reset your password.</p>

                <form onSubmit={handleSubmit} noValidate className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1.5'>Email Address</label>
                    <input
                      type='email'
                      placeholder='Enter your registered email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className='w-full px-4 py-3 border border-gray-200 rounded-xl text-sm hover:border-gray-300 focus:outline-none focus:border-teal-400 transition-colors bg-white'
                    />
                  </div>
                  <button
                    type='submit'
                    disabled={loading}
                    className='w-full py-3 text-white font-semibold rounded-xl bg-teal-600 hover:bg-teal-700 transition-colors disabled:opacity-50 text-sm'
                  >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </form>

                <p className='text-center text-sm text-gray-500 mt-8'>
                  Remember your password?{' '}
                  <Link to='/sign-in' className='font-semibold text-teal-600 hover:text-teal-800 transition-colors'>
                    Sign In
                  </Link>
                </p>
              </>
            ) : (
              <div className='text-center'>
                {/* Email sent icon */}
                <div className='w-24 h-24 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-teal-100'>
                  <div className='w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center'>
                    <svg className='w-8 h-8 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                    </svg>
                  </div>
                </div>

                <h2 className='text-2xl font-bold text-slate-800 mb-2'>Check Your Email</h2>
                <p className='text-gray-400 text-sm mb-1'>We've sent a password reset link to</p>
                <p className='text-teal-600 font-semibold text-sm mb-6'>{email}</p>

                <div className='bg-teal-50 rounded-xl p-4 mb-8'>
                  <p className='text-teal-700 text-sm leading-relaxed'>
                    Click the link in the email to reset your password. The link expires in <strong>1 hour</strong>.
                  </p>
                </div>

                <button
                  onClick={handleResend}
                  disabled={loading}
                  className='w-full py-3 text-teal-600 font-semibold rounded-xl border-2 border-teal-200 hover:border-teal-300 hover:bg-teal-50 transition-colors text-sm disabled:opacity-50'
                >
                  {loading ? 'Sending...' : "Didn't receive the email? Resend"}
                </button>

                <div className='mt-6 pt-6 border-t border-gray-100'>
                  <Link to='/sign-in' className='text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors'>
                    Back to Sign In
                  </Link>
                </div>

                <p className='text-gray-300 text-xs mt-8'>
                  Check your spam folder if you don't see the email in your inbox.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
