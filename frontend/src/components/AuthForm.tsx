import React, { useState } from 'react'
import { Link } from 'react-router-dom'

interface AuthFormProps {
  type: 'login' | 'register'
  onSubmit: (data: any) => Promise<void>
  loading?: boolean
}

interface SubmitData {
  name: string
  email: string
  password: string
  role: string
  businessName?: string
  businessWebsite?: string
  businessLogoUrl?: string
  businessDescription?: string
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    businessName: '',
    businessWebsite: '',
    businessLogoUrl: '',
    businessDescription: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isLogin = type === 'login'

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Valid email is required'
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!isLogin) {
      if (!formData.name || formData.name.trim().length < 2) {
        newErrors.name = 'Name must be at least 2 characters'
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }

      if (formData.role === 'business') {
        if (!formData.businessName || formData.businessName.trim().length < 2) {
          newErrors.businessName = 'Business name is required'
        }
        // Website and logo URL are optional, but if provided, must be valid URLs
        if (formData.businessWebsite && !/^https?:\/\/.+/.test(formData.businessWebsite)) {
          newErrors.businessWebsite = 'Please enter a valid website URL'
        }
        if (formData.businessLogoUrl && !/^https?:\/\/.+/.test(formData.businessLogoUrl)) {
          newErrors.businessLogoUrl = 'Please enter a valid logo URL'
        }
        if (!formData.businessDescription || formData.businessDescription.trim().length < 10) {
          newErrors.businessDescription = 'Business description must be at least 10 characters'
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      if (isLogin) {
        await onSubmit({
          email: formData.email,
          password: formData.password
        })
      } else {
        const submitData: SubmitData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        }

        if (formData.role === 'business') {
          submitData.businessName = formData.businessName
          submitData.businessWebsite = formData.businessWebsite
          submitData.businessLogoUrl = formData.businessLogoUrl
          submitData.businessDescription = formData.businessDescription
        }

        await onSubmit(submitData)
      }
    } catch (error) {
      // Error handling is done in the parent component
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-0">
      <div className="card">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-6">
          {isLogin ? 'Login' : 'Register'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Account Type
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="user">Individual User</option>
                  <option value="business">Business</option>
                </select>
              </div>

              {formData.role === 'business' && (
                <>
                  <div>
                    <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                      Business Name
                    </label>
                    <input
                      type="text"
                      id="businessName"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      className={`input-field ${errors.businessName ? 'border-red-500' : ''}`}
                      placeholder="Enter business name"
                    />
                    {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>}
                  </div>

                  <div>
                    <label htmlFor="businessWebsite" className="block text-sm font-medium text-gray-700 mb-1">
                      Business Website (Optional)
                    </label>
                    <input
                      type="url"
                      id="businessWebsite"
                      name="businessWebsite"
                      value={formData.businessWebsite}
                      onChange={handleChange}
                      className={`input-field ${errors.businessWebsite ? 'border-red-500' : ''}`}
                      placeholder="https://yourbusiness.com"
                    />
                    {errors.businessWebsite && <p className="text-red-500 text-sm mt-1">{errors.businessWebsite}</p>}
                  </div>

                  <div>
                    <label htmlFor="businessLogoUrl" className="block text-sm font-medium text-gray-700 mb-1">
                      Business Logo URL (Optional)
                    </label>
                    <input
                      type="url"
                      id="businessLogoUrl"
                      name="businessLogoUrl"
                      value={formData.businessLogoUrl}
                      onChange={handleChange}
                      className={`input-field ${errors.businessLogoUrl ? 'border-red-500' : ''}`}
                      placeholder="https://yourbusiness.com/logo.png"
                    />
                    {errors.businessLogoUrl && <p className="text-red-500 text-sm mt-1">{errors.businessLogoUrl}</p>}
                  </div>

                  <div>
                    <label htmlFor="businessDescription" className="block text-sm font-medium text-gray-700 mb-1">
                      Business Description
                    </label>
                    <textarea
                      id="businessDescription"
                      name="businessDescription"
                      value={formData.businessDescription}
                      onChange={handleChange}
                      rows={3}
                      className={`input-field ${errors.businessDescription ? 'border-red-500' : ''}`}
                      placeholder="Describe your business..."
                    />
                    {errors.businessDescription && <p className="text-red-500 text-sm mt-1">{errors.businessDescription}</p>}
                  </div>
                </>
              )}
            </>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`input-field ${errors.email ? 'border-red-500' : ''}`}
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`input-field ${errors.password ? 'border-red-500' : ''}`}
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {!isLogin && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`input-field ${errors.confirmPassword ? 'border-red-500' : ''}`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Link 
              to={isLogin ? "/register" : "/login"} 
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              {isLogin ? 'Register here' : 'Login here'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthForm


