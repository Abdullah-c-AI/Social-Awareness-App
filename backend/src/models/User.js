import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: ['user', 'business', 'admin'],
    default: 'user',
    required: true
  },
  // Business-specific fields (only for business role)
  businessName: {
    type: String,
    trim: true,
    maxlength: [100, 'Business name cannot exceed 100 characters'],
    required: function() {
      return this.role === 'business';
    }
  },
  businessWebsite: {
    type: String,
    trim: true,
    default: '',
    validate: {
      validator: function(v) {
        if (v === '') return true; // Allow empty string
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Please enter a valid website URL'
    }
  },
  businessLogoUrl: {
    type: String,
    trim: true,
    default: '',
    validate: {
      validator: function(v) {
        if (v === '') return true; // Allow empty string
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Please enter a valid logo URL'
    }
  },
  businessDescription: {
    type: String,
    maxlength: [1000, 'Business description cannot exceed 1000 characters'],
    required: function() {
      return this.role === 'business';
    }
  },
  // Common fields for all users
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Pre-save hook to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with salt rounds of 10
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Method to get public profile (exclude sensitive data)
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ name: 1 });
userSchema.index({ role: 1 });
userSchema.index({ businessName: 1 });

export default mongoose.model('User', userSchema);
