import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to authenticate JWT token (protect)
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists and is active
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid token or user not found' });
    }

    // Add user info to request
    req.user = {
      userId: decoded.userId,
      email: user.email,
      role: user.role,
      name: user.name
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Server error during authentication' });
  }
};

// Middleware to authorize specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Check if user's role is in the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Access denied. Insufficient permissions.',
        required: roles,
        current: req.user.role
      });
    }

    next();
  };
};

// Legacy alias for backward compatibility
export const authenticateToken = protect;
