(function ()
{
    //'use strict';

    angular
        .module('app.exportexcise')
        .controller('exciseController', exciseController);

    /** @ngInject */
    function exciseController($document, $mdDialog, $scope, $q, msApi, $timeout, $window)
    {
        var vm = this;
        $window.location.href = 'gfsa://excise';
        
        $mdDialog.show($mdDialog.alert()
            .textContent('Please wait for the native application to load')
            .ok('Ok'));
    }
     
      
})();

