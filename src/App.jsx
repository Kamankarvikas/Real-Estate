import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Home from './pages/Home';
import Signin from './pages/Signin';
import Signout from './pages/Signout';
import About from './pages/About';
import Profile from './pages/Profile';
import Header from './components/Header';

export default function App() {
  return (
    <div>
      {/* <h1 className='text-red-500'>vikas kamankar</h1> */}
      <BrowserRouter>
      <Header/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/sign-in" element={<Signin/>}/>
          <Route path="/sign-out" element={<Signout/>}/>
          <Route path="/Profile" element={<Profile/>}/>
          <Route path="/About" element={<About/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}
