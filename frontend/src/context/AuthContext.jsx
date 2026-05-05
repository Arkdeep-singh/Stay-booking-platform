import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access')
    const storedRole = localStorage.getItem('role')
    if (token && storedRole) {
      setUser({ username: localStorage.getItem('username'), role: storedRole })
    }
    setLoading(false)
  }, [])

  const login = (accessToken, refreshToken, username, role) => {
    localStorage.setItem('access', accessToken)
    localStorage.setItem('refresh', refreshToken)
    localStorage.setItem('username', username)
    localStorage.setItem('role', role)
    setUser({ username, role })
  }

  const logout = () => {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    localStorage.removeItem('username')
    localStorage.removeItem('role')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
