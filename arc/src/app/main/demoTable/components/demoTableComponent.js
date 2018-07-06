(function () {
    angular.module('app.demoTable')
        .component('dtDetail', {
            //transclude: true,
            templateUrl: 'app/main/demoTable/components/demoTableComponent.html',
            bindings: {
                aspects: '<',
                data: '<'
            },
            controllerAs: 'vm',
            controller: function ($scope, $timeout, $element) {
                var vm = this;
                vm.dtInstanceCallback = dtInstanceCallback;

                function dtInstanceCallback(dtInstance) {
                    vm.dtInstance = dtInstance;
                    console.log(vm.dtInstance);
                }
                this.$onChanges = function (changesObj) {
                    if (changesObj.aspects) {
                        $timeout(function () {
                            this.aspects = changesObj.aspects;
                            this.data = changesObj.data;
                            vm.dtInstance.rerender();
                        }, 1000);
                    }
                }
            }
        });
})();
