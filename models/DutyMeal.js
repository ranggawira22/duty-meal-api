const db = require('../config/db');

class DutyMeal {
  static async createDutyMeal(employeeId, dutyMeal, date, orderAmount) {
    const [result] = await db.query(
      'INSERT INTO duty_meals (employee_id, duty_meal, date, order_amount) VALUES (?, ?, ?, ?)',
      [employeeId, dutyMeal, date, orderAmount]
    );
    return result.insertId;
  }
}

module.exports = DutyMeal;