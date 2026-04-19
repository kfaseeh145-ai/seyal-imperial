const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/my
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

const createCheckoutSession = asyncHandler(async (req, res) => {
  const Stripe = require('stripe');

  // Simulated mode fallback when Stripe keys missing
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('your_stripe_secret_key')) {
    // Create a dummy order for simulation purposes
    const { orderItems } = req.body;
    const simulatedOrder = new Order({
      orderItems,
      user: req.user ? req.user._id : null,
      shippingAddress: {},
      paymentMethod: 'Simulated',
      totalPrice: orderItems.reduce((sum, i) => sum + i.price * i.qty, 0),
      isPaid: false,
    });
    await simulatedOrder.save();
    return res.status(200).json({ url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/success?simulated=true&orderId=${simulatedOrder._id}` });
  }

  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  const { orderItems } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  // Create an order document first (payment pending)
  const order = new Order({
    orderItems,
    user: req.user._id,
    shippingAddress: {}, // In a real flow you'd capture this on the client
    paymentMethod: 'Stripe',
    totalPrice: orderItems.reduce((sum, i) => sum + i.price * i.qty, 0),
    isPaid: false,
  });
  const createdOrder = await order.save();

  const lineItems = orderItems.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: { name: item.name },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.qty,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}&orderId=${createdOrder._id}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/`,
    });
    res.json({ url: session.url });
  } catch (error) {
    // Clean up order if Stripe fails
    await Order.findByIdAndDelete(createdOrder._id);
    res.status(500);
    throw new Error(error.message);
  }
});

module.exports = {
  addOrderItems,
  getMyOrders,
  getOrders,
  createCheckoutSession,
};
