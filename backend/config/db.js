const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri || uri.includes('<username>')) {
      console.warn('⚠️ MongoDB URI is missing or using placeholder in .env. Skipping database connection for now.');
      return;
    }

    const conn = await mongoose.connect(uri, {});
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.log('App will continue in simulated mode.');
  }
};

module.exports = connectDB;
