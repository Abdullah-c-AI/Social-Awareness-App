import { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { postsAPI } from '../services/api'
import toast from 'react-hot-toast'

interface CreatePostProps {
  onClose: () => void
  onSuccess: () => void
}

const CreatePost = ({ onClose, onSuccess }: CreatePostProps) => {
  const [formData, setFormData] = useState({
    content: '',
    image: '',
  })
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()

  const createPostMutation = useMutation(
    (data: { content: string; image?: string }) => postsAPI.createPost(data),
    {
      onSuccess: () => {
        toast.success('Post created successfully!')
        queryClient.invalidateQueries('posts')
        onSuccess()
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to create post')
      }
    }
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.content.trim()) {
      toast.error('Please enter some content for your post')
      return
    }

    setLoading(true)
    createPostMutation.mutate(formData)
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Create New Post</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                What's on your mind?
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={4}
                className="input-field"
                placeholder="Share your thoughts..."
                maxLength={2000}
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.content.length}/2000 characters
              </p>
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Image URL (optional)
              </label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="input-field"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {formData.image && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                <img
                  src={formData.image}
                  alt="Post preview"
                  className="max-w-full h-auto rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={loading || !formData.content.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Post'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreatePost
