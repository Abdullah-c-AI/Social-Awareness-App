import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0">
                <h1 className="text-xl font-bold text-primary-600">
                  Social Awareness
                </h1>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link
                    to="/"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/') 
                        ? 'bg-primary-100 text-primary-700' 
                        : 'text-gray-700 hover:text-primary-600'
                    }`}
                  >
                    Home
                  </Link>
                  <Link
                    to="/campaigns"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/campaigns') 
                        ? 'bg-primary-100 text-primary-700' 
                        : 'text-gray-700 hover:text-primary-600'
                    }`}
                  >
                    Campaigns
                  </Link>
                  {(user.role === 'user' || user.role === 'business') && (
                    <Link
                      to="/campaigns/create"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive('/campaigns/create') 
                          ? 'bg-primary-100 text-primary-700' 
                          : 'text-gray-700 hover:text-primary-600'
                      }`}
                    >
                      Create Campaign
                    </Link>
                  )}
                  <Link
                    to="/dashboard"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/dashboard') 
                        ? 'bg-primary-100 text-primary-700' 
                        : 'text-gray-700 hover:text-primary-600'
                    }`}
                  >
                    Dashboard
                  </Link>
                  {user.role === 'business' && (
                    <Link
                      to="/business"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive('/business') 
                          ? 'bg-primary-100 text-primary-700' 
                          : 'text-gray-700 hover:text-primary-600'
                      }`}
                    >
                      Business
                    </Link>
                  )}
                  {user.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive('/admin') 
                          ? 'bg-primary-100 text-primary-700' 
                          : 'text-gray-700 hover:text-primary-600'
                      }`}
                    >
                      Admin
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/profile') 
                        ? 'bg-primary-100 text-primary-700' 
                        : 'text-gray-700 hover:text-primary-600'
                    }`}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/campaigns"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/campaigns') 
                        ? 'bg-primary-100 text-primary-700' 
                        : 'text-gray-700 hover:text-primary-600'
                    }`}
                  >
                    Campaigns
                  </Link>
                  <Link
                    to="/login"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/login') 
                        ? 'bg-primary-100 text-primary-700' 
                        : 'text-gray-700 hover:text-primary-600'
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/register') 
                        ? 'bg-primary-100 text-primary-700' 
                        : 'text-gray-700 hover:text-primary-600'
                    }`}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}

export default Layout
