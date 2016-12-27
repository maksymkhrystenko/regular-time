'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var regularTimeSchema = new mongoose.Schema({
    employee: {type: Schema.ObjectId, ref: 'Employee'},
    startTimeOfWorkingDay:{
        type: Date,
        default: Date.now
    },
    endTimeOfWorkingDay:{
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('RegularTime', regularTimeSchema);