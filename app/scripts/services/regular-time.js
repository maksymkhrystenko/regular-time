'use strict';

angular.module('todomvcApp')
  .factory('RegularTime', function ($resource) {
    return $resource('api/regularTimes/:regularTimeId', {
        regularTimeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  });