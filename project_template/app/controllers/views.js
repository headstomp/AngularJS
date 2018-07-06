angular.module('MyApp.controllers')
// view controllers
  

  .controller('home', ['$scope', function ($scope) {
    $scope.title='This is the home page';
    $scope.view='home.htm';
    $scope.controller='views.js';

  }])

  .controller('one', ['$scope', function ($scope) {
    $scope.title='This is the one page';
    $scope.view='one.htm';
    $scope.controller='views.js';

  }])

  .controller('two', ['$scope', function ($scope) {
    $scope.title='This is the two page';
    $scope.view='two.htm';
    $scope.controller='views.js';

  }])

  .controller('three', ['$scope', function ($scope) {
    $scope.title='This is the three page';
    $scope.view='three.htm';
    $scope.controller='views.js';

  }])

  .controller('four', ['$scope', function ($scope) {
    $scope.title='This is the four page';
    $scope.view='four.htm';
    $scope.controller='views.js';

  }])

  .controller('five', ['$scope', function ($scope) {
    $scope.title='This is the five page';
    $scope.view='five.htm';
    $scope.controller='views.js';

  }])

  .controller('six', ['$scope', function ($scope) {
    $scope.title='This is the six page';
    $scope.view='six.htm';
    $scope.controller='views.js';

  }])

  .controller('seven', ['$scope', function ($scope) {
    $scope.title='This is the seven page';
    $scope.view='seven.htm';
    $scope.controller='views.js';

  }])

  .controller('eight', ['$scope', function ($scope) {
    $scope.title='This is the eight page';
    $scope.view='eight.htm';
    $scope.controller='views.js';

  }])

  .controller('nine', ['$scope', function ($scope) {
    $scope.title='This is the nine page';
    $scope.view='nine.htm';
    $scope.controller='views.js';

  }])

  .controller('ten', ['$scope', function ($scope) {
    $scope.title='This is the ten page';
    $scope.view='ten.htm';
    $scope.controller='views.js';

  }]);
