import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'

import Home from './pages/Home'
import Navbar from './components/Navbar'
import Layout from './pages/hotelOwner/Layout'
import Dashboard from './pages/hotelOwner/Dashboard'
import AddRoom from './pages/hotelOwner/AddRoom'
import ListRoom from './pages/hotelOwner/ListRoom'
import HotelReg from './components/HotelReg'
import { useAppContext } from './context/AppContext'
import { Toaster } from 'react-hot-toast'
import AllRooms from './pages/AllRooms'
import RoomDetails from './pages/RoomDetails'
import Footer from './components/Footer'
import MyBookings from './pages/MyBookings'
import Loader from './components/Loader'
import Experience from './pages/Experience'
import About from './pages/About'

const App = () => {

  const location = useLocation();
  const isOwnerPath = location.pathname.includes("owner");

  const { showHotelReg } = useAppContext();

  return (
    <div className='font-inter'>

      <Toaster />

      {/* ✅ Hide Navbar on owner pages */}
      {!isOwnerPath && <Navbar />}

      {/* ✅ Hotel Registration Popup */}
      {showHotelReg && <HotelReg />}

      <div className='min-h-[70vh]'>

        <Routes>

          {/* ✅ USER ROUTES */}
          <Route path='/' element={<Home />} />
          <Route path='/rooms' element={<AllRooms />} />
          <Route path='/hotels' element={<AllRooms />} />
          <Route path='/rooms/:id' element={<RoomDetails />} />

          {/* ✅ IMPORTANT ROUTE (BOOKINGS) */}
          <Route path='/my-bookings' element={<MyBookings />} />

          <Route path='/experience' element={<Experience />} />
          <Route path='/about' element={<About />} />

          {/* ✅ FIXED SPACE ISSUE */}
          <Route path="/loader/:nextUrl" element={<Loader />} />

          {/* ✅ OWNER PANEL */}
          <Route path="/owner" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="add-room" element={<AddRoom />} />
            <Route path="list-room" element={<ListRoom />} />
          </Route>

        </Routes>

      </div>

      {/* ✅ Hide footer on owner pages (optional improvement) */}
      {!isOwnerPath && <Footer />}

    </div>
  )
}

export default App