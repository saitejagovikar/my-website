import mongoose from 'mongoose';

let isConnected = false;

// Enable debug mode in development
if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true);
}

export async function connectToDatabase() {
  if (isConnected) {
    return;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set in environment variables');
  }

  try {


    const options = {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority',
      retryReads: true,
      ssl: true,
      tlsAllowInvalidCertificates: true, // Only for development
      appName: 'slay-server',
      authSource: 'admin',
      family: 4 // Force IPv4
    };


    await mongoose.connect(uri, options);

    isConnected = true;

    // Log any connection errors after initial connection
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      isConnected = false;
    });

  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Exit process with failure
    process.exit(1);
  }
}
