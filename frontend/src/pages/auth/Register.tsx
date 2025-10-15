import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import AuthForm from '../../components/AuthForm'

const Register: React.FC = () => {
  const { register } = useAuth()

  const handleRegister = async (data: any) => {
    const { role, businessName, businessWebsite, businessLogoUrl, businessDescription, ...userData } = data
    
    if (role === 'business') {
      await register(
        userData.name,
        userData.email,
        userData.password,
        role,
        {
          businessName,
          businessWebsite,
          businessLogoUrl,
          businessDescription
        }
      )
    } else {
      await register(userData.name, userData.email, userData.password, role)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-bold text-gray-900">
            Create Account
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join our community and make a difference
          </p>
        </div>
        
        <AuthForm 
          type="register" 
          onSubmit={handleRegister}
        />
      </div>
    </div>
  )
}

export default Register