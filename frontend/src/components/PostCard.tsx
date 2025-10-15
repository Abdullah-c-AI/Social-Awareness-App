import { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { postsAPI } from '../services/api'
import toast from 'react-hot-toast'

interface Post {
  _id: string
  content: string
  image?: string
  author: {
    _id: string
    name: string
    avatar?: string
  }
  likes: string[]
  comments: any[]
  createdAt: string
}

interface PostCardProps {
  post: Post
  currentUserId?: string
  onUpdate: () => void
}

const PostCard = ({ post, currentUserId, onUpdate }: PostCardProps) => {
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const queryClient = useQueryClient()

  const isLiked = currentUserId && post.likes.includes(currentUserId)
  const isAuthor = currentUserId === post.author._id

  const likeMutation = useMutation(
    () => postsAPI.likePost(post._id),
    {
      onSuccess: () => {
        onUpdate()
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to like post')
      }
    }
  )

  const unlikeMutation = useMutation(
    () => postsAPI.unlikePost(post._id),
    {
      onSuccess: () => {
        onUpdate()
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to unlike post')
      }
    }
  )

  const deleteMutation = useMutation(
    () => postsAPI.deletePost(post._id),
    {
      onSuccess: () => {
        toast.success('Post deleted successfully')
        onUpdate()
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to delete post')
      }
    }
  )

  const handleLike = () => {
    if (isLiked) {
      unlikeMutation.mutate()
    } else {
      likeMutation.mutate()
    }
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deleteMutation.mutate()
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="card">
      {/* Post Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {post.author.avatar ? (
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-semibold">
                {post.author.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
            <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
          </div>
        </div>
        
        {isAuthor && (
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Delete
          </button>
        )}
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>
        {post.image && (
          <img
            src={post.image}
            alt="Post image"
            className="mt-3 rounded-lg max-w-full h-auto"
          />
        )}
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            disabled={!currentUserId}
            className={`flex items-center space-x-1 ${
              isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{post.likes.length}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-1 text-gray-500 hover:text-blue-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>{post.comments.length}</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="space-y-3">
            {post.comments.map((comment, index) => (
              <div key={index} className="flex space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-sm font-semibold">
                    {comment.author?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-900">{comment.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {comment.author?.name} • {formatDate(comment.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PostCard
