const db = require('../config/db');

class Employee {
  // Method yang sudah ada
  static async findByEmployeeId(employeeId) {
    const [rows] = await db.query('SELECT * FROM employees WHERE employee_id_number = ?', [employeeId]);
    return rows[0];
  }

  static async updateMealLimit(employeeId, newLimit) {
    await db.query('UPDATE employees SET duty_meal_limit = ? WHERE employee_id_number = ?', [newLimit, employeeId]);
  }

  // Method baru untuk reset duty meal limit
  static async resetAllDutyMealLimit() {
    await db.query(`
      UPDATE employees 
      SET duty_meal_limit = ?,
          updated_at = NOW() 
      WHERE employee_id_number IS NOT NULL`,
      [200000]
    );
  }
}

module.exports = Employee;