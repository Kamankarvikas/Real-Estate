import React from 'react'
import { FaEnvelope, FaPhone, FaUser, FaHome, FaHandshake, FaShieldAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div>
      {/* Hero */}
      <div className='bg-teal-900 text-white'>
        <div className='max-w-6xl mx-auto px-6 py-20 lg:py-28'>
          <p className='text-teal-400 text-xs font-semibold uppercase tracking-widest mb-4'>About Us</p>
          <h1 className='text-3xl lg:text-5xl font-extrabold leading-tight mb-4'>Kamankar Estate</h1>
          <p className='text-slate-400 text-base sm:text-lg max-w-2xl leading-relaxed'>
            Your trusted partner in finding the perfect property. We've been helping clients achieve their real estate dreams with dedication and transparency.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className='max-w-6xl mx-auto px-6 -mt-8 relative z-10'>
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
          <div className='bg-white rounded-xl shadow-md p-6 text-center border border-gray-100'>
            <p className='text-2xl font-bold text-slate-900'>200+</p>
            <p className='text-sm text-gray-500 mt-1'>Properties Listed</p>
          </div>
          <div className='bg-white rounded-xl shadow-md p-6 text-center border border-gray-100'>
            <p className='text-2xl font-bold text-slate-900'>150+</p>
            <p className='text-sm text-gray-500 mt-1'>Happy Clients</p>
          </div>
          <div className='bg-white rounded-xl shadow-md p-6 text-center border border-gray-100'>
            <p className='text-2xl font-bold text-slate-900'>50+</p>
            <p className='text-sm text-gray-500 mt-1'>Cities Covered</p>
          </div>
          <div className='bg-white rounded-xl shadow-md p-6 text-center border border-gray-100'>
            <p className='text-2xl font-bold text-slate-900'>24/7</p>
            <p className='text-sm text-gray-500 mt-1'>Support Available</p>
          </div>
        </div>
      </div>
      <div className='max-w-6xl mx-auto px-6 py-20'>
        <div className='grid lg:grid-cols-2 gap-16'>
          <div>
            <p className='text-teal-600 text-xs font-semibold uppercase tracking-widest mb-2'>Our Story</p>
            <h2 className='text-2xl lg:text-3xl font-bold text-slate-800 mb-6'>Who We Are</h2>
            <p className='text-gray-600 leading-relaxed mb-4'>
              Kamankar Estate is a leading real estate agency that specializes in helping clients buy, sell, and rent properties in the most desirable neighborhoods. Our team of experienced agents is dedicated to providing exceptional service and making the buying and selling process as smooth as possible.
            </p>
            <p className='text-gray-600 leading-relaxed'>
              Our mission is to help our clients achieve their real estate goals by providing expert advice, personalized service, and a deep understanding of the local market. Whether you are looking to buy, sell, or rent a property, we are here to help you every step of the way.
            </p>
          </div>
          <div>
            <p className='text-teal-600 text-xs font-semibold uppercase tracking-widest mb-2'>Our Promise</p>
            <h2 className='text-2xl lg:text-3xl font-bold text-slate-800 mb-6'>Why Choose Us</h2>
            <p className='text-gray-600 leading-relaxed mb-4'>
              Our team of agents has a wealth of experience and knowledge in the real estate industry, and we are committed to providing the highest level of service to our clients.
            </p>
            <p className='text-gray-600 leading-relaxed'>
              We believe that buying or selling a property should be an exciting and rewarding experience, and we are dedicated to making that a reality for each and every one of our clients.
            </p>
          </div>
        </div>
      </div>

      {/* What We Offer */}
      <div className='bg-gray-50'>
        <div className='max-w-6xl mx-auto px-6 py-20'>
          <div className='text-center mb-14'>
            <p className='text-teal-600 text-xs font-semibold uppercase tracking-widest mb-2'>What We Offer</p>
            <h2 className='text-2xl lg:text-3xl font-bold text-slate-800'>Our Core Values</h2>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm'>
              <div className='w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-4'>
                <FaHome className='text-teal-600 text-lg' />
              </div>
              <h3 className='font-bold text-slate-800 mb-2'>Wide Property Range</h3>
              <p className='text-sm text-gray-500 leading-relaxed'>From apartments to villas, commercial spaces to rental properties, we have options for every need and budget.</p>
            </div>
            <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm'>
              <div className='w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4'>
                <FaHandshake className='text-emerald-600 text-lg' />
              </div>
              <h3 className='font-bold text-slate-800 mb-2'>Trusted Transactions</h3>
              <p className='text-sm text-gray-500 leading-relaxed'>Every deal is handled with transparency and professionalism. We ensure smooth, hassle-free transactions for all parties.</p>
            </div>
            <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm'>
              <div className='w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-4'>
                <FaShieldAlt className='text-amber-600 text-lg' />
              </div>
              <h3 className='font-bold text-slate-800 mb-2'>Verified Listings</h3>
              <p className='text-sm text-gray-500 leading-relaxed'>All our property listings are verified to ensure you get accurate information and genuine deals every time.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Founder / Owner Section */}
      <div className='max-w-6xl mx-auto px-6 py-20'>
        <div className='text-center mb-14'>
          <p className='text-teal-600 text-xs font-semibold uppercase tracking-widest mb-2'>Meet The Founder</p>
          <h2 className='text-2xl lg:text-3xl font-bold text-slate-800'>The Person Behind Kamankar Estate</h2>
        </div>
        <div className='max-w-2xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden'>
          {/* Blue header bar */}
          <div className='bg-teal-900 h-24'></div>
          <div className='px-8 pb-8 -mt-10'>
            {/* Avatar */}
            <div className='w-20 h-20 bg-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg'>
              VK
            </div>
            <h3 className='text-xl font-bold text-slate-800 mt-4'>Vikas Kamankar</h3>
            <p className='text-sm text-teal-600 font-medium mb-4'>Founder & Owner</p>
            <p className='text-gray-500 text-sm leading-relaxed mb-6'>
              Vikas Kamankar is the visionary behind Kamankar Estate. With a passion for real estate and a commitment to helping people find their perfect home, he built this platform to make property buying, selling, and renting accessible and transparent for everyone.
            </p>

            {/* Contact details */}
            <div className='space-y-3'>
              <a href='mailto:vikaskamankar60@gmail.com' className='flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors'>
                <div className='w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                  <FaEnvelope className='text-teal-600 text-sm' />
                </div>
                <div>
                  <p className='text-xs text-gray-400'>Email</p>
                  <p className='text-sm font-medium text-slate-700'>vikaskamankar60@gmail.com</p>
                </div>
              </a>
              <a href='tel:+917666024267' className='flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors'>
                <div className='w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                  <FaPhone className='text-emerald-600 text-sm' />
                </div>
                <div>
                  <p className='text-xs text-gray-400'>Phone</p>
                  <p className='text-sm font-medium text-slate-700'>+91 7666024267</p>
                </div>
              </a>
              <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-xl'>
                <div className='w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                  <FaMapMarkerAlt className='text-amber-600 text-sm' />
                </div>
                <div>
                  <p className='text-xs text-gray-400'>Location</p>
                  <p className='text-sm font-medium text-slate-700'>Maharashtra, India</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className='bg-teal-900'>
        <div className='max-w-6xl mx-auto px-6 py-16 text-center'>
          <h2 className='text-2xl lg:text-3xl font-extrabold text-white mb-3'>Have Questions?</h2>
          <p className='text-slate-400 max-w-lg mx-auto mb-8'>
            Feel free to reach out to us. We're always here to help you find the perfect property.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              to='/search'
              className='inline-block bg-teal-600 text-white font-semibold px-8 py-3.5 rounded-lg hover:bg-teal-700 transition-colors text-sm'
            >
              Explore Properties
            </Link>
            <a
              href='mailto:vikaskamankar60@gmail.com'
              className='inline-block border-2 border-slate-600 text-white font-semibold px-8 py-3.5 rounded-lg hover:bg-slate-800 transition-colors text-sm'
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
