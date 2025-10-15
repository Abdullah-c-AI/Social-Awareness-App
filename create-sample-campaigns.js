import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

// Sample campaign data
const campaigns = [
  {
    title: "Clean Ocean Initiative",
    description: "Join us in cleaning up our local beaches and protecting marine life. We'll provide all necessary equipment and organize beach cleanup events every weekend.",
    category: "environment",
    tags: ["ocean", "cleanup", "marine-life", "volunteer"],
    images: ["https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800"],
    location: "Santa Monica Beach, CA",
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 1 month from now
    createdBy: "business"
  },
  {
    title: "Community Garden Project",
    description: "Help us establish a community garden in downtown area. We need volunteers for planting, maintenance, and organizing educational workshops about sustainable agriculture.",
    category: "community",
    tags: ["gardening", "sustainability", "education", "community"],
    images: ["https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800"],
    location: "Downtown Community Center",
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: "user"
  },
  {
    title: "Digital Literacy for Seniors",
    description: "Teach senior citizens how to use computers, smartphones, and the internet. Help bridge the digital divide and connect older adults with modern technology.",
    category: "education",
    tags: ["education", "seniors", "technology", "volunteer"],
    images: ["https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"],
    location: "Local Library",
    startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: "business"
  },
  {
    title: "Animal Shelter Support",
    description: "Volunteer at our local animal shelter. Help with feeding, walking dogs, cleaning cages, and providing love and care to abandoned animals.",
    category: "animal-welfare",
    tags: ["animals", "shelter", "volunteer", "pets"],
    images: ["https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800"],
    location: "Happy Paws Animal Shelter",
    startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: "user"
  },
  {
    title: "Food Drive for Families",
    description: "Organize a community food drive to help families in need. Collect non-perishable food items and distribute them to local food banks and families.",
    category: "humanitarian",
    tags: ["food-drive", "community", "helping", "charity"],
    images: ["https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800"],
    location: "Community Center",
    startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: "business"
  },
  {
    title: "Mental Health Awareness Week",
    description: "Organize workshops and events to raise awareness about mental health issues. Include guest speakers, support group sessions, and resource sharing.",
    category: "health",
    tags: ["mental-health", "awareness", "support", "education"],
    images: ["https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800"],
    location: "Community Health Center",
    startDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: "user"
  }
];

// Sample users to create
const users = [
  {
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    password: "password123",
    role: "user"
  },
  {
    name: "Mike Chen",
    email: "mike.chen@example.com", 
    password: "password123",
    role: "user"
  },
  {
    name: "Eco Warriors Inc",
    email: "contact@ecowarriors.org",
    password: "password123",
    role: "business",
    businessName: "Eco Warriors Inc",
    businessDescription: "Environmental organization focused on conservation and sustainability."
  },
  {
    name: "Community Helpers",
    email: "info@communityhelpers.org",
    password: "password123", 
    role: "business",
    businessName: "Community Helpers",
    businessDescription: "Non-profit organization dedicated to supporting local communities."
  }
];

async function createUsers() {
  console.log('Creating users...');
  const createdUsers = [];
  
  for (const userData of users) {
    try {
      const response = await axios.post(`${API_BASE}/auth/register`, userData);
      console.log(`✅ Created user: ${userData.name}`);
      createdUsers.push({
        ...userData,
        token: response.data.token,
        userId: response.data.user._id
      });
    } catch (error) {
      console.log(`❌ Failed to create user ${userData.name}:`, error.response?.data?.message || error.message);
    }
  }
  
  return createdUsers;
}

async function createCampaigns(users) {
  console.log('\nCreating campaigns...');
  
  for (const campaign of campaigns) {
    try {
      // Find a user to create the campaign
      const user = users.find(u => u.role === campaign.createdBy);
      if (!user) {
        console.log(`❌ No ${campaign.createdBy} user found for campaign: ${campaign.title}`);
        continue;
      }
      
      const campaignData = {
        title: campaign.title,
        description: campaign.description,
        category: campaign.category,
        tags: campaign.tags,
        images: campaign.images,
        location: campaign.location,
        startDate: campaign.startDate,
        endDate: campaign.endDate
      };
      
      const response = await axios.post(`${API_BASE}/campaigns`, campaignData, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      console.log(`✅ Created campaign: ${campaign.title}`);
    } catch (error) {
      console.log(`❌ Failed to create campaign ${campaign.title}:`, error.response?.data?.message || error.message);
    }
  }
}

async function main() {
  try {
    console.log('🚀 Starting campaign creation process...\n');
    
    const users = await createUsers();
    
    if (users.length > 0) {
      await createCampaigns(users);
    } else {
      console.log('❌ No users created, skipping campaign creation');
    }
    
    console.log('\n✅ Campaign creation process completed!');
  } catch (error) {
    console.error('❌ Error in main process:', error.message);
  }
}

main();
