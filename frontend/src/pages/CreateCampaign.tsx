import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { campaignsAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

interface FormState {
  title: string
  description: string
  category: string
  tags: string
  images: string
  location: string
  startDate: string
  endDate: string
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

const CreateCampaign: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState<FormState>({
    title: '',
    description: '',
    category: '',
    tags: '',
    images: '',
    location: '',
    startDate: '',
    endDate: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.description || !form.category || !form.startDate || !form.endDate) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setSubmitting(true)
      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        tags: form.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        images: form.images
          .split(',')
          .map((u) => u.trim())
          .filter(Boolean),
        location: form.location,
        startDate: form.startDate,
        endDate: form.endDate,
      }

      const { data } = await campaignsAPI.createCampaign(payload)
      toast.success(user?.role === 'admin' ? 'Campaign created' : 'Submitted for approval')
      navigate(`/campaigns/${data.campaign._id}`)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create campaign')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Campaign</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="input"
            placeholder="Campaign title"
            maxLength={100}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="input h-32"
            placeholder="Describe the campaign"
            maxLength={2000}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="input"
            required
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            className="input"
            placeholder="e.g. environment, community, cleanup"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Images URLs (comma separated)</label>
          <input
            type="text"
            name="images"
            value={form.images}
            onChange={handleChange}
            className="input"
            placeholder="https://example.com/image1.jpg, https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            className="input"
            placeholder="City, Venue"
            maxLength={200}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
            <input
              type="datetime-local"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
            <input
              type="datetime-local"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button type="button" className="btn-secondary" onClick={() => navigate(-1)} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Create Campaign'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateCampaign




