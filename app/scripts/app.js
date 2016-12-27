'use strict';

angular.module('todomvcApp', [
    'ui.select',
    'ngResource',
    'ngRoute',
    'ngAnimate',
    'ngSanitize',
    'mgcrea.ngStrap',
    'ngDialog',
    'angularMoment',
    'datatables',
    'ngLodash'

])
  .config(function ($routeProvider, $locationProvider) {

    $routeProvider
      .when('/', {
        templateUrl: 'partials/main',
        controller: 'MainCtrl',
        reloadOnSearch: false
      })
      .otherwise({
        redirectTo: '/'
      });


      
    $locationProvider.html5Mode(true);
  }).run(function(amMoment) {
    amMoment.changeLocale('ru');
});