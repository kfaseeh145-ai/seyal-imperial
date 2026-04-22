const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getMyOrders,
  getOrders,
  createCheckoutSession,
  updateOrderToPaid,
  getOrderById,
  createStripeSessionForOrder,
  createPaymentIntentForOrder,
  stripeWebhook
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/my').get(protect, getMyOrders);
router.route('/checkout').post(protect, createCheckoutSession);
router.post('/stripe/webhook', stripeWebhook);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/stripe-session').post(protect, createStripeSessionForOrder);
router.route('/:id/payment-intent').post(protect, createPaymentIntentForOrder);

module.exports = router;
