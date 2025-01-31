const db = require('../config/db');

class DutyMeal {
  static async createDutyMeal(employeeId, dutyMeal, date, orderAmount) {
    // Ambil employee ID (primary key) terlebih dahulu
    const [[employee]] = await db.query(
      'SELECT id FROM employees WHERE employee_id_number = ?', 
      [employeeId]
    );
    
    if (!employee) {
      throw new Error('Employee not found');
    }

    // Pastikan semua tipe data sesuai dengan definisi tabel
    const [result] = await db.query(
      `INSERT INTO duty_meals 
       (employee_id, duty_meal, date, order_amount, created_at, updated_at) 
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [employee.id, dutyMeal, date, orderAmount]
    );
    
    return result.insertId;
  }
}

module.exports = DutyMeal;