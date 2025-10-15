import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Campaign title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Campaign description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Campaign category is required'],
    trim: true,
    enum: [
      'environment',
      'social-justice',
      'education',
      'health',
      'community',
      'animal-welfare',
      'humanitarian',
      'technology',
      'arts-culture',
      'other'
    ]
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  images: [{
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, 'Please provide valid image URLs']
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Campaign creator is required']
  },
  location: {
    type: String,
    trim: true,
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Start date must be in the future'
    }
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
    validate: {
      validator: function(value) {
        return value > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  participantsCount: {
    type: Number,
    default: 0,
    min: [0, 'Participants count cannot be negative']
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Business promotion fields
  promotion: {
    type: Boolean,
    default: false
  },
  analytics: {
    views: {
      type: Number,
      default: 0,
      min: [0, 'Views cannot be negative']
    },
    clicks: {
      type: Number,
      default: 0,
      min: [0, 'Clicks cannot be negative']
    },
    signups: {
      type: Number,
      default: 0,
      min: [0, 'Signups cannot be negative']
    }
  }
}, {
  timestamps: true
});

// Text index for search functionality
campaignSchema.index({ 
  title: 'text', 
  description: 'text' 
});

// Additional indexes for better query performance
campaignSchema.index({ createdBy: 1 });
campaignSchema.index({ category: 1 });
campaignSchema.index({ status: 1 });
campaignSchema.index({ startDate: 1 });
campaignSchema.index({ endDate: 1 });
campaignSchema.index({ tags: 1 });

// Virtual for campaign duration in days
campaignSchema.virtual('duration').get(function() {
  if (this.startDate && this.endDate) {
    return Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
  }
  return null;
});

// Method to add participant
campaignSchema.methods.addParticipant = function(userId) {
  if (!this.participants.includes(userId)) {
    this.participants.push(userId);
    this.participantsCount = this.participants.length;
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to remove participant
campaignSchema.methods.removeParticipant = function(userId) {
  this.participants = this.participants.filter(id => id.toString() !== userId.toString());
  this.participantsCount = this.participants.length;
  return this.save();
};

// Method to check if user is participant
campaignSchema.methods.isParticipant = function(userId) {
  return this.participants.some(id => id.toString() === userId.toString());
};

// Static method to search campaigns
campaignSchema.statics.searchCampaigns = function(searchTerm, filters = {}) {
  const query = {};
  
  if (searchTerm) {
    query.$text = { $search: searchTerm };
  }
  
  if (filters.category) {
    query.category = filters.category;
  }
  
  if (filters.status) {
    query.status = filters.status;
  }
  
  if (filters.createdBy) {
    query.createdBy = filters.createdBy;
  }
  
  return this.find(query)
    .populate('createdBy', 'name email role')
    .populate('participants', 'name email')
    .sort({ createdAt: -1 });
};

// Static method to get campaigns by status
campaignSchema.statics.getCampaignsByStatus = function(status) {
  return this.find({ status })
    .populate('createdBy', 'name email role')
    .populate('participants', 'name email')
    .sort({ createdAt: -1 });
};

// Pre-save middleware to validate dates
campaignSchema.pre('save', function(next) {
  if (this.startDate && this.endDate && this.startDate >= this.endDate) {
    return next(new Error('Start date must be before end date'));
  }
  next();
});

// Ensure virtual fields are serialized
campaignSchema.set('toJSON', { virtuals: true });
campaignSchema.set('toObject', { virtuals: true });

export default mongoose.model('Campaign', campaignSchema);
