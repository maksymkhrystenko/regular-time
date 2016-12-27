'use strict';

angular.module('todomvcApp')
  .factory('Employee', function ($resource) {
    return $resource('api/employees/:employeeId', {
        employeeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  });