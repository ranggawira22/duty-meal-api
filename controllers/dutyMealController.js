const Employee = require('../models/Employee');
const DutyMeal = require('../models/DutyMeal');
const logger = require('../utils/logger');

exports.checkLimit = async (req, res) => {
  try {
    const { employeeId } = req.body;
    
    // Log the request body
    logger.logRequest(req.body, '/checkLimit');
    
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
    const { employeeId, date, orderAmount } = req.body;
    
    // Log the request body
    logger.logRequest(req.body, '/recordTransaction');
    
    if (!employeeId || !date || orderAmount === undefined) {
      return res.status(400).json({ 
        message: 'employeeId, date, and orderAmount are required',
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
    
    // Log the request body
    logger.logRequest(req.body, '/checkEmployee');
    
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

// Enhanced logs endpoint with filtering
exports.getRequestLogs = async (req, res) => {
  try {
    // Extract filters from query parameters
    const filters = {
      endpoint: req.query.endpoint,
      date: req.query.date
    };
    
    // Get filtered logs
    const logs = logger.getFilteredLogs(filters);
    
    res.json({
      total: logs.length,
      filters: Object.entries(filters)
        .filter(([_, value]) => value !== undefined)
        .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}),
      logs: logs
    });
  } catch (err) {
    console.error('Error getting logs:', err);
    res.status(500).json({ 
      message: 'Error retrieving logs',
      error: err.message 
    });
  }
};