const express = require('express');
const router = express.Router();
const dutyMealController = require('../controllers/dutyMealController');

// Existing routes
router.post('/check-limit', dutyMealController.checkLimit);
router.post('/record-transaction', dutyMealController.recordTransaction);
router.post('/check-employee', dutyMealController.checkEmployee);

// Logs endpoint with filtering
router.get('/logs', dutyMealController.getRequestLogs);

module.exports = router;