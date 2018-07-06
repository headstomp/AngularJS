(function () {
    
    angular.module('app.core').directive('arcExpressionViewer', function () {
        return {
            scope: {
                mvel: '=',
            },
            bindToController: true,
            replace: true,
            restrict: 'E',
            templateUrl: 'app/core/arc/arc-expression-viewer.html',
            controllerAs: 'vm',
            controller: function ($scope, $element) {
                var vm = _.merge(this, {
                    _: _,
                    mvel: {},
                    utex: '',
                });
                
                $scope.$watch('vm.mvel', update, true);
                $scope.$watch('vm.utex', function () {
                    console.log(vm.utex);
                    var katexContainer = $element[0].querySelector('.katex-container');
                    katex.render(vm.utex || '', katexContainer);
                });
                
                update();
                
                function update() {
                    try {
                        vm.utext = '';
                        vm.mapping = vm.mvel.mapping;
                        vm.expression = vm.mvel.expression;
                        
                        if (vm.expression) {
                            var node = math.parse(vm.expression || '');
                            vm.utex = node.toTex();
                        }
                    }
                    catch (error) { 
                        vm.utex = '';
                    }
                }
            },
        };
    });
    
})();
