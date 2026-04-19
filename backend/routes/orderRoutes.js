const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getMyOrders,
  getOrders,
  createCheckoutSession
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/my').get(protect, getMyOrders);
router.route('/checkout').post(protect, createCheckoutSession);

module.exports = router;
