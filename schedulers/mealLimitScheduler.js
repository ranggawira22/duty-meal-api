const cron = require('node-cron');
const Employee = require('../models/Employee');

const scheduleMealLimitReset = () => {
  // Jalankan setiap hari jam 4 pagi
  cron.schedule('0 4 * * *', async () => {
    try {
      await Employee.resetAllDutyMealLimit();
      console.log(`[${new Date().toISOString()}] Successfully reset all duty meal limits`);
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error resetting duty meal limits:`, error);
    }
  });
};

module.exports = scheduleMealLimitReset;