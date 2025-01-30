const db = require('../config/db');

class DutyMeal {
  // Catat transaksi duty meal ke tabel duty_meals
  static async createDutyMeal(employeeId, date, orderItem, orderAmount) {
    const [result] = await db.query(
      'INSERT INTO duty_meals (employee_id, date, order_item, order_amount) VALUES (?, ?, ?, ?)',
      [employeeId, date, orderItem, orderAmount]
    );
    return result.insertId;
  }
}

module.exports = DutyMeal;