import User from '../models/User.js';
import Campaign from '../models/Campaign.js';

// Get business profile
export const getBusinessProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const business = await User.findById(userId).select('-password');
    if (!business) {
      return res.status(404).json({ message: 'Business profile not found' });
    }

    if (business.role !== 'business') {
      return res.status(403).json({ message: 'Access denied. Business role required.' });
    }

    res.json({ business });
  } catch (error) {
    console.error('Get business profile error:', error);
    res.status(500).json({ message: 'Server error fetching business profile' });
  }
};

// Update business profile
export const updateBusinessProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { 
      name, 
      businessName, 
      businessWebsite, 
      businessLogoUrl, 
      businessDescription, 
      bio, 
      avatar 
    } = req.body;

    // Find business user
    const business = await User.findById(userId);
    if (!business) {
      return res.status(404).json({ message: 'Business profile not found' });
    }

    if (business.role !== 'business') {
      return res.status(403).json({ message: 'Access denied. Business role required.' });
    }

    // Validate business-specific fields
    const errors = [];
    if (businessName && businessName.trim().length < 2) {
      errors.push('Business name must be at least 2 characters');
    }
    if (businessWebsite && !/^https?:\/\/.+/.test(businessWebsite)) {
      errors.push('Please enter a valid website URL');
    }
    if (businessLogoUrl && !/^https?:\/\/.+/.test(businessLogoUrl)) {
      errors.push('Please enter a valid logo URL');
    }
    if (businessDescription && businessDescription.length > 1000) {
      errors.push('Business description cannot exceed 1000 characters');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: 'Validation failed',
        errors
      });
    }

    // Update fields
    if (name) business.name = name.trim();
    if (businessName) business.businessName = businessName.trim();
    if (businessWebsite) business.businessWebsite = businessWebsite.trim();
    if (businessLogoUrl) business.businessLogoUrl = businessLogoUrl.trim();
    if (businessDescription) business.businessDescription = businessDescription.trim();
    if (bio !== undefined) business.bio = bio.trim();
    if (avatar !== undefined) business.avatar = avatar.trim();

    await business.save();

    // Return updated profile without password
    const updatedBusiness = business.getPublicProfile();

    res.json({
      message: 'Business profile updated successfully',
      business: updatedBusiness
    });
  } catch (error) {
    console.error('Update business profile error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Validation failed',
        errors
      });
    }
    
    res.status(500).json({ message: 'Server error updating business profile' });
  }
};

// Get business campaigns with analytics
export const getBusinessCampaigns = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { 
      page = 1, 
      limit = 10, 
      status, 
      promotion 
    } = req.query;

    // Build query
    const query = { createdBy: userId };
    
    if (status) {
      query.status = status;
    }
    
    if (promotion !== undefined) {
      query.promotion = promotion === 'true';
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    // Get campaigns
    const campaigns = await Campaign.find(query)
      .populate('participants', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Campaign.countDocuments(query);

    res.json({
      campaigns,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limitNum),
        total,
        limit: limitNum
      }
    });
  } catch (error) {
    console.error('Get business campaigns error:', error);
    res.status(500).json({ message: 'Server error fetching business campaigns' });
  }
};

// Update campaign analytics
export const updateCampaignAnalytics = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { metric } = req.body; // 'views', 'clicks', 'signups'
    const userId = req.user.userId;

    // Validate metric
    if (!['views', 'clicks', 'signups'].includes(metric)) {
      return res.status(400).json({ 
        message: 'Invalid metric. Must be views, clicks, or signups' 
      });
    }

    // Find campaign
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Check if user owns the campaign
    if (campaign.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this campaign' });
    }

    // Increment the specified metric
    campaign.analytics[metric] += 1;
    await campaign.save();

    res.json({
      message: `${metric} incremented successfully`,
      analytics: campaign.analytics
    });
  } catch (error) {
    console.error('Update campaign analytics error:', error);
    res.status(500).json({ message: 'Server error updating campaign analytics' });
  }
};
