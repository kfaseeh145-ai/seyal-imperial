const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    isGiftPack,
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
      isGiftPack,
      totalPrice,
    });

    const createdOrder = await order.save();
    
    // Send Order Confirmation Email
    const user = await User.findById(req.user._id);
    if (user) {
      await sendEmail({
        to: user.email,
        subject: `Seyal Imperial - Order Confirmed #${createdOrder._id.toString().slice(-6).toUpperCase()}`,
        html: `
          <div style="font-family: serif; color: #111; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #c9a96e; text-align: center;">
            <h1 style="color: #c9a96e; text-transform: uppercase; letter-spacing: 3px;">Order Confirmed</h1>
            <p>Your journey with Seyal Imperial has begun.</p>
            <div style="margin: 30px 0; padding: 20px; background: #fafafa; border-radius: 4px; text-align: left;">
              <p><strong>Order ID:</strong> #${createdOrder._id}</p>
              <p><strong>Total Amount:</strong> PKR ${createdOrder.totalPrice.toFixed(2)}</p>
              <p><strong>Status:</strong> Processing</p>
              ${createdOrder.isGiftPack ? '<p style="color: #c9a96e;"><strong>✨ Included:</strong> Premium Gift Pack</p>' : ''}
            </div>
            <p style="color: #666; font-size: 14px;">We are currently preparing your royal collection. You will receive another update once it's dispatched.</p>
          </div>
        `
      });
    }

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

  const paymentResult = req.body?.paymentResult || {};
  const sessionId = req.body?.session_id || req.body?.sessionId;

  const updatedOrder = await Order.findByIdAndUpdate(
    req.params.id,
    {
      isPaid: true,
      paidAt: Date.now(),
      orderStatus: order.orderStatus === 'Pending' ? 'Processing' : order.orderStatus,
      paymentResult: {
        id: paymentResult.id || sessionId || order.paymentResult?.id,
        status: paymentResult.status || 'succeeded',
        update_time: paymentResult.update_time || new Date().toISOString(),
        email_address: paymentResult.email_address || order.paymentResult?.email_address,
      }
    },
    { new: true, runValidators: false }
  );

  res.json(updatedOrder);
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

// @desc    Update order to delivered/completed
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToCompleted = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        isPaid: true,
        paidAt: order.paidAt || Date.now(),
        isDelivered: true,
        deliveredAt: Date.now(),
        orderStatus: 'Completed',
      },
      { new: true, runValidators: false }
    ).populate('user', 'name email');

    // Send Order Dispatched/Completed Email
    if (updatedOrder && updatedOrder.user) {
      await sendEmail({
        to: updatedOrder.user.email,
        subject: `Seyal Imperial - Your Order has been Dispatched!`,
        html: `
          <div style="font-family: serif; color: #111; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #c9a96e; text-align: center;">
            <h1 style="color: #c9a96e; text-transform: uppercase; letter-spacing: 3px;">Order Dispatched</h1>
            <p>Your signature of elegance is on its way.</p>
            <div style="margin: 30px 0; padding: 20px; background: #000; color: #fff; border-radius: 4px;">
              <p style="margin: 0;">Order #${updatedOrder._id.toString().slice(-6).toUpperCase()} is now officially dispatched.</p>
            </div>
            <p style="color: #666; font-size: 14px;">Thank you for choosing Seyal Imperial. We hope you enjoy your new fragrance.</p>
          </div>
        `
      });
    }

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    await order.deleteOne();
    res.json({ message: 'Order removed' });
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

module.exports = {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderToCompleted,
  deleteOrder,
};
