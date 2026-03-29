import React from 'react';
import { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import OAuth from '../components/OAuth';
import {signInStart,signInSuccess,signInFailure} from '../redux/user/userSlice'
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
export default function Signin() {
  const[formData,setFormData]=useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [notVerified, setNotVerified] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
 const{loading , error}=useSelector((state)=>state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

   const handleChange=(e)=>{
    setFormData({
      ...formData,
      [e.target.id]:e.target.value,
    });
   };
   const handleSubmit = async (e) =>{
    e.preventDefault();

    // Validation
    if (!formData.email || !formData.email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (!formData.password || !formData.password.trim()) {
      toast.error('Please enter your password');
      return;
    }

    try{

     dispatch(signInStart());
      const res = await fetch('/api/auth/Signin',
      {

        method : 'POST',
        headers: {
          'Content-Type':'application/json',
        },
        body:JSON.stringify(formData),
      });

      const data = await res.json();
      if(data.success === false){
      dispatch(signInFailure(data.message));
      if (data.statusCode === 403) {
        setNotVerified(true);
      }
      toast.error(data.message || 'Sign in failed');
        return;
      }
      setNotVerified(false);
      dispatch(signInSuccess(data));
      toast.success('Welcome back! Signed in successfully');
      navigate('/');

    }catch(error){

      dispatch(signInFailure(error.message));
      toast.error('Something went wrong. Please try again.');
    }

   };

  const handleResendVerification = async () => {
    if (!formData.email) {
      toast.error('Please enter your email first');
      return;
    }
    try {
      setResendLoading(true);
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Verification email sent! Check your inbox.');
      } else {
        toast.error(data.message || 'Failed to resend email');
      }
    } catch (error) {
      toast.error('Failed to resend verification email');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex'>
      {/* Left Panel - Desktop only */}
      <div className='hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-600 via-teal-700 to-slate-900 relative overflow-hidden'>
        {/* Decorative shapes */}
        <div className='absolute top-0 left-0 w-full h-full'>
          <div className='absolute top-10 right-10 w-64 h-64 bg-white/5 rounded-full'></div>
          <div className='absolute top-32 right-32 w-40 h-40 bg-white/5 rounded-full'></div>
          <div className='absolute bottom-20 left-10 w-80 h-80 bg-white/5 rounded-full'></div>
          <div className='absolute -bottom-20 right-20 w-60 h-60 bg-teal-400/10 rounded-full'></div>
        </div>

        <div className='relative flex flex-col items-center justify-center px-14 z-10 w-full text-center'>
          {/* Logo */}
          <h2 className='text-2xl font-bold mb-12'>
            <span className='text-white'>Kamankar</span>
            <span className='text-teal-200'>Estate</span>
          </h2>

          {/* Content */}
          <h1 className='text-4xl font-extrabold text-white leading-tight mb-4'>
            Welcome back to<br />your property journey
          </h1>
          <p className='text-teal-100/70 text-base leading-relaxed max-w-md mb-12'>
            Sign in to access your saved properties, manage your listings, and connect with property owners seamlessly.
          </p>

          {/* Stats */}
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

      {/* Right Panel - Form */}
      <div className='flex-1 flex flex-col bg-gray-50'>
        {/* Top bar with Home link */}
        <div className='flex justify-end px-6 pt-5'>
          <Link to='/' className='text-sm font-medium text-gray-500 hover:text-teal-600 transition-colors'>
            ← Back to Home
          </Link>
        </div>

        <div className='flex-1 flex items-center justify-center px-6 py-8'>
        <div className='w-full max-w-[420px]'>
          {/* Mobile logo */}
          <div className='text-center mb-8 lg:hidden'>
            <h2 className='text-2xl font-bold'>
              <span className='text-slate-800'>Kamankar</span>
              <span className='text-teal-600'>Estate</span>
            </h2>
          </div>

          <h1 className='text-2xl font-bold text-slate-800 mb-1 text-center'>Sign In</h1>
          <p className='text-gray-400 text-sm mb-8 text-center'>Enter your credentials to access your account</p>

          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1.5'>Email <span className='text-red-400'>*</span></label>
              <input type="email" placeholder='Enter your email'
                className='w-full px-4 py-3 border border-gray-200 rounded-xl text-sm hover:border-gray-300 focus:outline-none focus:border-teal-400 transition-colors bg-white' id='email' onChange={handleChange}/>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1.5'>Password <span className='text-red-400'>*</span></label>
              <div className='relative'>
                <input type={showPassword ? 'text' : 'password'} placeholder='Enter your password'
                  className='w-full px-4 py-3 pr-11 border border-gray-200 rounded-xl text-sm hover:border-gray-300 focus:outline-none focus:border-teal-400 transition-colors bg-white' id='password' onChange={handleChange}/>
                <button type='button' onClick={() => setShowPassword(!showPassword)} className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              className='w-full py-3 text-white font-semibold rounded-xl bg-teal-600 hover:bg-teal-700 transition-colors disabled:opacity-50 text-sm mt-2'
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className='flex items-center gap-4 my-2'>
              <div className='flex-1 h-px bg-gray-200'></div>
              <span className='text-xs font-medium text-gray-400'>OR</span>
              <div className='flex-1 h-px bg-gray-200'></div>
            </div>

            <OAuth/>
          </form>

          {notVerified && (
            <div className='mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-center'>
              <p className='text-amber-800 text-sm mb-2'>Didn’t receive the verification email?</p>
              <button
                onClick={handleResendVerification}
                disabled={resendLoading}
                className='text-sm font-semibold text-teal-600 hover:text-teal-800 transition-colors disabled:opacity-50'
              >
                {resendLoading ? 'Sending...' : 'Resend Verification Email'}
              </button>
            </div>
          )}

          <p className='text-center text-sm text-gray-500 mt-8'>
            Don't have an account?{' '}
            <Link to="/sign-Up" className='font-semibold text-teal-600 hover:text-teal-800 transition-colors'>
              Create account
            </Link>
          </p>
        </div>
        </div>
      </div>
    </div>
  )
}
