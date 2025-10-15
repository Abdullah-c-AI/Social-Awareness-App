import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { adminAPI } from '../services/api'
import toast from 'react-hot-toast'

interface Campaign {
  _id: string
  title: string
  description: string
  category: string
  status: string
  promotion: boolean
  analytics: {
    views: number
    clicks: number
    signups: number
  }
  participantsCount: number
  createdBy: {
    _id: string
    name: string
    email: string
    role: string
    businessName?: string
  }
  createdAt: string
  startDate: string
  endDate: string
  location?: string
  images: string[]
  tags: string[]
}

interface AdminStats {
  totalCampaigns: number
  pendingCampaigns: number
  approvedCampaigns: number
  rejectedCampaigns: number
  totalUsers: number
}

const AdminDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [stats, setStats] = useState<AdminStats>({
    totalCampaigns: 0,
    pendingCampaigns: 0,
    approvedCampaigns: 0,
    rejectedCampaigns: 0,
    totalUsers: 0
  })
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    status: 'pending',
    category: '',
    search: ''
  })

  // Role validation - only show to admin users
  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            You don't have permission to access the admin dashboard.
          </p>
          <p className="text-sm text-gray-500">
            This page is only available to administrators.
          </p>
        </div>
      </div>
    )
  }

  useEffect(() => {
    fetchAdminData()
  }, [filters])

  const fetchAdminData = async () => {
    try {
      setLoading(true)
      
      // Fetch campaigns by status
      const campaignsResponse = await adminAPI.getCampaigns({
        status: filters.status,
        category: filters.category,
        q: filters.search
      })
      
      setCampaigns(campaignsResponse.data.campaigns)
      
      // Fetch stats (you might want to create a separate stats endpoint)
      await fetchStats()
      
    } catch (error: any) {
      console.error('Failed to fetch admin data:', error)
      toast.error(error.response?.data?.message || 'Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      // Fetch stats for different statuses
      const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
        adminAPI.getCampaigns({ status: 'pending' }),
        adminAPI.getCampaigns({ status: 'approved' }),
        adminAPI.getCampaigns({ status: 'rejected' })
      ])
      
      setStats({
        totalCampaigns: pendingRes.data.total + approvedRes.data.total + rejectedRes.data.total,
        pendingCampaigns: pendingRes.data.total,
        approvedCampaigns: approvedRes.data.total,
        rejectedCampaigns: rejectedRes.data.total,
        totalUsers: 0 // You might want to create a users endpoint
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const handleStatusUpdate = async (campaignId: string, newStatus: 'approved' | 'rejected') => {
    try {
      setActionLoading(campaignId)
      
      await adminAPI.updateCampaignStatus(campaignId, newStatus)
      
      toast.success(`Campaign ${newStatus} successfully!`)
      
      // Refresh the campaigns list
      await fetchAdminData()
      
    } catch (error: any) {
      console.error('Failed to update campaign status:', error)
      toast.error(error.response?.data?.message || 'Failed to update campaign status')
    } finally {
      setActionLoading(null)
    }
  }

  const categories = [
    'environment',
    'social-justice',
    'education',
    'health',
    'community',
    'animal-welfare',
    'humanitarian',
    'technology',
    'arts-culture',
    'other'
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage campaigns and oversee platform activity</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Campaigns</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalCampaigns}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending Review</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pendingCampaigns}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Approved</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.approvedCampaigns}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Rejected</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.rejectedCampaigns}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Campaign Management</h2>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search campaigns..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div className="sm:w-48">
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          
          <div className="sm:w-48">
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="space-y-6">
        {campaigns.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              No {filters.status} campaigns found.
            </div>
          </div>
        ) : (
          campaigns.map((campaign) => (
            <div key={campaign._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    campaign.category === 'environment' ? 'bg-green-100 text-green-800' :
                    campaign.category === 'health' ? 'bg-red-100 text-red-800' :
                    campaign.category === 'education' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {campaign.category.charAt(0).toUpperCase() + campaign.category.slice(1).replace('-', ' ')}
                  </span>
                  
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    campaign.status === 'approved' ? 'bg-green-100 text-green-800' :
                    campaign.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                  </span>
                  
                  {campaign.promotion && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                      Promoted
                    </span>
                  )}
                </div>
                
                <div className="text-sm text-gray-500">
                  {new Date(campaign.createdAt).toLocaleDateString()}
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">{campaign.title}</h3>
              
              <p className="text-gray-600 mb-4 line-clamp-3">{campaign.description}</p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>By {campaign.createdBy.name}</span>
                  {campaign.createdBy.businessName && (
                    <span>({campaign.createdBy.businessName})</span>
                  )}
                  <span>•</span>
                  <span>{campaign.participantsCount} participants</span>
                  <span>•</span>
                  <span>👁️ {campaign.analytics.views} views</span>
                </div>
              </div>

              {/* Action Buttons - Only show for pending campaigns */}
              {campaign.status === 'pending' && (
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleStatusUpdate(campaign._id, 'approved')}
                    disabled={actionLoading === campaign._id}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading === campaign._id ? 'Processing...' : 'Approve'}
                  </button>
                  
                  <button
                    onClick={() => handleStatusUpdate(campaign._id, 'rejected')}
                    disabled={actionLoading === campaign._id}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading === campaign._id ? 'Processing...' : 'Reject'}
                  </button>
                  
                  <button
                    onClick={() => window.open(`/campaigns/${campaign._id}`, '_blank')}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              )}

              {/* Show status for non-pending campaigns */}
              {campaign.status !== 'pending' && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Campaign {campaign.status} on {new Date(campaign.createdAt).toLocaleDateString()}
                  </div>
                  <button
                    onClick={() => window.open(`/campaigns/${campaign._id}`, '_blank')}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default AdminDashboard

