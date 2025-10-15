import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { campaignsAPI } from '../services/api'
import { useAnalytics } from '../services/analytics'

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
    name: string
    role: string
  }
  createdAt: string
  startDate: string
  endDate: string
}

const Campaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: '',
    search: ''
  })
  const { trackView, trackClick } = useAnalytics()

  useEffect(() => {
    fetchCampaigns()
  }, [filters])

  const fetchCampaigns = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (filters.category) params.append('category', filters.category)
      if (filters.search) params.append('q', filters.search)
      
      const response = await campaignsAPI.getCampaigns(params.toString())
      setCampaigns(response.data.campaigns)
    } catch (error) {
      console.error('Failed to fetch campaigns:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCampaignClick = async (campaignId: string) => {
    await trackClick(campaignId)
  }

  const handleCampaignView = async (campaignId: string) => {
    await trackView(campaignId)
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Campaigns</h1>
        <p className="text-gray-600">Discover and join campaigns that matter to you</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search campaigns..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="input-field"
          />
        </div>
        <div className="sm:w-48">
          <select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="input-field"
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

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <div 
            key={campaign._id} 
            className="card hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => {
              handleCampaignClick(campaign._id)
              handleCampaignView(campaign._id)
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                campaign.category === 'environment' ? 'bg-green-100 text-green-800' :
                campaign.category === 'health' ? 'bg-red-100 text-red-800' :
                campaign.category === 'education' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {campaign.category.charAt(0).toUpperCase() + campaign.category.slice(1).replace('-', ' ')}
              </span>
              {campaign.promotion && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                  Promoted
                </span>
              )}
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {campaign.title}
            </h3>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {campaign.description}
            </p>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>By {campaign.createdBy.name}</span>
              <span>{new Date(campaign.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex space-x-4">
                <span>👁️ {campaign.analytics.views}</span>
                <span>👆 {campaign.analytics.clicks}</span>
                <span>👥 {campaign.participantsCount}</span>
              </div>
              <Link 
                to={`/campaigns/${campaign._id}`}
                className="text-primary-600 hover:text-primary-500 font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                View Details →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {campaigns.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            No campaigns found. Try adjusting your filters.
          </div>
        </div>
      )}
    </div>
  )
}

export default Campaigns
