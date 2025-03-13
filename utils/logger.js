// utils/logger.js
const fs = require('fs');
const path = require('path');

/**
 * Logger utility for API requests
 */
class ApiLogger {
  constructor(options = {}) {
    this.logDir = options.logDir || path.join(__dirname, '../logs');
    this.filename = options.filename || 'api-requests.log';
    this.enabled = options.enabled !== undefined ? options.enabled : true;
    
    // Create logs directory if it doesn't exist
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  /**
   * Log API request data
   * @param {Object} data - Data to log
   * @param {string} endpoint - API endpoint
   */
  logRequest(data, endpoint) {
    if (!this.enabled) return;

    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      endpoint,
      requestBody: data
    };

    const logPath = path.join(this.logDir, this.filename);
    
    try {
      // Append to log file
      fs.appendFileSync(
        logPath,
        JSON.stringify(logEntry, null, 2) + ',\n',
        'utf8'
      );
    } catch (err) {
      console.error('Error writing to log file:', err);
    }
  }

  /**
   * Get all logged requests
   * @returns {Array} Array of logged requests
   */
  getLoggedRequests() {
    const logPath = path.join(this.logDir, this.filename);
    
    try {
      if (!fs.existsSync(logPath)) {
        return [];
      }
      
      const logContent = fs.readFileSync(logPath, 'utf8');
      // Parse the log file content (which consists of comma-separated JSON objects)
      const jsonString = `[${logContent.replace(/,\s*$/, '')}]`;
      return JSON.parse(jsonString);
    } catch (err) {
      console.error('Error reading log file:', err);
      return [];
    }
  }

  /**
   * Get filtered logs
   * @param {Object} filters - Optional filters (endpoint, date, etc.)
   * @returns {Array} Filtered array of logged requests
   */
  getFilteredLogs(filters = {}) {
    let logs = this.getLoggedRequests();
    
    // Filter by endpoint if specified
    if (filters.endpoint) {
      logs = logs.filter(log => log.endpoint === filters.endpoint);
    }
    
    // Filter by date if specified (YYYY-MM-DD)
    if (filters.date) {
      logs = logs.filter(log => log.timestamp.substring(0, 10) === filters.date);
    }
    
    return logs;
  }
}

module.exports = new ApiLogger();