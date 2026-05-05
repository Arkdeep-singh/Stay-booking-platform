import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import api, { getImageUrl } from '../../api'
import ReserveModal from '../../components/ReserveModal'

export default function GuestPropertyDetail() {
  const { id } = useParams()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showReserve, setShowReserve] = useState(false)

  useEffect(() => {
    api.get(`/properties/${id}/`)
      .then((res) => setProperty(res.data))
      .catch(() => setProperty(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading || !property) return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-slate-600">Loading property details...</p>
      </div>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-slate-100"
      >
        <div className="relative">
          {property.image ? (
            <img 
              src={getImageUrl(property.image)} 
              alt={property.title} 
              className="w-full h-96 object-cover"
            />
          ) : (
            <div className="w-full h-96 bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center">
              <svg className="w-24 h-24 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
          )}
          {property.average_rating != null && (
            <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
              <svg className="w-5 h-5 text-yellow-500 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
              <span className="font-bold text-slate-900">{property.average_rating}</span>
              <span className="text-sm text-slate-500">({property.total_reviews} reviews)</span>
            </div>
          )}
        </div>
        
        <div className="p-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{property.title}</h1>
              <div className="flex items-center text-slate-600 mb-4">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {property.city}
              </div>
              
              {property.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">About this property</h3>
                  <p className="text-slate-600 leading-relaxed">{property.description}</p>
                </div>
              )}
            </div>
            
            <div className="lg:w-80">
              <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-6 border border-orange-100">
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <span className="text-3xl font-bold text-orange-600">${property.price_per_night}</span>
                    <span className="text-slate-600">/night</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Total for</p>
                    <p className="font-semibold text-slate-900">1 night</p>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowReserve(true)}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl hover:from-orange-600 hover:to-pink-600 font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Reserve Now
                </motion.button>
                
                <p className="text-xs text-slate-500 text-center mt-3">You won't be charged yet</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {property.reviews?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Guest Reviews ({property.reviews.length})
          </h2>
          <div className="space-y-6">
            {property.reviews.map((review, index) => (
              <motion.div 
                key={review.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="border-b border-slate-100 pb-6 last:border-0 last:pb-0"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {review.guest?.username?.charAt(0)?.toUpperCase() || 'G'}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900">
                          {review.guest?.username ?? 'Guest'}
                        </span>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <svg 
                              key={i} 
                              className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-slate-300'}`} 
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                          ))}
                          <span className="text-sm text-slate-600 ml-1">{review.rating}/5</span>
                        </div>
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-slate-600 leading-relaxed mt-3">{review.comment}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">
                      {review.created_at
                        ? new Date(review.created_at).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : ''}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {showReserve && (
        <ReserveModal
          propertyId={property.id}
          pricePerNight={property.price_per_night}
          onClose={() => setShowReserve(false)}
          onSuccess={() => setShowReserve(false)}
        />
      )}
    </div>
  )
}
