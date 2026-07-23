import mongoose from 'mongoose';

// Database configuration object - आसानी से switch कर सकते हो
const databases = {
  development: {
    local: 'mongodb://localhost:27017/real-time-collaboration-platform-dev',
    mongodb_atlas: 'mongodb+srv://ankit_rajput:2004ankit@cluster0.kqtikms.mongodb.net/collaboration-platform-dev?appName=Cluster0'
  },
  production: {
    mongodb_atlas: 'mongodb+srv://ankit_rajput:2004ankit@cluster0.kqtikms.mongodb.net/collaboration-platform-prod?appName=Cluster0'
  }
};

export const getDatabaseUri = () => {
  const env = process.env.NODE_ENV || 'development';
  
  // अगर .env में MONGODB_URI है तो उसे use करो
  if (process.env.MONGODB_URI) {
    console.log('📍 Using MONGODB_URI from .env');
    return process.env.MONGODB_URI;
  }
  
  // नहीं तो config से लो
  const dbConfig = databases[env];
  if (!dbConfig) {
    throw new Error(`Database config not found for environment: ${env}`);
  }
  
  // Development में local MongoDB default है
  const uri = env === 'development' ? dbConfig.local : dbConfig.mongodb_atlas;
  console.log(`📍 Using ${env === 'development' ? 'LOCAL' : 'ATLAS'} MongoDB`);
  
  return uri;
};

export const connectDatabase = async () => {
  try {
    const uri = getDatabaseUri();
    
    console.log(`\n📡 Connecting to MongoDB...`);
    console.log(`   URI: ${uri.substring(0, 40)}...`);
    
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    
    console.log(`✅ MongoDB Connected!`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Host: ${conn.connection.host}`);
    
    return conn;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:');
    console.error(`   ${error.message}`);
    console.error('\n⚠️  Make sure:');
    console.error('   1. MongoDB is running locally (if using local)');
    console.error('   2. Or MONGODB_URI is set correctly in .env (if using Atlas)');
    console.error('\n   To start MongoDB locally:');
    console.error('   - Windows: mongod');
    console.error('   - Mac: brew services start mongodb-community');
    console.error('   - Linux: sudo systemctl start mongod\n');
    
    process.exit(1);
  }
};
