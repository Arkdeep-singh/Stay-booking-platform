import axios from 'axios'

const BACKEND_URL = 'https://stay-booking-backend.onrender.com'
const API_URL = `${BACKEND_URL}/api`

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

export const getImageUrl = (image) => {
  if (!image) return null
  return image.startsWith('http') ? image : `${BACKEND_URL}${image}`
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access')
  if (token) config.headers.Authorization = `Bearer ${token}`

  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }

  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
