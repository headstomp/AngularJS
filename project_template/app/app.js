'use strict';

angular.module('MyApp', [
  'ngRoute',
  'MyApp.services',
  'MyApp.directives',
  'MyApp.controllers'
]).

config(function ($routeProvider, $locationProvider, $httpProvider) {
  $routeProvider.when('/home', {templateUrl: 'app/views/home.htm', controller: 'home'});
  $routeProvider.when('/one', {templateUrl: 'app/views/one.htm', controller: 'one'});
  $routeProvider.when('/two', {templateUrl: 'app/views/two.htm', controller: 'two'});
  $routeProvider.when('/three', {templateUrl: 'app/views/three.htm', controller: 'three'});
  $routeProvider.when('/four', {templateUrl: 'app/views/four.htm', controller: 'four'});
  $routeProvider.when('/five', {templateUrl: 'app/views/five.htm', controller: 'five'});
  $routeProvider.when('/six', {templateUrl: 'app/views/six.htm', controller: 'six'});
  $routeProvider.when('/seven', {templateUrl: 'app/views/seven.htm', controller: 'seven'});
  $routeProvider.when('/eight', {templateUrl: 'app/views/eight.htm', controller: 'eight'});
  $routeProvider.when('/nine', {templateUrl: 'app/views/nine.htm', controller: 'nine'});
  $routeProvider.when('/ten', {templateUrl: 'app/views/ten.htm', controller: 'ten'});
  $routeProvider.otherwise({redirectTo: '/home'});

});
