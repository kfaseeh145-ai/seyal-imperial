const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

const dummyProducts = [
  {
    _id: 'signature-sheikh',
    name: 'Signature Sheikh',
    price: 280,
    description: 'An olfactory masterpiece crafted for those who command respect. Dark, rich oud blends seamlessly with spicy cardamom and smooth leather to create an aura of pure power. Housed in a masterful matte black finish with gold accents.',
    images: ['/images/sheikh.png'],
    category: 'The Royal Collection',
    notes: { top: 'Cardamom', heart: 'Leather', base: 'Oud, Amber' }
  },
  {
    _id: 'femme-royale',
    name: 'Femme Royale',
    price: 250,
    description: 'The epitome of majestic elegance. Bright bergamot opens up to a heart of pure Damask rose, settling into a luxurious base of warm amber and vanilla. Encased in a soft rose-gold vessel that captures the light.',
    images: ['/images/femme.png'],
    category: 'The Royal Collection',
    notes: { top: 'Bergamot', heart: 'Damask Rose', base: 'Vanilla, Amber' }
  }
];

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 50;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: 'i' } }
    : {};

  let count = 0;
  let products = [];

  try {
    count = await Product.countDocuments({ ...keyword });
    products = await Product.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1));
  } catch (err) {
    console.error("❌ Database Fetch Error:", err.message);
  }

  // Fallback to dummy products if DB is empty or disconnected
  if (products.length === 0) {
    console.log("ℹ️ Returning simulated product data.");
    return res.json({ 
      products: dummyProducts, 
      page: 1, 
      pages: 1,
      isSimulated: true 
    });
  }

  res.json({ 
    products, 
    page, 
    pages: Math.ceil(count / pageSize) || 1 
  });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, images, category, stock, notes } = req.body;

  const product = new Product({
    name,
    price,
    description,
    images: images || ['/images/sample.jpg'],
    category,
    stock,
    notes: notes || { top: '', heart: '', base: '' }
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, images, category, stock, notes } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.images = images || product.images;
    product.category = category || product.category;
    product.stock = stock || product.stock;
    product.notes = notes || product.notes;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
