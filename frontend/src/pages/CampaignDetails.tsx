import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { campaignsAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { useAnalytics } from '../services/analytics'
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
  participants: Array<{
    _id: string
    name: string
    email: string
  }>
  createdBy: {
    _id: string
    name: string
    role: string
  }
  createdAt: string
  startDate: string
  endDate: string
  location?: string
  images: string[]
  tags: string[]
}

const CampaignDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { trackView, trackClick } = useAnalytics()
  
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)

  useEffect(() => {
    if (id) {
      fetchCampaign()
      trackView(id)
    }
  }, [id])

  const fetchCampaign = async () => {
    try {
      setLoading(true)
      const response = await campaignsAPI.getCampaign(id!)
      setCampaign(response.data.campaign)
    } catch (error) {
      console.error('Failed to fetch campaign:', error)
      toast.error('Failed to load campaign')
      navigate('/campaigns')
    } finally {
      setLoading(false)
    }
  }

  const handleJoinCampaign = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    try {
      setJoining(true)
      await campaignsAPI.joinCampaign(id!)
      await trackClick(id!)
      toast.success('Successfully joined campaign!')
      fetchCampaign() // Refresh campaign data
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to join campaign')
    } finally {
      setJoining(false)
    }
  }

  const handleLeaveCampaign = async () => {
    try {
      setJoining(true)
      await campaignsAPI.leaveCampaign(id!)
      toast.success('Left campaign successfully')
      fetchCampaign() // Refresh campaign data
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to leave campaign')
    } finally {
      setJoining(false)
    }
  }

  const isParticipant = user && campaign?.participants.some(p => p._id === user.id)
  const isOwner = user && campaign?.createdBy._id === user.id
  const isExpired = campaign && new Date(campaign.endDate) < new Date()
  const isActive = campaign && campaign.status === 'approved' && !isExpired

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Campaign Not Found</h1>
        <p className="text-gray-600 mb-4">The campaign you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/campaigns')} className="btn-primary">
          Back to Campaigns
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Campaign Header */}
      <div className="card mb-6">
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
            {campaign.promotion && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                Promoted
              </span>
            )}
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              campaign.status === 'approved' ? 'bg-green-100 text-green-800' :
              campaign.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
            </span>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">{campaign.title}</h1>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span>By {campaign.createdBy.name}</span>
          <span className="mx-2">•</span>
          <span>{new Date(campaign.createdAt).toLocaleDateString()}</span>
          {campaign.location && (
            <>
              <span className="mx-2">•</span>
              <span>📍 {campaign.location}</span>
            </>
          )}
        </div>

        <div className="flex items-center space-x-6 text-sm text-gray-600 mb-6">
          <span>👁️ {campaign.analytics.views} views</span>
          <span>👆 {campaign.analytics.clicks} clicks</span>
          <span>👥 {campaign.participantsCount} participants</span>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          {isActive && (
            <>
              {isParticipant ? (
                <button
                  onClick={handleLeaveCampaign}
                  disabled={joining}
                  className="btn-secondary"
                >
                  {joining ? 'Leaving...' : 'Leave Campaign'}
                </button>
              ) : (
                <button
                  onClick={handleJoinCampaign}
                  disabled={joining}
                  className="btn-primary"
                >
                  {joining ? 'Joining...' : 'Join Campaign'}
                </button>
              )}
            </>
          )}
          
          {isExpired && (
            <span className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg">
              Campaign has ended
            </span>
          )}
        </div>
      </div>

      {/* Campaign Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{campaign.description}</p>
          </div>

          {campaign.images.length > 0 && (
            <div className="card mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Images</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {campaign.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Campaign image ${index + 1}`}
                    className="rounded-lg w-full h-48 object-cover"
                  />
                ))}
              </div>
            </div>
          )}

          {campaign.tags.length > 0 && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {campaign.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Campaign Info */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Info</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Start Date</span>
                <p className="text-gray-900">{new Date(campaign.startDate).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">End Date</span>
                <p className="text-gray-900">{new Date(campaign.endDate).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Duration</span>
                <p className="text-gray-900">
                  {Math.ceil((new Date(campaign.endDate).getTime() - new Date(campaign.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                </p>
              </div>
            </div>
          </div>

          {/* Participants */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Participants ({campaign.participantsCount})
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {campaign.participants.map((participant) => (
                <div key={participant._id} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold text-sm">
                      {participant.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-900">{participant.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampaignDetails
