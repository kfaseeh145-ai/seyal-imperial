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

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private (owner/admin)
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email role');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const isOwner = order.user && req.user && order.user._id.toString() === req.user._id.toString();
  const isAdmin = req.user && req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }

  res.json(order);
});

// @desc    Create card payment intent for an order (embedded card form)
// @route   POST /api/orders/:id/payment-intent
// @access  Private (owner/admin)
const createPaymentIntentForOrder = asyncHandler(async (req, res) => {
  const Stripe = require('stripe');

  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('your_stripe_secret_key')) {
    res.status(400);
    throw new Error('Payment processor is not configured');
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const isOwner = order.user && req.user && order.user.toString() === req.user._id.toString();
  const isAdmin = req.user && req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    res.status(403);
    throw new Error('Not authorized to pay for this order');
  }

  if (order.isPaid) {
    return res.json({ alreadyPaid: true });
  }

  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  const amount = Math.round(Number(order.totalPrice || 0) * 100);
  if (!amount || amount < 50) {
    res.status(400);
    throw new Error('Invalid order total');
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    metadata: { orderId: order._id.toString() },
    automatic_payment_methods: { enabled: true },
  });

  order.paymentResult = {
    ...(order.paymentResult || {}),
    id: paymentIntent.id,
    status: paymentIntent.status,
    update_time: new Date().toISOString(),
  };
  await order.save();

  res.json({ clientSecret: paymentIntent.client_secret });
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const isOwner = order.user && req.user && order.user.toString() === req.user._id.toString();
  const isAdmin = req.user && req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    res.status(403);
    throw new Error('Not authorized to update this order');
  }

  if (!order.isPaid) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.orderStatus = order.orderStatus === 'Pending' ? 'Processing' : order.orderStatus;
  }

  const paymentResult = req.body?.paymentResult || {};
  const sessionId = req.body?.session_id || req.body?.sessionId;

  order.paymentResult = {
    id: paymentResult.id || sessionId || order.paymentResult?.id,
    status: paymentResult.status || 'succeeded',
    update_time: paymentResult.update_time || new Date().toISOString(),
    email_address: paymentResult.email_address || order.paymentResult?.email_address,
  };

  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

// @desc    Create Stripe checkout session for an order
// @route   POST /api/orders/:id/stripe-session
// @access  Private (owner/admin)
const createStripeSessionForOrder = asyncHandler(async (req, res) => {
  const Stripe = require('stripe');

  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('your_stripe_secret_key')) {
    res.status(400);
    throw new Error('Stripe is not configured');
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const isOwner = order.user && req.user && order.user.toString() === req.user._id.toString();
  const isAdmin = req.user && req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    res.status(403);
    throw new Error('Not authorized to pay for this order');
  }

  if (order.isPaid) {
    return res.json({ url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/order/${order._id}` });
  }

  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

  const lineItems = order.orderItems.map((item) => ({
    price_data: {
      currency: 'usd',
      product_data: { name: item.name },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.qty,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}&orderId=${order._id}`,
    cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout`,
    metadata: {
      orderId: order._id.toString(),
    },
  });

  // Store Stripe session id for later verification/debug
  order.paymentResult = {
    ...(order.paymentResult || {}),
    id: session.id,
    status: 'created',
    update_time: new Date().toISOString(),
  };
  await order.save();

  res.json({ url: session.url, sessionId: session.id });
});

// @desc    Stripe webhook handler (marks orders paid)
// @route   POST /api/orders/stripe/webhook
// @access  Public (Stripe signed)
const stripeWebhook = asyncHandler(async (req, res) => {
  const Stripe = require('stripe');
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    res.status(500);
    throw new Error('Missing STRIPE_WEBHOOK_SECRET');
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    res.status(400);
    throw new Error(`Webhook signature verification failed: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session?.metadata?.orderId;

    if (orderId) {
      const order = await Order.findById(orderId);
      if (order && !order.isPaid) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.orderStatus = order.orderStatus === 'Pending' ? 'Processing' : order.orderStatus;
        order.paymentResult = {
          id: session.id,
          status: session.payment_status || 'paid',
          update_time: new Date().toISOString(),
          email_address: session.customer_details?.email,
        };
        await order.save();
      }
    }
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object;
    const orderId = pi?.metadata?.orderId;
    if (orderId) {
      const order = await Order.findById(orderId);
      if (order && !order.isPaid) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.orderStatus = order.orderStatus === 'Pending' ? 'Processing' : order.orderStatus;
        order.paymentResult = {
          id: pi.id,
          status: pi.status || 'succeeded',
          update_time: new Date().toISOString(),
          email_address: order.paymentResult?.email_address,
        };
        await order.save();
      }
    }
  }

  res.json({ received: true });
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

  // NOTE: Legacy endpoint. New flow uses:
  // - POST /api/orders (create order)
  // - POST /api/orders/:id/stripe-session (pay)

  // Simulated mode fallback when Stripe keys missing
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('your_stripe_secret_key')) {
    // Create a dummy order for simulation purposes
    const { orderItems, shippingAddress, totalPrice } = req.body;
    if (!shippingAddress) {
      res.status(400);
      throw new Error('Missing shippingAddress');
    }
    const simulatedOrder = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod: 'Simulated',
      totalPrice: typeof totalPrice === 'number'
        ? totalPrice
        : orderItems.reduce((sum, i) => sum + i.price * i.qty, 0),
      isPaid: false,
    });
    await simulatedOrder.save();
    return res.status(200).json({ url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/success?simulated=true&orderId=${simulatedOrder._id}` });
  }

  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  const { orderItems, shippingAddress, totalPrice } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }
  if (!shippingAddress) {
    res.status(400);
    throw new Error('Missing shippingAddress');
  }

  // Create an order document first (payment pending)
  const order = new Order({
    orderItems,
    user: req.user._id,
    shippingAddress,
    paymentMethod: 'Stripe',
    totalPrice: typeof totalPrice === 'number'
      ? totalPrice
      : orderItems.reduce((sum, i) => sum + i.price * i.qty, 0),
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
  getOrderById,
  createPaymentIntentForOrder,
  updateOrderToPaid,
  createStripeSessionForOrder,
  stripeWebhook,
  getMyOrders,
  getOrders,
  createCheckoutSession,
};
