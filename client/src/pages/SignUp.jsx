import React from 'react';
import { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import OAuth from '../components/OAuth';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
export default function Signout() {
  const[formData,setFormData]=useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [error,setError]=useState(null);
  const [loading,setloading]=useState(false);
  const navigate = useNavigate();
   const handleChange=(e)=>{
    setFormData({
      ...formData,
      [e.target.id]:e.target.value,
    });
   };
   const handleSubmit = async (e) =>{
    e.preventDefault();

    // Validation
    if (!formData.username || !formData.username.trim()) {
      toast.error('Please enter a username');
      return;
    }
    if (formData.username.trim().length < 3) {
      toast.error('Username must be at least 3 characters');
      return;
    }
    if (!formData.email || !formData.email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (!formData.password || !formData.password.trim()) {
      toast.error('Please enter a password');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try{
      setloading(true);
      const res = await fetch('/api/auth/signup',
      {
        method : 'POST',
        headers: {
          'Content-Type':'application/json',
        },
        body:JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success === false){
        setloading(false);
        setError(data.message);
        toast.error(data.message || 'Sign up failed');
        return;
      }
      setloading(false);
      setError(null);
      toast.success('Account created successfully! Please sign in.');
      navigate('/sign-in');

    }catch(error){
       setloading(false);
       setError(error.message);
       toast.error('Something went wrong. Please try again.');
    }

   };
  return (
    <div className='min-h-screen flex'>
      {/* Left Panel - Desktop only */}
      <div className='hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-900 relative overflow-hidden'>
        {/* Decorative shapes */}
        <div className='absolute top-0 left-0 w-full h-full'>
          <div className='absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full'></div>
          <div className='absolute top-40 left-40 w-40 h-40 bg-white/5 rounded-full'></div>
          <div className='absolute bottom-10 right-10 w-80 h-80 bg-white/5 rounded-full'></div>
          <div className='absolute -top-10 right-20 w-60 h-60 bg-emerald-400/10 rounded-full'></div>
        </div>

        <div className='relative flex flex-col items-center justify-center px-14 z-10 w-full text-center'>
          {/* Logo */}
          <h2 className='text-2xl font-bold mb-12'>
            <span className='text-white'>Kamankar</span>
            <span className='text-emerald-200'>Estate</span>
          </h2>

          {/* Content */}
          <h1 className='text-4xl font-extrabold text-white leading-tight mb-4'>
            Start your real<br />estate journey today
          </h1>
          <p className='text-emerald-100/70 text-base leading-relaxed max-w-md mb-10'>
            Create an account to save your favorite properties, list your own, and connect with buyers and renters across India.
          </p>

          {/* Features list */}
          <div className='space-y-4 mb-12'>
            <div className='flex items-center gap-3 justify-center'>
              <div className='w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0'>
                <svg className='w-4 h-4 text-emerald-300' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' /></svg>
              </div>
              <p className='text-white/80 text-sm'>Save and manage your favorite listings</p>
            </div>
            <div className='flex items-center gap-3 justify-center'>
              <div className='w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0'>
                <svg className='w-4 h-4 text-emerald-300' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' /></svg>
              </div>
              <p className='text-white/80 text-sm'>List your properties for free</p>
            </div>
            <div className='flex items-center gap-3 justify-center'>
              <div className='w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0'>
                <svg className='w-4 h-4 text-emerald-300' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' /></svg>
              </div>
              <p className='text-white/80 text-sm'>Connect directly with property owners</p>
            </div>
          </div>

          {/* Quote */}
          <div className='border-t border-white/10 pt-6 w-full'>
            <p className='text-white/50 text-sm italic'>"Finding my dream home was so easy with Kamankar Estate!"</p>
            <p className='text-white/30 text-xs mt-2'>— Happy Customer</p>
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

          <h1 className='text-2xl font-bold text-slate-800 mb-1 text-center'>Create Account</h1>
          <p className='text-gray-400 text-sm mb-8 text-center'>Join thousands of users finding their dream property</p>

          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1.5'>Name <span className='text-red-400'>*</span></label>
              <input
                type='text'
                placeholder='Enter your full name'
                className='w-full px-4 py-3 border border-gray-200 rounded-xl text-sm hover:border-gray-300 focus:outline-none focus:border-teal-400 transition-colors bg-white'
                id='username'
                onChange={handleChange}
              />
            </div>
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
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

            <div className='flex items-center gap-4 my-2'>
              <div className='flex-1 h-px bg-gray-200'></div>
              <span className='text-xs font-medium text-gray-400'>OR</span>
              <div className='flex-1 h-px bg-gray-200'></div>
            </div>

            <OAuth/>
          </form>

          <p className='text-center text-sm text-gray-500 mt-8'>
            Already have an account?{' '}
            <Link to="/sign-in" className='font-semibold text-teal-600 hover:text-teal-800 transition-colors'>
              Sign in
            </Link>
          </p>
        </div>
        </div>
      </div>
    </div>
  )
}
