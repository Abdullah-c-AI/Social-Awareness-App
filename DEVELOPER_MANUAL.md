# Social Awareness App - Developer's Manual

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Local Development](#local-development)
- [Folder Structure](#folder-structure)
- [Adding New Routes & Controllers](#adding-new-routes--controllers)
- [Adding New Models](#adding-new-models)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Build & Deployment](#build--deployment)

## 🚀 Project Overview

The Social Awareness App is a full-stack web application that enables users and businesses to create, manage, and participate in social impact campaigns. It features role-based authentication, campaign management, and an admin approval workflow.

### Key Features
- **User Management**: Registration/login with roles (user, business, admin)
- **Campaign System**: Create, approve, and manage social campaigns
- **Business Profiles**: Business users can create detailed profiles
- **Admin Dashboard**: Campaign approval and platform management
- **Responsive Design**: Mobile-first UI with Tailwind CSS

## 🛠️ Tech Stack

### Backend
- **Node.js 18+** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (with Mongoose ODM)
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security headers
- **Express Rate Limit** - API rate limiting

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

## 🏃‍♂️ Local Development

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Git

### Quick Start
```bash
# 1. Clone and install
git clone <repository-url>
cd social-awareness-app
npm install
cd backend && npm install
cd ../frontend && npm install

# 2. Setup environment
cd ../backend
# Create .env file (see Environment Variables section)

# 3. Start development servers
cd backend && npm run dev
# In another terminal:
cd frontend && npm run dev

# 4. Access application
# Frontend: http://localhost:5174
# Backend: http://localhost:5000/api
```

### Development Scripts

#### Root Level
```bash
npm run install-all    # Install all dependencies
npm run dev           # Start both frontend and backend
npm run build         # Build for production
npm start            # Start production server
```

#### Backend
```bash
cd backend
npm run dev          # Start with nodemon (auto-restart)
npm start           # Start production server
npm run create-admin # Create admin user
```

#### Frontend
```bash
cd frontend
npm run dev         # Start Vite dev server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
npm run type-check  # TypeScript type checking
```

## 📁 Folder Structure

```
social-awareness-app/
├── package.json                    # Root package.json
├── backend/                        # Backend API
│   ├── src/
│   │   ├── server.js              # Express server entry point
│   │   ├── routes/                # API route definitions
│   │   │   ├── index.js           # Main router
│   │   │   ├── auth.js            # Authentication routes
│   │   │   ├── campaigns.js       # Campaign routes
│   │   │   ├── users.js           # User routes
│   │   │   ├── business.js        # Business routes
│   │   │   ├── admin.js           # Admin routes
│   │   │   └── posts.js           # Post routes
│   │   ├── controllers/           # Route handlers
│   │   │   ├── authController.js  # Auth logic
│   │   │   ├── campaignController.js
│   │   │   ├── userController.js
│   │   │   ├── businessController.js
│   │   │   └── postController.js
│   │   ├── models/                # MongoDB models
│   │   │   ├── User.js            # User schema
│   │   │   ├── Campaign.js        # Campaign schema
│   │   │   └── Post.js            # Post schema
│   │   ├── middleware/            # Custom middleware
│   │   │   └── auth.js            # JWT authentication
│   │   └── config/                # Configuration files
│   │       └── db.js              # Database connection
│   ├── scripts/                   # Utility scripts
│   │   └── create-admin.js        # Admin user creation
│   ├── package.json               # Backend dependencies
│   └── .env                       # Environment variables
├── frontend/                      # React frontend
│   ├── src/
│   │   ├── main.tsx              # React entry point
│   │   ├── App.tsx               # Main app component
│   │   ├── components/           # Reusable components
│   │   │   ├── Layout.tsx        # App layout
│   │   │   ├── ProtectedRoute.tsx # Route protection
│   │   │   ├── AuthForm.tsx      # Auth forms
│   │   │   └── PostCard.tsx      # Post display
│   │   ├── pages/                # Page components
│   │   │   ├── Home.tsx          # Landing page
│   │   │   ├── Dashboard.tsx     # User dashboard
│   │   │   ├── Campaigns.tsx     # Campaign listing
│   │   │   ├── CreateCampaign.tsx # Campaign creation
│   │   │   ├── AdminDashboard.tsx # Admin panel
│   │   │   └── auth/             # Auth pages
│   │   │       ├── Login.tsx
│   │   │       └── Register.tsx
│   │   ├── contexts/             # React contexts
│   │   │   └── AuthContext.tsx   # Authentication state
│   │   ├── services/             # API services
│   │   │   ├── api.ts            # Axios configuration
│   │   │   └── analytics.ts      # Analytics tracking
│   │   └── index.css             # Global styles
│   ├── package.json              # Frontend dependencies
│   ├── vite.config.ts            # Vite configuration
│   ├── tailwind.config.cjs       # Tailwind config
│   ├── tsconfig.json             # TypeScript config
│   └── .env                      # Frontend environment
└── README.md                     # Project documentation
```

## 🔧 Adding New Routes & Controllers

### 1. Create a New Controller

Create a new file in `backend/src/controllers/`:

```javascript
// backend/src/controllers/exampleController.js
import Example from '../models/Example.js';

export const createExample = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const example = new Example({
      name,
      description,
      createdBy: req.user.userId
    });
    
    await example.save();
    
    res.status(201).json({
      message: 'Example created successfully',
      example
    });
  } catch (error) {
    console.error('Create example error:', error);
    res.status(500).json({ message: 'Server error creating example' });
  }
};

export const getExamples = async (req, res) => {
  try {
    const examples = await Example.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({ examples });
  } catch (error) {
    console.error('Get examples error:', error);
    res.status(500).json({ message: 'Server error fetching examples' });
  }
};

export const getExampleById = async (req, res) => {
  try {
    const example = await Example.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!example) {
      return res.status(404).json({ message: 'Example not found' });
    }
    
    res.json({ example });
  } catch (error) {
    console.error('Get example error:', error);
    res.status(500).json({ message: 'Server error fetching example' });
  }
};
```

### 2. Create Routes

Create a new file in `backend/src/routes/`:

```javascript
// backend/src/routes/examples.js
import express from 'express';
import { createExample, getExamples, getExampleById } from '../controllers/exampleController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getExamples);
router.get('/:id', getExampleById);

// Protected routes
router.post('/', protect, createExample);

// Admin only routes
router.get('/admin/all', protect, authorize('admin'), getAllExamples);

export default router;
```

### 3. Register Routes

Add the new routes to `backend/src/routes/index.js`:

```javascript
// backend/src/routes/index.js
import exampleRoutes from './examples.js';

// Add to existing imports and routes
router.use('/examples', exampleRoutes);
```

### 4. Frontend Integration

Create API service in `frontend/src/services/api.ts`:

```typescript
// frontend/src/services/api.ts
export const examplesAPI = {
  getExamples: () => api.get('/examples'),
  getExample: (id: string) => api.get(`/examples/${id}`),
  createExample: (data: any) => api.post('/examples', data),
  updateExample: (id: string, data: any) => api.put(`/examples/${id}`, data),
  deleteExample: (id: string) => api.delete(`/examples/${id}`),
};
```

## 🗃️ Adding New Models

### 1. Create Model Schema

Create a new file in `backend/src/models/`:

```javascript
// backend/src/models/Example.js
import mongoose from 'mongoose';

const exampleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'pending'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  metadata: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 }
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Indexes for better performance
exampleSchema.index({ name: 1 });
exampleSchema.index({ status: 1 });
exampleSchema.index({ createdBy: 1 });

// Instance methods
exampleSchema.methods.incrementViews = function() {
  this.metadata.views += 1;
  return this.save();
};

// Static methods
exampleSchema.statics.findByStatus = function(status) {
  return this.find({ status }).populate('createdBy', 'name email');
};

// Pre-save middleware
exampleSchema.pre('save', function(next) {
  // Add any pre-save logic here
  next();
});

export default mongoose.model('Example', exampleSchema);
```

### 2. Model Best Practices

- **Validation**: Use built-in Mongoose validators
- **Indexes**: Add indexes for frequently queried fields
- **Virtuals**: Use virtuals for computed properties
- **Methods**: Add instance and static methods for common operations
- **Middleware**: Use pre/post hooks for data processing
- **References**: Use populate() for related data

## 🔐 Environment Variables

### Backend Environment (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production-make-it-long-and-random

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5174

# Optional: Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Optional: File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

### Frontend Environment (.env)

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Optional: Analytics
VITE_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
```

### Environment Variable Best Practices

1. **Never commit .env files** - Add to .gitignore
2. **Use env.example** - Template for required variables
3. **Validate on startup** - Check required variables exist
4. **Use different values** - Different secrets for dev/staging/prod
5. **Document variables** - List all required variables in README

## 🧪 Testing

### Backend Testing Setup

```bash
# Install testing dependencies
cd backend
npm install --save-dev jest supertest mongodb-memory-server

# Create test files
mkdir tests
touch tests/example.test.js
```

### Example Test File

```javascript
// backend/tests/example.test.js
import request from 'supertest';
import app from '../src/server.js';
import Example from '../src/models/Example.js';

describe('Example API', () => {
  beforeEach(async () => {
    await Example.deleteMany({});
  });

  test('GET /api/examples', async () => {
    const response = await request(app)
      .get('/api/examples')
      .expect(200);
    
    expect(response.body.examples).toBeDefined();
  });

  test('POST /api/examples', async () => {
    const exampleData = {
      name: 'Test Example',
      description: 'Test Description'
    };

    const response = await request(app)
      .post('/api/examples')
      .send(exampleData)
      .expect(201);

    expect(response.body.example.name).toBe('Test Example');
  });
});
```

### Frontend Testing Setup

```bash
# Install testing dependencies
cd frontend
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest jsdom
```

### Running Tests

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# All tests
npm run test
```

## 🚀 Build & Deployment

### Development Build

```bash
# Start development servers
npm run dev
```

### Production Build

```bash
# Build frontend
cd frontend && npm run build

# Build backend (if needed)
cd backend && npm run build
```

### Deployment Checklist

1. **Environment Variables**
   - Set production environment variables
   - Use strong JWT secrets
   - Configure production database

2. **Security**
   - Enable HTTPS
   - Configure CORS properly
   - Set up rate limiting
   - Use Helmet security headers

3. **Database**
   - Use production MongoDB Atlas
   - Set up database backups
   - Configure indexes

4. **Monitoring**
   - Set up error logging
   - Monitor API performance
   - Track user analytics

### Docker Deployment (Optional)

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

## 🔧 Common Development Tasks

### Adding a New Page

1. Create component in `frontend/src/pages/`
2. Add route in `frontend/src/App.tsx`
3. Update navigation in `frontend/src/components/Layout.tsx`

### Adding Authentication to Routes

```javascript
// Backend: Protect route
router.get('/protected', protect, getProtectedData);

// Frontend: Protect component
<ProtectedRoute>
  <YourComponent />
</ProtectedRoute>
```

### Adding Role-Based Access

```javascript
// Backend: Admin only
router.get('/admin', protect, authorize('admin'), adminFunction);

// Frontend: Role check
{user?.role === 'admin' && <AdminComponent />}
```

### Database Migrations

```javascript
// Create migration script
// backend/migrations/add-new-field.js
import mongoose from 'mongoose';
import User from '../src/models/User.js';

const migration = async () => {
  await User.updateMany(
    { newField: { $exists: false } },
    { $set: { newField: 'defaultValue' } }
  );
  console.log('Migration completed');
};

migration();
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection**
   - Check MONGO_URI format
   - Verify IP whitelist (Atlas)
   - Ensure cluster is running

2. **CORS Errors**
   - Update FRONTEND_URL in backend .env
   - Check port numbers match

3. **Authentication Issues**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Validate user exists in database

4. **Build Errors**
   - Clear node_modules and reinstall
   - Check TypeScript errors
   - Verify all dependencies installed

### Debugging Tips

- Use `console.log()` for debugging
- Check browser developer tools
- Monitor server logs
- Use MongoDB Compass for database inspection
- Test API endpoints with Postman

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

For more help, check the main README.md or create an issue in the repository.
