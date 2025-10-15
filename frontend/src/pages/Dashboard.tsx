import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { campaignsAPI, businessAPI, adminAPI } from '../services/api'

interface Campaign {
  _id: string
  title: string
  status: string
  participantsCount?: number
  [key: string]: any
}

interface DashboardStats {
  totalCampaigns: number
  activeCampaigns: number
  totalParticipants: number
  recentCampaigns: Campaign[]
}

const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalParticipants: 0,
    recentCampaigns: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      if (user?.role === 'admin') {
        await fetchAdminDashboard()
      } else if (user?.role === 'business') {
        await fetchBusinessDashboard()
      } else {
        await fetchUserDashboard()
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserDashboard = async () => {
    const response = await campaignsAPI.getCampaigns()
    const campaigns = response.data.campaigns || []
    
    setStats({
      totalCampaigns: campaigns.length,
      activeCampaigns: campaigns.filter((c: Campaign) => c.status === 'approved').length,
      totalParticipants: campaigns.reduce((sum: number, c: Campaign) => sum + (c.participantsCount || 0), 0),
      recentCampaigns: campaigns.slice(0, 5)
    })
  }

  const fetchBusinessDashboard = async () => {
    const response = await businessAPI.getCampaigns()
    const campaigns = response.data.campaigns || []
    
    setStats({
      totalCampaigns: campaigns.length,
      activeCampaigns: campaigns.filter((c: Campaign) => c.status === 'approved').length,
      totalParticipants: campaigns.reduce((sum: number, c: Campaign) => sum + (c.participantsCount || 0), 0),
      recentCampaigns: campaigns.slice(0, 5)
    })
  }

  const fetchAdminDashboard = async () => {
    const [campaignsResponse, pendingResponse] = await Promise.all([
      campaignsAPI.getCampaigns(),
      adminAPI.getCampaigns({ status: 'pending' })
    ])
    
    const campaigns = campaignsResponse.data.campaigns || []
    const pendingCampaigns = pendingResponse.data.campaigns || []
    
    setStats({
      totalCampaigns: campaigns.length,
      activeCampaigns: campaigns.filter((c: Campaign) => c.status === 'approved').length,
      totalParticipants: campaigns.reduce((sum: number, c: Campaign) => sum + (c.participantsCount || 0), 0),
      recentCampaigns: [...pendingCampaigns, ...campaigns.slice(0, 3)]
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          {user?.role === 'admin' && 'Manage campaigns and users'}
          {user?.role === 'business' && 'Track your campaigns and analytics'}
          {user?.role === 'user' && 'Discover and join campaigns that matter'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 rounded-lg">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Campaigns</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalCampaigns}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Campaigns</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.activeCampaigns}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Participants</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalParticipants}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/campaigns" className="block w-full btn-primary text-center">
              Browse Campaigns
            </Link>
            {(user?.role === 'user' || user?.role === 'business') && (
              <Link to="/campaigns/create" className="block w-full btn-secondary text-center">
                Create Campaign
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link to="/admin/campaigns" className="block w-full btn-secondary text-center">
                Manage Campaigns
              </Link>
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {stats.recentCampaigns.length > 0 ? (
              stats.recentCampaigns.map((campaign) => (
                <div key={campaign._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{campaign.title}</p>
                    <p className="text-sm text-gray-500">
                      {campaign.status === 'pending' ? 'Pending approval' : `${campaign.participantsCount} participants`}
                    </p>
                  </div>
                  <Link 
                    to={`/campaigns/${campaign._id}`}
                    className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                  >
                    View →
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent activity</p>
            )}
          </div>
        </div>
      </div>

      {/* Role-specific content */}
      {user?.role === 'business' && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Business Profile</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{user.businessName}</p>
              <p className="text-sm text-gray-500">{user.businessWebsite}</p>
            </div>
            <Link to="/business/profile" className="btn-secondary">
              Edit Profile
            </Link>
          </div>
        </div>
      )}

      {user?.role === 'admin' && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Admin Panel</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/admin/campaigns?status=pending" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <h3 className="font-medium text-gray-900">Pending Campaigns</h3>
              <p className="text-sm text-gray-500">Review and approve campaigns</p>
            </Link>
            <Link to="/admin/users" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <h3 className="font-medium text-gray-900">User Management</h3>
              <p className="text-sm text-gray-500">Manage users and permissions</p>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
