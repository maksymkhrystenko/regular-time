'use strict';

var index = require('./controllers'),
    employees = require('./controllers/employees'),
    regularTimes = require('./controllers/regular-times');

/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes

    app.post('/api/regularTimes', regularTimes.createRegularTime);
    app.get('/api/regularTimes', regularTimes.listOfRegularTime);
    app.get('/api/regularTimes/:regularTimeId', regularTimes.showRegularTime);
    app.put('/api/regularTimes/:regularTimeId', regularTimes.updateRegularTime);
    app.del('/api/regularTimes/:regularTimeId', regularTimes.removeRegularTime);

    app.post('/api/employees', employees.createEmployee);
    app.get('/api/employees', employees.listOfEmployees);
    app.get('/api/employees/:employeeId', employees.showEmployee);
    app.put('/api/employees/:employeeId', employees.updateEmployee);
    app.del('/api/employees/:employeeId', employees.removeEmployee);

  // All other routes to use Angular routing in app/scripts/app.js
  app.get('/partials/*', index.partials);
  app.get('/*', index.index);
};