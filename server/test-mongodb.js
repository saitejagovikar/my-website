import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not set in environment variables');
  process.exit(1);
}

console.log('Attempting to connect to MongoDB...');
console.log('Connection string:', MONGODB_URI.replace(/:[^:]*@/, ':***@')); // Hide password in logs

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 30000,
  connectTimeoutMS: 10000,
  maxPoolSize: 10,
  retryWrites: true,
  w: 'majority'
};

async function testConnection() {
  try {
    // Set up event listeners
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected from MongoDB');    
    });

    // Attempt to connect
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, options);
    
    console.log('Successfully connected to MongoDB!');
    
    // If we get here, the connection was successful
    console.log('Connection state:', mongoose.connection.readyState === 1 ? 'connected' : 'disconnected');
    
    // Close the connection
    await mongoose.connection.close();
    console.log('Connection closed.');
    
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    
    // More detailed error information
    if (error.name === 'MongoServerSelectionError') {
      console.error('MongoDB Server Selection Error:');
      console.error('- This usually means the MongoDB server is not reachable.');
      console.error('- Check if your IP is whitelisted in MongoDB Atlas.');
      console.error('- Verify the cluster is running in MongoDB Atlas.');
      console.error('- Check your network connection.');
    } else if (error.name === 'MongooseServerSelectionError') {
      console.error('Mongoose Server Selection Error:');
      console.error('- This is typically a network or authentication issue.');
    } else if (error.name === 'MongoNetworkError') {
      console.error('MongoDB Network Error:');
      console.error('- Check your internet connection.');
      console.error('- The MongoDB server might be down.');
      console.error('- There might be a firewall blocking the connection.');
    }
    
    process.exit(1);
  }
}

testConnection();
