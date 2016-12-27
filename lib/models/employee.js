'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var employeeSchema = new mongoose.Schema({
    firstName: String,
    secondName: String,
    patronymic: String,
    gender: String,
    contacts: String,
    dateOfCreation:{
        type: Date,
        default: Date.now
    },
    department: String
});

// Set the 'fullname' virtual property
employeeSchema.virtual('fullName').get(function () {
    return this.firstName + ' ' +  this.patronymic + ' ' + this.secondName ;
}).set(function (fullName) {
    var splitName = fullName.split(' ');
    this.secondName = splitName[0] || '';
    this.firstName = splitName[1] || '';
    this.patronymic = splitName[2] || '';
});

employeeSchema.set('toJSON', {
    getters: true,
    virtuals: true
});

module.exports = mongoose.model('Employee', employeeSchema);