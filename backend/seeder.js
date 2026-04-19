const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const sampleProducts = [
  {
    name: 'Signature Sheikh',
    price: 280,
    description: 'An olfactory masterpiece crafted for those who command respect. Dark, rich oud blends seamlessly with spicy cardamom and smooth leather to create an aura of pure power. Housed in a masterful matte black finish with gold accents.',
    images: ['/images/sheikh.png'],
    category: 'Men',
    stock: 50,
    rating: 4.9,
    numReviews: 124,
    notes: {
        top: 'Cardamom',
        heart: 'Leather',
        base: 'Oud, Amber'
    }
  },
  {
    name: 'Femme Royale',
    price: 250,
    description: 'The epitome of majestic elegance. Bright bergamot opens up to a heart of pure Damask rose, settling into a luxurious base of warm amber and vanilla. Encased in a soft rose-gold vessel that captures the light.',
    images: ['/images/femme.png'],
    category: 'Women',
    stock: 30,
    rating: 4.8,
    numReviews: 89,
    notes: {
        top: 'Bergamot',
        heart: 'Damask Rose',
        base: 'Vanilla, Amber'
    }
  }
];

const importData = async () => {
  try {
    await Product.deleteMany();

    await Product.insertMany(sampleProducts);

    console.log('Data Imported successfully! 🚀');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
