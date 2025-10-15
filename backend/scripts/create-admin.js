import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/models/User.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@socialawareness.com' });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const adminUser = new User({
      name: 'System Administrator',
      email: 'admin@socialawareness.com',
      password: 'admin123', // This will be hashed by the pre-save hook
      role: 'admin',
      isActive: true
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@socialawareness.com');
    console.log('🔑 Password: admin123');
    console.log('⚠️  Please change the password after first login!');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the script
createAdminUser();
