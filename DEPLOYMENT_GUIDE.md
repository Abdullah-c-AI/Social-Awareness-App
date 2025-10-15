# 🚀 Deployment Guide for Render.com

This guide will help you deploy your Social Awareness App to Render.com.

## 📋 Prerequisites

1. **GitHub Repository**: Your code should be pushed to GitHub
2. **Render.com Account**: Sign up at [render.com](https://render.com)
3. **MongoDB Atlas**: Database should be set up (already configured)

## 🎯 Deployment Steps

### Step 1: Deploy Backend API

1. **Go to Render Dashboard**
   - Visit [dashboard.render.com](https://dashboard.render.com)
   - Click "New +" → "Web Service"

2. **Connect GitHub Repository**
   - Click "Build and deploy from a Git repository"
   - Connect your GitHub account if not already connected
   - Select your repository: `Abdullah-c-AI/Social-Awareness-App`

3. **Configure Backend Service**
   - **Name**: `social-awareness-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. **Environment Variables**
   ```
   NODE_ENV=production
   PORT=10000
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key_here
   FRONTEND_URL=https://social-awareness-frontend.onrender.com
   ```

5. **Click "Create Web Service"**

### Step 2: Deploy Frontend

1. **Create New Static Site**
   - Click "New +" → "Static Site"
   - Connect your GitHub repository

2. **Configure Frontend Service**
   - **Name**: `social-awareness-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

3. **Environment Variables**
   ```
   VITE_API_URL=https://social-awareness-backend.onrender.com
   ```

4. **Click "Create Static Site"**

### Step 3: Update Backend CORS

After deploying both services, update your backend environment variable:
```
FRONTEND_URL=https://social-awareness-frontend.onrender.com
```

## 🔧 Manual Deployment (Alternative)

If you prefer manual setup:

### Backend Deployment
1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect GitHub repo
4. Configure:
   - **Name**: `social-awareness-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`

### Frontend Deployment
1. Click "New +" → "Static Site"
2. Connect GitHub repo
3. Configure:
   - **Name**: `social-awareness-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`

## 🌐 URLs After Deployment

- **Backend API**: `https://social-awareness-backend.onrender.com`
- **Frontend App**: `https://social-awareness-frontend.onrender.com`

## 🔐 Environment Variables Reference

### Backend Required Variables:
```
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=https://social-awareness-frontend.onrender.com
```

### Frontend Required Variables:
```
VITE_API_URL=https://social-awareness-backend.onrender.com
```

## 🚨 Important Notes

1. **Free Tier Limitations**:
   - Services sleep after 15 minutes of inactivity
   - Cold starts may take 30-60 seconds
   - 750 hours/month free

2. **Database**:
   - MongoDB Atlas is already configured
   - No additional setup needed

3. **SSL Certificates**:
   - Automatically provided by Render
   - HTTPS enabled by default

## 🐛 Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json

2. **CORS Errors**:
   - Ensure FRONTEND_URL matches your deployed frontend URL
   - Check backend environment variables

3. **Database Connection**:
   - Verify MongoDB Atlas connection string
   - Check IP whitelist settings

4. **Environment Variables**:
   - Double-check all required variables are set
   - No trailing spaces in values

## 📱 Testing Deployment

1. **Backend Health Check**:
   ```
   GET https://social-awareness-backend.onrender.com/api/health
   ```

2. **Frontend Access**:
   - Visit your frontend URL
   - Test registration/login
   - Create a campaign

## 🔄 Updating Deployment

To update your deployed app:
1. Push changes to GitHub
2. Render automatically rebuilds and redeploys
3. No manual intervention needed

## 📞 Support

If you encounter issues:
1. Check Render service logs
2. Verify environment variables
3. Test locally first
4. Check MongoDB Atlas connection

---

**🎉 Congratulations!** Your Social Awareness App is now live on Render.com!
