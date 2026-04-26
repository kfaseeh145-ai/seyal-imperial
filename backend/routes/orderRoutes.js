const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getMyOrders,
  getOrders,
  updateOrderToPaid,
  getOrderById,
  updateOrderToCompleted,
  deleteOrder
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, admin, getOrders);
router.post('/', protect, addOrderItems);
router.get('/my', protect, getMyOrders);
router.put('/:id/pay', protect, updateOrderToPaid);
router.put('/:id/deliver', protect, admin, updateOrderToCompleted);
router.get('/:id', protect, getOrderById);
router.delete('/:id', protect, admin, deleteOrder);

module.exports = router;
