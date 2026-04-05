
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import About from './pages/About';
import Profile from './pages/Profile';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';
import MyListings from './pages/MyListings';
import Listing from './pages/Listing';
import Search from './pages/Search';
import ActivateAccount from './pages/ActivateAccount';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { Toaster } from 'react-hot-toast';

function Layout() {
  const location = useLocation();
  const hideHeader = ['/sign-in', '/sign-up', '/sign-Up', '/activate-account', '/forgot-password', '/reset-password'].includes(location.pathname);

  return (
    <>
      <Toaster
        position='top-center'
        toastOptions={{
          duration: 3000,
          style: {
            fontSize: '14px',
            borderRadius: '12px',
            padding: '12px 20px',
          },
          success: {
            style: { background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' },
          },
          error: {
            style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' },
          },
        }}
      />
      {!hideHeader && <Header />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route element={<PublicRoute />}>
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
        </Route>
        <Route path='/about' element={<About />} />
        <Route path='/search' element={<Search />} />
        <Route path='/activate-account' element={<ActivateAccount />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/listing/:listingId' element={<Listing />} />

        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/create-listing' element={<CreateListing />} />
          <Route path='/my-listings' element={<MyListings />} />
          <Route
            path='/update-listing/:listingId'
            element={<UpdateListing />}
          />
        </Route>
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
