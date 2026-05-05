import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../api'

export default function ReserveModal({ propertyId, pricePerNight, onClose, onSuccess }) {
  const navigate = useNavigate()
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.post('/bookings/', {
        property: Number(propertyId),
        check_in_date: checkIn,
        check_out_date: checkOut,
      })
      onSuccess()
      navigate('/guest/bookings')
    } catch (err) {
      const status = err.response?.status
      const data = err.response?.data

      if (!err.response) {
        setError('Network error. Is the backend running at http://127.0.0.1:8000?')
        return
      }

      if (status === 500) {
        setError('Server error. Check the Django terminal for the traceback.')
        return
      }

      if (!data || typeof data !== 'object') {
        setError(status ? `Request failed (${status})` : 'Booking failed')
        return
      }

      const detailMsg = Array.isArray(data?.detail) ? data.detail[0] : data?.detail
      const msg =
        data?.check_in_date?.[0] ||
        data?.check_out_date?.[0] ||
        data?.property?.[0] ||
        data?.non_field_errors?.[0] ||
        (typeof detailMsg === 'string' ? detailMsg : null) ||
        (Object.keys(data).length ? Object.values(data).flat().find((v) => typeof v === 'string') : null) ||
        (status ? `Request failed (${status})` : 'Booking failed')
      setError(msg)
    }
  }

  const nights = checkIn && checkOut
    ? Math.max(0, (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
    : 0
  const total = nights * parseFloat(pricePerNight || 0)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4"
      >
        <h2 className="text-xl font-bold text-slate-900 mb-4">Reserve this property</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Check-in</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Check-out</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              required
            />
          </div>
          {nights > 0 && (
            <p className="text-slate-600">
              {nights} night(s) × ${pricePerNight} = <span className="font-semibold">${total.toFixed(2)}</span>
            </p>
          )}
          <div className="flex gap-2 justify-end pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
              Book
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
