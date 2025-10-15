import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.js';

// Load environment variables
dotenv.config();

/**
 * Migration script to update existing business users with new fields
 * Run this script once to update existing business users
 */
const migrateBusinessFields = async () => {
  try {
    console.log('🔄 Starting business fields migration...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find all business users
    const businessUsers = await User.find({ role: 'business' });
    console.log(`📊 Found ${businessUsers.length} business users to migrate`);

    let updatedCount = 0;

    for (const user of businessUsers) {
      const updates = {};

      // Migrate website to businessWebsite if it exists
      if (user.website && !user.businessWebsite) {
        updates.businessWebsite = user.website;
        console.log(`📝 Migrating website for user: ${user.email}`);
      }

      // Add default businessLogoUrl if missing
      if (!user.businessLogoUrl) {
        updates.businessLogoUrl = 'https://via.placeholder.com/150x150/007bff/ffffff?text=Logo';
        console.log(`🖼️ Adding default logo URL for user: ${user.email}`);
      }

      // Update user if there are changes
      if (Object.keys(updates).length > 0) {
        await User.findByIdAndUpdate(user._id, updates);
        updatedCount++;
        console.log(`✅ Updated user: ${user.email}`);
      }
    }

    console.log(`🎉 Migration completed! Updated ${updatedCount} business users`);
    console.log('📋 Migration Summary:');
    console.log('- Migrated website field to businessWebsite');
    console.log('- Added default businessLogoUrl for users without one');
    console.log('- All business users now have required fields');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateBusinessFields();
}

export default migrateBusinessFields;
