'use strict';

var mongoose = require('mongoose'),
  Employee = mongoose.model('Employee'),
  RegularTime = mongoose.model('RegularTime');


/**
 * Find regularTime by id
 */
exports.regularTime = function(req, res, next, id) {
    RegularTime.findById(id).populate('employee').exec(function (err, regularTime) {
        if (err) return next(err);
        if (!regularTime) return next(new Error('Failed to load todo ' + id));
        req.regularTime = regularTime;
        next();
    });
};

/**
 * List of regularTime
 */
exports.listOfRegularTime = function(req, res) {
    RegularTime.find().sort('-createdAt').populate('employee').exec(function(err, todos) {
        if (err) return res.json(500, err);
        res.json(todos);
    });
};

/**
 * Show a regularTime
 */
exports.showRegularTime = function(req, res) {
    res.json(req.regularTime);
};

/**
 * Create a regularTime
 */
exports.createRegularTime = function(req, res) {
    var newEmployee = Employee(req.body.employee);
    req.body.employee = newEmployee;
    var regularTime = new RegularTime(
        req.body
    );
    regularTime.save(function(err) {
        if (err) return res.json(500, err);
        regularTime.employee = newEmployee;
        regularTime.populate('employee', function(err, doc) {
            res.json(doc);
        });
    });
};

/**
 * Update a regularTime
 */
exports.updateRegularTime = function(req, res) {
    RegularTime.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.body._id)  },  req.body ,{ new: true}).exec(function (err, updatedRegularTime) {
        if (err) return res.json(500, err);
        res.json(updatedRegularTime);
    });
};

/**
 * Remove a regularTime
 */
exports.removeRegularTime = function(req, res) {
    RegularTime.findById(req.params.regularTimeId, function (err, regularTime) {
        if (err) {
            if (err) return res.json(500, err);
        }
        regularTime.remove(function(err) {
            if (err) return res.json(500, err);
            res.json(regularTime);
        });
    });
};

