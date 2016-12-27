'use strict';

var mongoose = require('mongoose'),
    Employee = mongoose.model('Employee');


/**
 * Find employee by id
 */
exports.employees = function(req, res, next, id) {
    Employee.findById(id, function(err, todo) {
        if (err) return next(err);
        if (!todo) return next(new Error('Failed to load todo ' + id));
        req.todo = todo;
        next();
    });
};

/**
 * List of employees
 */
exports.listOfEmployees = function(req, res) {
    Employee.find().sort('-createdAt').exec(function(err, todos) {
        if (err) return res.json(500, err);
        res.json(todos);
    });
};

/**
 * Show a employee
 */
exports.showEmployee = function(req, res) {
    res.json(req.employee);
};

/**
 * Create a employee
 */
exports.createEmployee= function(req, res) {
    var employee = new Employee(req.body);
    employee.save(function(err) {
        if (err) return res.json(500, err);
        res.json(employee);
    });
};

/**
 * Update a employee
 */
exports.updateEmployee = function(req, res) {
    Employee.update({ _id: req.regularTime._id }, req.body, { }, function(err, updatedEmployee) {
        if (err) return res.json(500, err);
        res.json(updatedEmployee);
    });
};

/**
 * Remove a employee
 */
exports.removeEmployee = function(req, res) {
    Employee.findById(req.params.employeeId, function (err, employee) {
        if (err) {
            if (err) return res.json(500, err);
        }
        employee.remove(function(err) {
            if (err) return res.json(500, err);
            res.json(employee);
        });
    });
};

