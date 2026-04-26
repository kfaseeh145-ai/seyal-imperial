/**
 * One-time script: promotes a user to admin by email.
 * Usage: node backend/scripts/makeAdmin.js <email>
 * Example: node backend/scripts/makeAdmin.js khanfaseeh84@gmail.com
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const mongoose = require('mongoose');
const User = require('../models/User');

const email = process.argv[2];

if (!email) {
  console.error('Usage: node makeAdmin.js <email>');
  process.exit(1);
}

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ email });

    if (!user) {
      console.error(`No user found with email: ${email}`);
      process.exit(1);
    }

    if (user.role === 'admin') {
      console.log(`${email} is already an admin.`);
      process.exit(0);
    }

    user.role = 'admin';
    await user.save();

    console.log(`✅  Success! ${email} is now an admin.`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

run();
