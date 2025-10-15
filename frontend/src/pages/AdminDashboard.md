# AdminDashboard.tsx - Complete Implementation

## Overview
The AdminDashboard component provides a comprehensive admin interface for managing campaigns, with role-based access control and campaign status management.

## Key Features

### 1. Role Validation
```typescript
// Client-side role validation
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
```

### 2. Campaign Management
- **List pending campaigns** with approve/reject buttons
- **Filter campaigns** by status, category, and search term
- **Real-time stats** showing campaign counts
- **Status updates** with loading states

### 3. API Integration
```typescript
// Fetch campaigns by status
const campaignsResponse = await adminAPI.getCampaigns({
  status: filters.status,
  category: filters.category,
  q: filters.search
})

// Update campaign status
await adminAPI.updateCampaignStatus(campaignId, newStatus)
```

## API Usage Examples

### Backend API Endpoints

#### 1. Get Campaigns by Status (Admin Only)
```javascript
// GET /api/admin/campaigns?status=pending&category=environment&q=search
// Headers: Authorization: Bearer <admin-jwt-token>

// Response:
{
  "campaigns": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "title": "Environmental Cleanup Drive",
      "description": "Join us for a community cleanup...",
      "category": "environment",
      "status": "pending",
      "promotion": false,
      "analytics": {
        "views": 45,
        "clicks": 12,
        "signups": 8
      },
      "participantsCount": 8,
      "createdBy": {
        "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user",
        "businessName": null
      },
      "createdAt": "2023-09-01T10:00:00.000Z",
      "startDate": "2023-09-15T09:00:00.000Z",
      "endDate": "2023-09-15T17:00:00.000Z",
      "location": "Central Park",
      "images": ["https://example.com/image1.jpg"],
      "tags": ["environment", "community", "cleanup"]
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

#### 2. Update Campaign Status (Admin Only)
```javascript
// PUT /api/campaigns/:id/status
// Headers: Authorization: Bearer <admin-jwt-token>
// Body: { "status": "approved" | "rejected" }

// Request:
{
  "status": "approved"
}

// Response:
{
  "message": "Campaign status updated successfully",
  "campaign": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "title": "Environmental Cleanup Drive",
    "status": "approved",
    // ... other campaign fields
  }
}
```

### Frontend API Service Usage

#### 1. Admin API Service
```typescript
// services/api.ts
export const adminAPI = {
  // Get campaigns with filters
  getCampaigns: (params?: any) => api.get('/admin/campaigns', { params }),
  
  // Update campaign status
  updateCampaignStatus: (id: string, status: string) => 
    api.put(`/campaigns/${id}/status`, { status }),
}
```

#### 2. Component Usage
```typescript
// In AdminDashboard.tsx
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
```

## Security Features

### 1. Backend Security
```javascript
// routes/admin.js
const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Admin campaign management
router.get('/campaigns', getCampaignsByStatus);
```

### 2. Frontend Security
```typescript
// Double protection: Route-level and component-level
<Route path="/admin/dashboard" element={
  <ProtectedRoute requiredRole="admin">
    <AdminDashboard />
  </ProtectedRoute>
} />

// Component-level validation
if (!isAuthenticated || user?.role !== 'admin') {
  return <AccessDenied />
}
```

## Usage Instructions

### 1. Register as Admin
```typescript
// Register with admin role
await authAPI.register(
  'Admin User',
  'admin@example.com',
  'password123',
  'admin'
)
```

### 2. Access Admin Dashboard
- Login with admin account
- Navigate to `/admin/dashboard`
- View pending campaigns
- Approve or reject campaigns

### 3. Filter and Search
- Use status filter: pending, approved, rejected
- Filter by category: environment, health, education, etc.
- Search by campaign title or description

## Error Handling

### 1. API Errors
```typescript
try {
  await adminAPI.updateCampaignStatus(campaignId, newStatus)
} catch (error: any) {
  toast.error(error.response?.data?.message || 'Failed to update campaign status')
}
```

### 2. Loading States
```typescript
const [actionLoading, setActionLoading] = useState<string | null>(null)

// Show loading state for specific campaign
<button disabled={actionLoading === campaign._id}>
  {actionLoading === campaign._id ? 'Processing...' : 'Approve'}
</button>
```

## Styling and UI

### 1. Tailwind CSS Classes
- `bg-white rounded-lg shadow-sm border border-gray-200` - Card styling
- `px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700` - Button styling
- `animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600` - Loading spinner

### 2. Responsive Design
- `grid grid-cols-1 md:grid-cols-4 gap-6` - Responsive grid
- `flex flex-col sm:flex-row gap-4` - Responsive flex layout

## Testing

### 1. Manual Testing
1. Register as admin user
2. Create campaigns as regular users
3. Login as admin
4. Navigate to admin dashboard
5. Test approve/reject functionality

### 2. API Testing
```bash
# Test admin endpoint
curl -X GET "http://localhost:5000/api/admin/campaigns?status=pending" \
  -H "Authorization: Bearer <admin-jwt-token>"

# Test status update
curl -X PUT "http://localhost:5000/api/campaigns/:id/status" \
  -H "Authorization: Bearer <admin-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{"status": "approved"}'
```

This AdminDashboard provides a complete admin interface with proper security, error handling, and user experience considerations.

