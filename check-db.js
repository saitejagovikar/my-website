import mongoose from 'mongoose';

async function checkConnection() {
  try {
    console.log('Attempting to connect to MongoDB...');
    
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/slay', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Successfully connected to MongoDB!');
    
    // Get the database instance
    const db = mongoose.connection.db;
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('📋 Collections in database:', collections.map(c => c.name));
    
    // Check if products collection exists and count documents
    if (collections.some(c => c.name === 'products')) {
      const count = await db.collection('products').countDocuments();
      console.log(`📊 Found ${count} products in the database`);
    } else {
      console.log('ℹ️ Products collection does not exist yet');
    }
    
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Make sure MongoDB is running. You can start it with:');
      console.log('   brew services start mongodb-community  # If using Homebrew');
      console.log('   or');
      console.log('   mongod --config /usr/local/etc/mongod.conf');
    }
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
}

checkConnection();
