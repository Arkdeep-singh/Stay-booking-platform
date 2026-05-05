import { useState, useEffect } from 'react'
import api from '../../api'

export default function HostBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/bookings/host-bookings/')
      .then((res) => setBookings(res.data))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-center py-12">Loading...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Bookings</h1>
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Property</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Check-in</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Check-out</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Guest</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {bookings.map((b) => (
              <tr key={b.id} className="bg-white">
                <td className="px-6 py-4 text-sm text-slate-900">{b.property_title}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{b.check_in_date}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{b.check_out_date}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{b.guest?.username ?? b.guest_username ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {bookings.length === 0 && (
        <p className="text-slate-600 text-center py-8">No bookings yet.</p>
      )}
    </div>
  )
}
