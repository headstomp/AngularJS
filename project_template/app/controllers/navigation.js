angular.module('MyApp.controllers')

// navigation controller
  .controller('navCtrl', ['$scope', '$location', function ($scope, $location) {
    $scope.navClass = function (page) {
      var currentRoute = $location.path().substring(1) || 'home';
      return page === currentRoute ? 'active' : '';
    }; 
    $scope.loadHome = function () {$location.url('/home');}; 
    $scope.loadOne = function () {$location.url('/one');};
    $scope.loadTwo = function () {$location.url('/two');};
    $scope.loadThree = function () {$location.url('/three');};
    $scope.loadFour = function () {$location.url('/four');};
    $scope.loadFive = function () {$location.url('/five');};    
    $scope.loadSix = function () {$location.url('/six');}; 
    $scope.loadSeven = function () {$location.url('/seven');}; 
    $scope.loadEight = function () {$location.url('/eight');}; 
    $scope.loadNine = function () {$location.url('/nine');}; 
    $scope.loadTen = function () {$location.url('/ten');}; 
  }]);