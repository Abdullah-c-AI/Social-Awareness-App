import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Profile from './pages/Profile'
import Campaigns from './pages/Campaigns'
import CampaignDetails from './pages/CampaignDetails'
import CreateCampaign from './pages/CreateCampaign'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/campaigns/:id" element={<CampaignDetails />} />
          
          {/* Protected routes */}
          <Route path="/campaigns/create" element={
            <ProtectedRoute>
              <CreateCampaign />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          {/* Business routes */}
          <Route path="/business/*" element={
            <ProtectedRoute requiredRole="business">
              <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Business Dashboard</h1>
                <p className="text-gray-600">Business features coming soon...</p>
              </div>
            </ProtectedRoute>
          } />
          
          {/* Admin routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute requiredRole="admin">
              <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Panel</h1>
                <p className="text-gray-600">Admin features coming soon...</p>
              </div>
            </ProtectedRoute>
          } />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </Layout>
    </AuthProvider>
  )
}

export default App
