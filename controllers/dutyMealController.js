const Employee = require('../models/Employee');
const DutyMeal = require('../models/DutyMeal');

// Cek sisa limit meal employee
exports.checkLimit = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const employee = await Employee.findByEmployeeId(employeeId);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({ name: employee.name, mealLimit: employee.duty_meal_limit });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Catat transaksi duty meal
exports.recordTransaction = async (req, res) => {
  try {
    const { employeeId, date, orderItem, orderAmount } = req.body;
    const employee = await Employee.findByEmployeeId(employeeId);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Cek apakah sisa limit mencukupi
    if (employee.duty_meal_limit < orderAmount) {
      return res.status(400).json({ message: 'Insufficient meal limit' });
    }

    // Kurangi sisa limit
    const newLimit = employee.duty_meal_limit - orderAmount;
    await Employee.updateMealLimit(employeeId, newLimit);

    // Catat transaksi ke tabel duty_meals
    await DutyMeal.createDutyMeal(employeeId, date, orderItem, orderAmount);

    // Berikan respons sukses
    res.json({ message: 'Transaction recorded', remainingLimit: newLimit });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};