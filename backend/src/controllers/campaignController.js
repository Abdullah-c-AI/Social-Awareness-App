import Campaign from '../models/Campaign.js';
import User from '../models/User.js';

// Input validation helper
const validateCampaignInput = (body) => {
  const errors = [];
  const { title, description, category, startDate, endDate } = body;

  if (!title || title.trim().length < 3) {
    errors.push('Title must be at least 3 characters');
  }
  if (!description || description.trim().length < 10) {
    errors.push('Description must be at least 10 characters');
  }
  if (!category) {
    errors.push('Category is required');
  }
  if (!startDate || new Date(startDate) <= new Date()) {
    errors.push('Start date must be in the future');
  }
  if (!endDate || new Date(endDate) <= new Date(startDate)) {
    errors.push('End date must be after start date');
  }

  return errors;
};

// Create campaign
export const createCampaign = async (req, res) => {
  try {
    const { title, description, category, tags, images, location, startDate, endDate } = req.body;
    const userId = req.user.userId;
    const userRole = req.user.role;

    // Validate input
    const validationErrors = validateCampaignInput(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Set status based on user role
    const status = userRole === 'admin' ? 'approved' : 'pending';

    // Create campaign
    const campaign = new Campaign({
      title: title.trim(),
      description: description.trim(),
      category,
      tags: tags || [],
      images: images || [],
      createdBy: userId,
      location: location?.trim() || '',
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status,
      promotion: userRole === 'business' // Business campaigns are promotional by default
    });

    await campaign.save();
    await campaign.populate('createdBy', 'name email role');

    res.status(201).json({
      message: 'Campaign created successfully',
      campaign
    });
  } catch (error) {
    console.error('Create campaign error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Validation failed',
        errors
      });
    }
    
    res.status(500).json({ message: 'Server error creating campaign' });
  }
};

// Get campaigns with pagination and filters
export const getCampaigns = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      q: searchTerm,
      sort = 'createdAt',
      status = 'approved'
    } = req.query;

    // Build query
    const query = { status };
    
    if (category) {
      query.category = category;
    }
    
    if (searchTerm) {
      query.$text = { $search: searchTerm };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    // Get campaigns
    const campaigns = await Campaign.find(query)
      .populate('createdBy', 'name email role')
      .populate('participants', 'name email')
      .sort({ [sort]: -1 })
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
    console.error('Get campaigns error:', error);
    res.status(500).json({ message: 'Server error fetching campaigns' });
  }
};

// Get campaign by ID
export const getCampaignById = async (req, res) => {
  try {
    const { id } = req.params;

    const campaign = await Campaign.findById(id)
      .populate('createdBy', 'name email role')
      .populate('participants', 'name email');

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    res.json({ campaign });
  } catch (error) {
    console.error('Get campaign error:', error);
    res.status(500).json({ message: 'Server error fetching campaign' });
  }
};

// Update campaign
export const updateCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, tags, images, location, startDate, endDate } = req.body;
    const userId = req.user.userId;
    const userRole = req.user.role;

    // Find campaign
    const campaign = await Campaign.findById(id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Check permissions (owner or admin)
    if (campaign.createdBy.toString() !== userId && userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this campaign' });
    }

    // Validate input if provided
    if (title || description || startDate || endDate) {
      const validationErrors = validateCampaignInput(req.body);
      if (validationErrors.length > 0) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: validationErrors
        });
      }
    }

    // Update fields
    if (title) campaign.title = title.trim();
    if (description) campaign.description = description.trim();
    if (category) campaign.category = category;
    if (tags) campaign.tags = tags;
    if (images) campaign.images = images;
    if (location !== undefined) campaign.location = location.trim();
    if (startDate) campaign.startDate = new Date(startDate);
    if (endDate) campaign.endDate = new Date(endDate);

    await campaign.save();
    await campaign.populate('createdBy', 'name email role');
    await campaign.populate('participants', 'name email');

    res.json({
      message: 'Campaign updated successfully',
      campaign
    });
  } catch (error) {
    console.error('Update campaign error:', error);
    res.status(500).json({ message: 'Server error updating campaign' });
  }
};

// Delete campaign
export const deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    // Find campaign
    const campaign = await Campaign.findById(id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Check permissions (owner or admin)
    if (campaign.createdBy.toString() !== userId && userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this campaign' });
    }

    await Campaign.findByIdAndDelete(id);

    res.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    console.error('Delete campaign error:', error);
    res.status(500).json({ message: 'Server error deleting campaign' });
  }
};

// Join campaign
export const joinCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Find campaign
    const campaign = await Campaign.findById(id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Check if campaign is approved
    if (campaign.status !== 'approved') {
      return res.status(400).json({ message: 'Campaign is not approved yet' });
    }

    // Check if campaign has ended
    if (new Date() > campaign.endDate) {
      return res.status(400).json({ message: 'Campaign has ended' });
    }

    // Check if user is already a participant
    if (campaign.isParticipant(userId)) {
      return res.status(400).json({ message: 'You are already a participant' });
    }

    // Add user to participants
    await campaign.addParticipant(userId);

    res.json({
      message: 'Successfully joined campaign',
      participantsCount: campaign.participantsCount
    });
  } catch (error) {
    console.error('Join campaign error:', error);
    res.status(500).json({ message: 'Server error joining campaign' });
  }
};

// Leave campaign
export const leaveCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Find campaign
    const campaign = await Campaign.findById(id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Check if user is a participant
    if (!campaign.isParticipant(userId)) {
      return res.status(400).json({ message: 'You are not a participant' });
    }

    // Remove user from participants
    await campaign.removeParticipant(userId);

    res.json({
      message: 'Successfully left campaign',
      participantsCount: campaign.participantsCount
    });
  } catch (error) {
    console.error('Leave campaign error:', error);
    res.status(500).json({ message: 'Server error leaving campaign' });
  }
};

// Update campaign status (admin only)
export const updateCampaignStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ 
        message: 'Status must be either "approved" or "rejected"' 
      });
    }

    // Find campaign
    const campaign = await Campaign.findById(id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Update status
    campaign.status = status;
    await campaign.save();
    await campaign.populate('createdBy', 'name email role');

    res.json({
      message: `Campaign ${status} successfully`,
      campaign
    });
  } catch (error) {
    console.error('Update campaign status error:', error);
    res.status(500).json({ message: 'Server error updating campaign status' });
  }
};

// Get campaigns by status (admin only)
export const getCampaignsByStatus = async (req, res) => {
  try {
    const {
      status = 'pending',
      page = 1,
      limit = 10,
      category,
      q: searchTerm,
      sort = 'createdAt'
    } = req.query;

    // Build query
    const query = { status };
    
    if (category) {
      query.category = category;
    }
    
    if (searchTerm) {
      query.$text = { $search: searchTerm };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    // Get campaigns
    const campaigns = await Campaign.find(query)
      .populate('createdBy', 'name email role')
      .populate('participants', 'name email')
      .sort({ [sort]: -1 })
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
      },
      status
    });
  } catch (error) {
    console.error('Get campaigns by status error:', error);
    res.status(500).json({ message: 'Server error fetching campaigns' });
  }
};

// Increment campaign view count
export const incrementCampaignView = async (req, res) => {
  try {
    const { id } = req.params;

    // Find campaign
    const campaign = await Campaign.findById(id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Check if campaign is approved (only approved campaigns can be viewed)
    if (campaign.status !== 'approved') {
      return res.status(400).json({ message: 'Campaign is not approved yet' });
    }

    // Increment view count
    campaign.analytics.views += 1;
    await campaign.save();

    res.json({
      message: 'View count incremented',
      analytics: {
        views: campaign.analytics.views,
        clicks: campaign.analytics.clicks,
        signups: campaign.analytics.signups
      }
    });
  } catch (error) {
    console.error('Increment campaign view error:', error);
    res.status(500).json({ message: 'Server error incrementing view count' });
  }
};

// Increment campaign click count
export const incrementCampaignClick = async (req, res) => {
  try {
    const { id } = req.params;

    // Find campaign
    const campaign = await Campaign.findById(id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Check if campaign is approved (only approved campaigns can be clicked)
    if (campaign.status !== 'approved') {
      return res.status(400).json({ message: 'Campaign is not approved yet' });
    }

    // Increment click count
    campaign.analytics.clicks += 1;
    await campaign.save();

    res.json({
      message: 'Click count incremented',
      analytics: {
        views: campaign.analytics.views,
        clicks: campaign.analytics.clicks,
        signups: campaign.analytics.signups
      }
    });
  } catch (error) {
    console.error('Increment campaign click error:', error);
    res.status(500).json({ message: 'Server error incrementing click count' });
  }
};
