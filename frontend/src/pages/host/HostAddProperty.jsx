import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api'

export default function HostAddProperty() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [city, setCity] = useState('')
  const [pricePerNight, setPricePerNight] = useState('')
  const [image, setImage] = useState(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description || '')
    formData.append('city', city)
    formData.append('price_per_night', pricePerNight)
    if (image) formData.append('image', image)
    try {
      await api.post('/properties/', formData)
      navigate('/host')
    } catch (err) {
      const res = err.response?.data
      setError(
        res?.title?.[0] ||
        res?.description?.[0] ||
        res?.city?.[0] ||
        res?.price_per_night?.[0] ||
        (typeof res?.detail === 'string' ? res.detail : null) ||
        'Failed to create property'
      )
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Add Property</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Price per night ($)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={pricePerNight}
            onChange={(e) => setPricePerNight(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium"
        >
          Add Property
        </button>
      </form>
    </div>
  )
}
