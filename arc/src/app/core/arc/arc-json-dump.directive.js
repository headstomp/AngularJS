(function () {
    
    angular.module('app.core').directive('arcJsonDump', function () {
        return {
            scope: {
                object: '<?',
            },
            bindToController: true,
            restrict: 'E',
            templateUrl: 'app/core/arc/arc-json-dump.html',
            controllerAs: 'vm',
            controller: function ($scope, $danApi, $qb, $element, $mdDialog) {
                var vm = _.merge(this, {
                        _: _,
                        object: {},
                    });
            },
        };
    });
    
})();
