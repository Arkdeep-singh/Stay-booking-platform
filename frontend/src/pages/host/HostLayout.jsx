import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { motion } from 'framer-motion'

export default function HostLayout() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50">
      <nav className="flex justify-between items-center px-6 py-4 border-b bg-white/80 backdrop-blur-sm shadow-lg">
        <div className="flex items-center gap-2">
          <motion.span 
            whileHover={{ scale: 1.05 }}
            className="text-xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent"
          >
            StayEase
          </motion.span>
          <span className="text-slate-400 mx-2">|</span>
          <span className="text-sm text-slate-600 font-medium">Host Dashboard</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Link 
            to="/host" 
            className="px-4 py-2 text-slate-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg font-medium transition-all duration-200"
          >
            Home
          </Link>
          <Link 
            to="/host/properties/new" 
            className="px-4 py-2 text-slate-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg font-medium transition-all duration-200"
          >
            Add Property
          </Link>
          <Link 
            to="/host/bookings" 
            className="px-4 py-2 text-slate-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg font-medium transition-all duration-200"
          >
            Bookings
          </Link>
          <Link 
            to="/host/profile" 
            className="px-4 py-2 text-slate-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg font-medium transition-all duration-200"
          >
            Profile
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600 font-medium">Welcome, {user?.username}</span>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout} 
            className="px-4 py-2 text-slate-600 hover:text-white hover:bg-gradient-to-r hover:from-orange-500 hover:to-pink-500 rounded-lg font-medium transition-all duration-200 border border-slate-300"
          >
            Logout
          </motion.button>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
