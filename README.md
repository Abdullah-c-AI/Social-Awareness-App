# Social Awareness Web Application

A modern social awareness platform that enables users and businesses to create, manage, and participate in social impact campaigns. Built with Node.js, Express, React, TypeScript, and MongoDB with role-based authentication and campaign management features.

## ⚡ Quick Start

```bash
# 1. Clone and install
git clone <repository-url>
cd social-awareness-app
npm install && cd backend && npm install && cd ../frontend && npm install && cd ..

# 2. Setup environment
cd backend
# Create .env file with MongoDB URI and JWT secret
# See Environment Configuration section below

# 3. Start servers
cd backend && npm run dev
# In another terminal:
cd frontend && npm run dev

# 4. Access application
# Frontend: http://localhost:5174
# Admin Login: admin@socialawareness.com / admin123
```

## 🚀 Tech Stack

### Backend
- **Node.js** with **Express.js** - Server framework
- **MongoDB** with **Mongoose** - Database and ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security headers
- **Express Rate Limit** - API rate limiting

### Frontend
- **React 18** with **TypeScript** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **React Hook Form** - Form handling
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

## 📁 Project Structure

```
social-awareness-app/
├── package.json                 # Root package.json with monorepo scripts
├── backend/                     # Backend API
│   ├── src/
│   │   ├── server.js           # Express server entry point
│   │   ├── routes/             # API routes
│   │   │   ├── auth.js         # Authentication routes
│   │   │   ├── users.js        # User management routes
│   │   │   ├── campaigns.js    # Campaign management routes
│   │   │   ├── business.js     # Business-specific routes
│   │   │   ├── admin.js        # Admin management routes
│   │   │   └── posts.js        # Post management routes
│   │   ├── controllers/        # Route controllers
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── campaignController.js
│   │   │   ├── businessController.js
│   │   │   └── postController.js
│   │   ├── models/             # MongoDB models
│   │   │   ├── User.js
│   │   │   ├── Campaign.js
│   │   │   └── Post.js
│   │   └── middleware/          # Custom middleware
│   │       └── auth.js          # JWT authentication middleware
│   ├── package.json            # Backend dependencies
│   └── env.example             # Environment variables template
├── frontend/                    # React frontend
│   ├── src/
│   │   ├── main.tsx            # React app entry point
│   │   ├── App.tsx              # Main app component
│   │   ├── components/         # Reusable components
│   │   │   ├── Layout.tsx      # App layout component
│   │   │   ├── PostCard.tsx    # Post display component
│   │   │   └── CreatePost.tsx  # Post creation component
│   │   ├── pages/              # Page components
│   │   │   ├── Home.tsx        # Home page
│   │   │   ├── Dashboard.tsx   # User dashboard
│   │   │   ├── Campaigns.tsx   # Campaign listing page
│   │   │   ├── CampaignDetails.tsx # Campaign detail page
│   │   │   ├── CreateCampaign.tsx # Campaign creation page
│   │   │   ├── AdminDashboard.tsx # Admin dashboard
│   │   │   ├── Profile.tsx     # User profile page
│   │   │   └── auth/           # Authentication pages
│   │   │       ├── Login.tsx
│   │   │       └── Register.tsx
│   │   ├── contexts/           # React contexts
│   │   │   └── AuthContext.tsx # Authentication context
│   │   └── services/           # API services
│   │       └── api.ts          # Axios API client
│   ├── package.json            # Frontend dependencies
│   ├── vite.config.ts          # Vite configuration
│   ├── tailwind.config.cjs     # Tailwind CSS configuration
│   ├── postcss.config.cjs      # PostCSS configuration
│   ├── tsconfig.json           # TypeScript configuration
│   └── env.example             # Frontend environment variables
└── README.md                   # This file
```

## 🛠️ Complete Setup Guide

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn**
- **Git**

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd social-awareness-app

# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root directory
cd ..
```

### 2. Environment Configuration

#### Backend Environment Variables
Create the backend environment file:

```bash
cd backend
# Create .env file (copy from env.example or create manually)
```

Edit `backend/.env` with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database (Choose one option)
# Option 1: Local MongoDB
MONGO_URI=mongodb://localhost:27017/social-awareness-app

# Option 2: MongoDB Atlas (Recommended)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production-make-it-long-and-random

# Frontend URL (for CORS) - IMPORTANT: Match your frontend port
FRONTEND_URL=http://localhost:5174
```

#### Frontend Environment Variables (Optional)
The frontend will work with default settings, but you can create `frontend/.env`:

```env
# Frontend Environment Variables
VITE_API_URL=http://localhost:5000/api
```

### 3. Database Setup

#### Option A: MongoDB Atlas (Recommended - Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Update `MONGO_URI` in `backend/.env`
6. **Important**: Add your IP address to the whitelist in Atlas Network Access

#### Option B: Local MongoDB
```bash
# Install and start MongoDB locally
# Windows: Download from mongodb.com
# macOS: brew install mongodb-community
# Linux: sudo apt-get install mongodb

# Start MongoDB service
mongod
```

### 4. Start Development Servers

#### Option 1: Start Both Services (Recommended)
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

#### Option 2: Quick Start (One Terminal)
```bash
# Start backend in background
cd backend && npm run dev &

# Start frontend
cd frontend && npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:5174 (or 5173)
- **Backend API**: http://localhost:5000/api
- **Login Page**: http://localhost:5174/login
- **Register Page**: http://localhost:5174/register

## 👥 User Roles & Features

### 🔐 User Roles
- **Regular User**: Can create campaigns, join campaigns, view all approved campaigns
- **Business User**: Can create promotional campaigns, manage business profile, view analytics
- **Admin**: Can approve/reject campaigns, manage all users, access admin dashboard

### 🎯 Key Features
- **Campaign Creation**: Create social awareness campaigns with categories, tags, and images
- **Campaign Management**: View, edit, and manage your campaigns
- **Campaign Approval**: Admin approval workflow for campaign quality control
- **User Dashboard**: Personalized dashboard with campaign statistics
- **Business Profiles**: Business users can create detailed business profiles
- **Admin Panel**: Comprehensive admin dashboard for platform management
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS

### 🔑 Default Admin Account
- **Email**: `admin@socialawareness.com`
- **Password**: `admin123`
- **Access**: Full admin privileges including campaign approval

### 📱 Application Flow
1. **Register/Login** → Choose user type (individual or business)
2. **Dashboard** → View personalized statistics and quick actions
3. **Create Campaign** → Fill out campaign details and submit for approval
4. **Browse Campaigns** → Discover and join approved campaigns
5. **Admin Review** → Admins approve/reject submitted campaigns

## 🚀 Production Deployment

### Build for Production

```bash
# Build both frontend and backend
npm run build
```

### Start Production Server

```bash
# Start the production server (serves both API and built frontend)
npm start
```

The production server will:
- Serve the API on the configured PORT
- Serve the built React app for all non-API routes
- Handle client-side routing automatically

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (user/business roles)
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user (authenticated)
- `GET /api/auth/profile` - Get user profile (authenticated)

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID (authenticated)
- `PUT /api/users/:id` - Update user (authenticated)
- `DELETE /api/users/:id` - Delete user (admin only)

### Campaigns
- `GET /api/campaigns` - Get all approved campaigns (public)
- `GET /api/campaigns/:id` - Get campaign by ID (public)
- `POST /api/campaigns` - Create campaign (authenticated)
- `PUT /api/campaigns/:id` - Update campaign (authenticated, owner only)
- `DELETE /api/campaigns/:id` - Delete campaign (authenticated, owner only)
- `POST /api/campaigns/:id/join` - Join campaign (authenticated)
- `POST /api/campaigns/:id/leave` - Leave campaign (authenticated)
- `PUT /api/campaigns/:id/status` - Update campaign status (admin only)
- `POST /api/campaigns/:id/view` - Track campaign view (public)
- `POST /api/campaigns/:id/click` - Track campaign click (public)

### Business
- `GET /api/business/profile` - Get business profile (business role only)
- `PUT /api/business/profile` - Update business profile (business role only)
- `GET /api/business/campaigns` - Get business campaigns (business role only)
- `PATCH /api/business/campaigns/:id/analytics` - Update campaign analytics (business role only)

### Admin
- `GET /api/admin/campaigns` - Get campaigns by status (admin only)
- `GET /api/admin/dashboard` - Get admin dashboard data (admin only)

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get post by ID
- `POST /api/posts` - Create post (authenticated)
- `PUT /api/posts/:id` - Update post (authenticated)
- `DELETE /api/posts/:id` - Delete post (authenticated)
- `POST /api/posts/:id/like` - Like post (authenticated)
- `DELETE /api/posts/:id/like` - Unlike post (authenticated)

## 🔧 Available Scripts

### Root Level Scripts
- `npm run install-all` - Install all dependencies
- `npm run build` - Build both frontend and backend
- `npm start` - Start production server
- `npm run dev` - Start both services in development mode

### Backend Scripts
- `cd backend && npm run dev` - Start backend in development mode
- `cd backend && npm start` - Start backend in production mode

### Frontend Scripts
- `cd frontend && npm run dev` - Start frontend development server
- `cd frontend && npm run build` - Build frontend for production
- `cd frontend && npm run preview` - Preview production build

## 🛡️ Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcryptjs with salt rounds
- **CORS Protection** - Configured for specific origins
- **Rate Limiting** - API rate limiting to prevent abuse
- **Security Headers** - Helmet.js for security headers
- **Input Validation** - Server-side validation for all inputs
- **XSS Protection** - Built-in React protections

## 🎨 UI/UX Features

- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Modern UI** - Clean, accessible interface
- **Real-time Updates** - React Query for data synchronization
- **Toast Notifications** - User feedback for actions
- **Loading States** - Proper loading indicators
- **Error Handling** - Graceful error handling and display

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues & Solutions

1. **MongoDB Connection Error**
   ```bash
   # Error: MongooseError: Operation `users.findOne()` buffering timed out
   ```
   - **Solution**: Check your MongoDB Atlas IP whitelist
   - Go to MongoDB Atlas → Network Access → Add IP Address
   - Add your current IP or use `0.0.0.0/0` for development

2. **CORS Errors**
   ```bash
   # Error: Access to XMLHttpRequest blocked by CORS policy
   ```
   - **Solution**: Update `FRONTEND_URL` in `backend/.env`
   - Make sure it matches your frontend port (5174 or 5173)
   - Example: `FRONTEND_URL=http://localhost:5174`

3. **Port Already in Use**
   ```bash
   # Error: listen EADDRINUSE: address already in use :::5000
   ```
   - **Solution**: Kill existing processes
   ```bash
   # Windows
   taskkill /IM node.exe /F
   
   # macOS/Linux
   pkill -f node
   ```

4. **Login/Registration Failed**
   ```bash
   # Error: Server error during login/registration
   ```
   - **Solution**: Check if backend server is running
   - Verify MongoDB connection is working
   - Check browser console for detailed error messages

5. **Admin Login Not Working**
   - **Default Admin Credentials**:
     - Email: `admin@socialawareness.com`
     - Password: `admin123`
   - **Solution**: Ensure admin user exists in database

6. **Frontend Not Loading**
   - Check if frontend server is running on correct port
   - Verify `VITE_API_URL` in frontend/.env (optional)
   - Clear browser cache and hard refresh

### Quick Fixes

```bash
# Kill all Node.js processes
taskkill /IM node.exe /F  # Windows
pkill -f node            # macOS/Linux

# Restart servers
cd backend && npm run dev
cd frontend && npm run dev

# Clear and reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Getting Help

- Check browser console for client-side errors
- Check terminal/console for server-side errors
- Verify all environment variables are set correctly
- Ensure MongoDB is accessible and IP is whitelisted
- Check that both frontend and backend servers are running

### Database Issues

- **MongoDB Atlas**: Ensure cluster is running and IP is whitelisted
- **Local MongoDB**: Ensure `mongod` service is running
- **Connection String**: Verify `MONGO_URI` format is correct
