import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api, { getImageUrl } from '../../api'

export default function HostPropertyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [property, setProperty] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      api.get(`/properties/${id}/`),
      api.get(`/properties/${id}/bookings/`),
    ])
      .then(([propRes, bookRes]) => {
        setProperty(propRes.data)
        setBookings(bookRes.data || [])
      })
      .catch(() => navigate('/host'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  if (loading || !property) return <div className="text-center py-12">Loading...</div>

  const bookedRanges = bookings.map((b) => `${b.check_in_date} to ${b.check_out_date}`)

  const handleDelete = async () => {
    setError('')
    const ok = window.confirm('Delete this property? This cannot be undone.')
    if (!ok) return
    try {
      setDeleting(true)
      await api.delete(`/properties/${id}/`)
      navigate('/host')
    } catch (err) {
      const data = err.response?.data
      const msg =
        (typeof data?.detail === 'string' ? data.detail : null) ||
        (typeof data?.error === 'string' ? data.error : null) ||
        'Failed to delete property'
      setError(msg)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        {property.image && (
          <img src={getImageUrl(property.image)} alt={property.title} className="w-full h-64 object-cover" />
        )}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{property.title}</h1>
              <p className="text-slate-600 mt-1">{property.city}</p>
              <p className="text-orange-500 font-semibold mt-2">${property.price_per_night}/night</p>
            </div>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
          {property.description && <p className="text-slate-600 mt-4">{property.description}</p>}
          {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Booked dates</h2>
        <ul className="space-y-2 text-slate-600">
          {bookedRanges.length ? bookedRanges.map((range, i) => <li key={i}>{range}</li>) : <li>No bookings yet</li>}
        </ul>
      </div>

      {property.reviews?.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Reviews ({property.reviews.length})
          </h2>
          <ul className="space-y-4">
            {property.reviews.map((review) => (
              <li key={review.id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-slate-900">
                    {review.guest?.username ?? 'Guest'}
                  </span>
                  <span className="text-slate-500 text-sm">
                    ★ {review.rating}/5
                  </span>
                </div>
                {review.comment && (
                  <p className="text-slate-600 mt-1 text-sm">{review.comment}</p>
                )}
                <p className="text-slate-400 text-xs mt-1">
                  {review.created_at
                    ? new Date(review.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : ''}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
