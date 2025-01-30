const express = require('express');
const dutyMealController = require('../controllers/dutyMealController');

const router = express.Router();

// Endpoint untuk cek limit
router.post('/check-limit', dutyMealController.checkLimit);

// Endpoint untuk catat transaksi
router.post('/record-transaction', dutyMealController.recordTransaction);

module.exports = router;