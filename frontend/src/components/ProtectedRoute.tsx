import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'user' | 'business' | 'admin'
  fallbackPath?: string
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  fallbackPath = '/login' 
}) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />
  }

  // Check role-based access if required
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-gray-500">
            Required role: {requiredRole} | Your role: {user.role}
          </p>
          <button 
            onClick={() => window.history.back()}
            className="btn-primary mt-4"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default ProtectedRoute
