import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Landing from './pages/Landing'
import Register from './pages/Register'
import Login from './pages/Login'
import HostLayout from './pages/host/HostLayout'
import GuestLayout from './pages/guest/GuestLayout'
import HostHome from './pages/host/HostHome'
import HostPropertyDetail from './pages/host/HostPropertyDetail'
import HostAddProperty from './pages/host/HostAddProperty'
import HostBookings from './pages/host/HostBookings'
import GuestHome from './pages/guest/GuestHome'
import GuestPropertyDetail from './pages/guest/GuestPropertyDetail'
import GuestBookings from './pages/guest/GuestBookings'
import GuestProfile from './pages/guest/GuestProfile'
import HostProfile from './pages/host/HostProfile'

function ProtectedRoute({ requireRole, children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  if (requireRole && user.role !== requireRole) return <Navigate to={user.role === 'HOST' ? '/host' : '/guest'} replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/host" element={<ProtectedRoute requireRole="HOST"><HostLayout /></ProtectedRoute>}>
        <Route index element={<HostHome />} />
        <Route path="properties/new" element={<HostAddProperty />} />
        <Route path="properties/:id" element={<HostPropertyDetail />} />
        <Route path="bookings" element={<HostBookings />} />
        <Route path="profile" element={<HostProfile />} />
      </Route>
      <Route path="/guest" element={<ProtectedRoute requireRole="GUEST"><GuestLayout /></ProtectedRoute>}>
        <Route index element={<GuestHome />} />
        <Route path="properties/:id" element={<GuestPropertyDetail />} />
        <Route path="bookings" element={<GuestBookings />} />
        <Route path="profile" element={<GuestProfile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
