import { motion } from 'framer-motion'
import {
  Calendar,
  CalendarCog,
  Clock,
  Home,
  Megaphone,
  Settings,
  ShoppingBag,
  SquareChartGantt,
} from 'lucide-react'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Sidebar = () => {
  const location = useLocation()
  const menuItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: Megaphone, label: 'News', path: '/novedades' },
    { icon: Calendar, label: 'Events', path: '/nuevo-evento' },
    { icon: Clock, label: 'Appointments', path: '/room' },
    { icon: ShoppingBag, label: 'Merch', path: '/merch' },
    { icon: SquareChartGantt, label: 'Manage', path: '/manage' },
    { icon: CalendarCog, label: 'Events', path: '/event-dashboard' },
    { icon: Settings, label: 'Settings', path: '/mi-cuenta' },
  ]

  return (
    <div className='h-screen w-16 md:w-20 flex flex-col items-center bg-white shadow-lg'>
      <div className='w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mt-8 mb-8 overflow-hidden rounded-full'>
        <img
          src='/logo.webp'
          alt='Logo'
          className='w-full h-full object-cover'
        />
      </div>
      {menuItems.map((item) => (
        <Link to={item.path} key={item.label}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-xl mb-4 ${
              location.pathname === item.path
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-400 hover:text-blue-600'
            }`}
          >
            <item.icon size={24} />
          </motion.button>
        </Link>
      ))}
    </div>
  )
}

const Layout = ({ children }) => {
  return (
    <div className='flex h-screen bg-gray-100'>
      <Sidebar />
      <main className='flex-1 overflow-auto'>{children}</main>
    </div>
  )
}

export default Layout
