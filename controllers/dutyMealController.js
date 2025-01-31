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
      const { employeeId, date, orderAmount } = req.body;
      
      if (!employeeId || !date || orderAmount === undefined) {
        return res.status(400).json({ 
          message: 'employeeId, date, and orderAmount are required' 
        });
      }
  
      const employee = await Employee.findByEmployeeId(employeeId);
  
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
  
      if (employee.duty_meal_limit < orderAmount) {
        return res.status(400).json({ message: 'Insufficient meal limit' });
      }
  
      // Hitung sisa limit baru
      const newLimit = employee.duty_meal_limit - orderAmount;
      
      // Update limit di tabel employees
      await Employee.updateMealLimit(employeeId, newLimit);
  
      // Simpan transaksi
      await DutyMeal.createDutyMeal(employeeId, newLimit, date, orderAmount);
  
      res.json({ 
        message: 'Transaction recorded successfully', 
        remainingLimit: newLimit
      });
    } catch (err) {
      console.error('Transaction Error:', err);
      res.status(500).json({ 
        message: 'Error processing transaction',
        error: err.message 
      });
    }
  };