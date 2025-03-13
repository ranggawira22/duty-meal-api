const Employee = require('../models/Employee');
const DutyMeal = require('../models/DutyMeal');

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

exports.recordTransaction = async (req, res) => {
  try {
    const { employeeId, date } = req.body;
    let { orderAmount } = req.body;
    
    if (!employeeId || !date || orderAmount === undefined) {
      return res.status(400).json({ 
        message: 'employeeId, date, and orderAmount are required',
        status: false
      });
    }
    
    // Convert orderAmount to a proper number by removing thousand separators
    if (typeof orderAmount === 'string') {
      // Replace dots or commas used as thousand separators with nothing
      orderAmount = orderAmount.replace(/[.,]/g, '');
    }
    
    // Convert to number
    orderAmount = Number(orderAmount);
    
    // Check if conversion was successful
    if (isNaN(orderAmount)) {
      return res.status(400).json({
        message: 'Invalid order amount',
        status: false
      });
    }
    
    const employee = await Employee.findByEmployeeId(employeeId);
    if (!employee) {
      return res.status(404).json({ 
        message: 'Employee not found',
        status: false 
      });
    }
    
    if (orderAmount > employee.duty_meal_limit) {
      return res.status(400).json({ 
        message: `Insufficient meal limit. Your current limit is ${employee.duty_meal_limit}.`,
        status: false
      });
    }
    
    const newLimit = employee.duty_meal_limit - orderAmount;
    await Employee.updateMealLimit(employeeId, newLimit);
    await DutyMeal.createDutyMeal(employeeId, newLimit, date, orderAmount);
    
    res.json({ 
      message: 'Transaction recorded',
      remainingLimit: newLimit,
      status: true
    });
  } catch (err) {
    console.error('Transaction Error:', err);
    res.status(500).json({ 
      message: 'Error processing transaction',
      status: false,
      error: err.message 
    });
  }
};

exports.checkEmployee = async (req, res) => {
  try {
    const { employeeId } = req.body;
    
    if (!employeeId) {
      return res.status(400).json({ 
        message: 'employeeId is required',
        status: false
      });
    }
    
    const employee = await Employee.findByEmployeeId(employeeId);
    
    if (!employee) {
      return res.status(404).json({ 
        message: 'Employee not found'
      });
    }
    
    res.json({ 
      name: employee.name,
      employee_id_number: employee.employee_id_number
    });
  } catch (err) {
    console.error('Check Employee Error:', err);
    res.status(500).json({ 
      message: 'Error checking employee',
      error: err.message 
    });
  }
};