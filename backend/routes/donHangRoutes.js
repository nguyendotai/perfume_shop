// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const donHangController = require('../controllers/donHangController');

router.post('/', donHangController.createOrder);
router.get('/', donHangController.getAllOrders);
router.get('/:id', donHangController.getOrderById);
router.put('/:id', donHangController.updateOrder);
router.delete('/:id', donHangController.deleteOrder);

router.put('/pay/:id', donHangController.payOrder);
router.post('/check-voucher', donHangController.checkVoucher);

module.exports = router;
