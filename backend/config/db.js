import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

/**
 * Connect to MongoDB database
 * @returns {Promise<void>}
 */
export const connectDB = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    console.log('🔄 Connecting to MongoDB...');
    
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB successfully');
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
    console.log(`🌐 Host: ${mongoose.connection.host}`);
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

/**
 * Handle graceful shutdown
 */
const gracefulExit = () => {
  mongoose.connection.close(() => {
    console.log('🔌 MongoDB connection closed through app termination');
    process.exit(0);
  });
};

// Handle graceful shutdown on process termination
process.on('SIGINT', gracefulExit);
process.on('SIGTERM', gracefulExit);

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  gracefulExit();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulExit();
});

export default connectDB;
