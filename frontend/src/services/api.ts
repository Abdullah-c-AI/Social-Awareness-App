import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (name: string, email: string, password: string, role: string, businessData?: any) =>
    api.post('/auth/register', { name, email, password, role, ...businessData }),
  
  logout: () => api.post('/auth/logout'),
  
  getProfile: () => api.get('/auth/profile'),
}

// Posts API
export const postsAPI = {
  getPosts: () => api.get('/posts'),
  
  getPost: (id: string) => api.get(`/posts/${id}`),
  
  createPost: (data: { content: string; image?: string }) =>
    api.post('/posts', data),
  
  updatePost: (id: string, data: { content: string; image?: string }) =>
    api.put(`/posts/${id}`, data),
  
  deletePost: (id: string) => api.delete(`/posts/${id}`),
  
  likePost: (id: string) => api.post(`/posts/${id}/like`),
  
  unlikePost: (id: string) => api.delete(`/posts/${id}/like`),
}

// Users API
export const usersAPI = {
  getUsers: () => api.get('/users'),
  
  getUser: (id: string) => api.get(`/users/${id}`),
  
  updateUser: (id: string, data: { name?: string; bio?: string; avatar?: string }) =>
    api.put(`/users/${id}`, data),
  
  deleteUser: (id: string) => api.delete(`/users/${id}`),
}

// Campaigns API
export const campaignsAPI = {
  getCampaigns: (params?: string) => api.get(`/campaigns${params ? `?${params}` : ''}`),
  
  getCampaign: (id: string) => api.get(`/campaigns/${id}`),
  
  createCampaign: (data: any) => api.post('/campaigns', data),
  
  updateCampaign: (id: string, data: any) => api.put(`/campaigns/${id}`, data),
  
  deleteCampaign: (id: string) => api.delete(`/campaigns/${id}`),
  
  joinCampaign: (id: string) => api.post(`/campaigns/${id}/join`),
  
  leaveCampaign: (id: string) => api.post(`/campaigns/${id}/leave`),
}

// Business API
export const businessAPI = {
  getProfile: () => api.get('/business/profile'),
  
  updateProfile: (data: any) => api.put('/business/profile', data),
  
  getCampaigns: () => api.get('/business/campaigns'),
  
  updateAnalytics: (campaignId: string, data: any) => 
    api.patch(`/business/campaigns/${campaignId}/analytics`, data),
}

// Admin API
export const adminAPI = {
  getCampaigns: (params?: any) => api.get('/admin/campaigns', { params }),
  
  updateCampaignStatus: (id: string, status: string) => 
    api.put(`/campaigns/${id}/status`, { status }),
}

export default api
