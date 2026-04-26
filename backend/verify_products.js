const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config({ path: './.env' });

async function verify() {
  try {
    console.log('Connecting to:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const testName = 'Verification Perfume ' + Date.now();
    const testProduct = new Product({
      name: testName,
      price: 15000,
      description: 'A temporary product to verify database storage and visibility.',
      images: ['/images/sheikh.png'],
      category: 'The Royal Collection',
      stock: 10,
      notes: { top: 'Verification', heart: 'Test', base: 'Success' },
      rating: 0,
      numReviews: 0
    });

    const saved = await testProduct.save();
    console.log('SUCCESS: Product stored in DB with ID:', saved._id);

    const found = await Product.findById(saved._id);
    if (found) {
      console.log('VERIFIED: Product is retrievable from DB.');
    } else {
      console.log('ERROR: Product was not found after save.');
    }

    const allProducts = await Product.find({}).limit(50);
    const isVisible = allProducts.some(p => p._id.toString() === saved._id.toString());
    console.log('VISIBILITY: Product exists in general query result:', isVisible);

    await Product.findByIdAndDelete(saved._id);
    console.log('CLEANUP: Test product removed.');

    process.exit(0);
  } catch (err) {
    console.error('FAILURE:', err.message);
    process.exit(1);
  }
}

verify();
