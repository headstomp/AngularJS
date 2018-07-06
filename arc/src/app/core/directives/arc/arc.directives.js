(function () {
    
    angular.module('app.core.arc', []);
    
    angular.module('app.core.arc').directive('arcSelectLocation', function () {
        return {
            restrict: 'E',
            controllerAs: '$ctrl',
            controller: function () {
                var $ctrl = angular.merge(this, {
                    // TODO
                });
            },
            
        };
        
    });
    
    
    
})();