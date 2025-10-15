import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authAPI } from '../services/api'

interface User {
  id: string
  name: string
  email: string
  role: string
  businessName?: string
  businessWebsite?: string
  businessDescription?: string
  avatar?: string
  bio?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, role: string, businessData?: any) => Promise<void>
  logout: () => void
  loading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // For now, just set loading to false
      // TODO: Implement proper token validation
      setLoading(false)
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password)
      const { token, user } = response.data
      
      localStorage.setItem('token', token)
      setUser(user)
      toast.success('Login successful!')
      navigate('/')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed')
      throw error
    }
  }

  const register = async (name: string, email: string, password: string, role: string, businessData?: any) => {
    try {
      const response = await authAPI.register(name, email, password, role, businessData)
      const { token, user } = response.data
      
      localStorage.setItem('token', token)
      setUser(user)
      toast.success('Registration successful!')
      navigate('/')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed')
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    toast.success('Logged out successfully')
    navigate('/')
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
