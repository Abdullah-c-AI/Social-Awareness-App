# Admin Account Setup

## 🔒 **Security Implementation**

Admin accounts are **NOT** publicly registerable for security reasons. Instead, they are created through a secure database script.

## 🚀 **Default Admin Account**

A default admin account has been created with the following credentials:

- **Email**: `admin@socialawareness.com`
- **Password**: `admin123`
- **Role**: `admin`

## ⚠️ **Important Security Notes**

1. **Change Password Immediately**: After first login, change the password to something secure
2. **Use Strong Password**: Choose a password with at least 12 characters, including numbers, symbols, and mixed case
3. **Keep Credentials Secure**: Don't share admin credentials with unauthorized users

## 🔧 **How to Login as Admin**

1. **Go to Login Page**: `http://localhost:5174/login`
2. **Enter Credentials**:
   - Email: `admin@socialawareness.com`
   - Password: `admin123`
3. **Click Login**
4. **Access Admin Dashboard**: Click "Admin" in navigation or go to `/admin/dashboard`

## 🛠️ **Creating Additional Admin Accounts**

If you need to create additional admin accounts, you can:

### Option 1: Modify the Script
Edit `backend/scripts/create-admin.js` and change the email/password, then run:
```bash
cd backend
npm run create-admin
```

### Option 2: Database Direct Creation
Connect to MongoDB and manually create an admin user:
```javascript
// In MongoDB shell or MongoDB Compass
db.users.insertOne({
  name: "Admin Name",
  email: "admin@example.com",
  password: "$2a$10$hashedpassword", // Use bcrypt to hash password
  role: "admin",
  isActive: true,
  createdAt: new Date()
})
```

## 🔐 **Production Security Recommendations**

For production deployment:

1. **Environment Variables**: Store admin credentials in environment variables
2. **Strong Passwords**: Use randomly generated strong passwords
3. **Two-Factor Authentication**: Implement 2FA for admin accounts
4. **Audit Logging**: Log all admin actions
5. **IP Restrictions**: Restrict admin access to specific IP addresses
6. **Regular Rotation**: Regularly rotate admin passwords

## 📝 **Admin Features Available**

Once logged in as admin, you can:

- ✅ **View Dashboard**: See campaign statistics
- ✅ **Manage Campaigns**: Approve/reject pending campaigns
- ✅ **Filter Campaigns**: Search by status, category, or keywords
- ✅ **View Analytics**: See campaign performance metrics
- ✅ **User Management**: (Future feature) Manage user accounts

## 🚨 **Troubleshooting**

### Admin Login Not Working
1. Check if the admin user exists in the database
2. Verify the email and password are correct
3. Ensure the backend server is running
4. Check browser console for any errors

### Permission Denied
1. Verify the user role is set to "admin" in the database
2. Check if the JWT token is valid
3. Ensure the frontend is properly reading the user role

## 📞 **Support**

If you encounter any issues with admin access, check:
1. Backend server logs for authentication errors
2. Database connection status
3. JWT token validity
4. User role in the database

