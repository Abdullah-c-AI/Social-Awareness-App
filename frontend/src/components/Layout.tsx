import { ReactNode, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0">
                <h1 className="text-lg sm:text-xl font-bold text-primary-600">
                  Social Awareness
                </h1>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
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
                      Create
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

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {/* Hamburger icon */}
                <svg
                  className={`${mobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                {/* Close icon */}
                <svg
                  className={`${mobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t border-gray-200">
              {user ? (
                <>
                  <Link
                    to="/"
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive('/') 
                        ? 'bg-primary-100 text-primary-700' 
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    to="/campaigns"
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive('/campaigns') 
                        ? 'bg-primary-100 text-primary-700' 
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Campaigns
                  </Link>
                  {(user.role === 'user' || user.role === 'business') && (
                    <Link
                      to="/campaigns/create"
                      className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        isActive('/campaigns/create') 
                          ? 'bg-primary-100 text-primary-700' 
                          : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Create Campaign
                    </Link>
                  )}
                  <Link
                    to="/dashboard"
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive('/dashboard') 
                        ? 'bg-primary-100 text-primary-700' 
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {user.role === 'business' && (
                    <Link
                      to="/business"
                      className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        isActive('/business') 
                          ? 'bg-primary-100 text-primary-700' 
                          : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Business
                    </Link>
                  )}
                  {user.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        isActive('/admin') 
                          ? 'bg-primary-100 text-primary-700' 
                          : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive('/profile') 
                        ? 'bg-primary-100 text-primary-700' 
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      setMobileMenuOpen(false)
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-100 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/campaigns"
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive('/campaigns') 
                        ? 'bg-primary-100 text-primary-700' 
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Campaigns
                  </Link>
                  <Link
                    to="/login"
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive('/login') 
                        ? 'bg-primary-100 text-primary-700' 
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive('/register') 
                        ? 'bg-primary-100 text-primary-700' 
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
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
      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}

export default Layout
