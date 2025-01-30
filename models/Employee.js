const db = require('../config/db');

class Employee {
  // Cari employee berdasarkan employee_id_number
  static async findByEmployeeId(employeeId) {
    const [rows] = await db.query('SELECT * FROM employees WHERE employee_id_number = ?', [employeeId]);
    return rows[0];
  }

  // Update sisa limit meal employee
  static async updateMealLimit(employeeId, newLimit) {
    await db.query('UPDATE employees SET duty_meal_limit = ? WHERE employee_id_number = ?', [newLimit, employeeId]);
  }
}

module.exports = Employee;