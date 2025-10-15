import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

const Profile = () => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: '',
    avatar: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement profile update API call
    console.log('Profile update:', formData)
    setIsEditing(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div>
              <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-1">
                Avatar URL
              </label>
              <input
                type="url"
                id="avatar"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-semibold text-xl">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
                <p className="text-gray-600">{user?.email}</p>
                <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>

            {user?.bio && (
              <div>
                <h3 className="font-medium text-gray-700 mb-1">Bio</h3>
                <p className="text-gray-600">{user.bio}</p>
              </div>
            )}

            {user?.role === 'business' && (
              <div className="bg-primary-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-700 mb-2">Business Information</h3>
                <div className="space-y-2 text-sm">
                  {user.businessName && (
                    <p><span className="font-medium">Business Name:</span> {user.businessName}</p>
                  )}
                  {user.businessWebsite && (
                    <p><span className="font-medium">Website:</span> {user.businessWebsite}</p>
                  )}
                  {user.businessDescription && (
                    <p><span className="font-medium">Description:</span> {user.businessDescription}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
