import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import AuthForm from '../../components/AuthForm'

const Login: React.FC = () => {
  const { login } = useAuth()

  const handleLogin = async (data: { email: string; password: string }) => {
    await login(data.email, data.password)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-bold text-gray-900">
            Welcome Back
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your account to continue
          </p>
        </div>
        
        <AuthForm 
          type="login" 
          onSubmit={handleLogin}
        />
      </div>
    </div>
  )
}

export default Login