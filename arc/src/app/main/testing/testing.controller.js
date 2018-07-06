(function () {
    
    'use strict';
    
    angular
    .module('app.testing')
    .controller('testingController', testingController);
    
    /** @ngInject */
    function testingController($scope, $mdDialog, $interval, thriftApi) {
        
        var vm = _.merge(this, {
                
                itemSet: {},
                
                showExpressionBuilderHelp: function () {
                    var dialog = $mdDialog.show({
                            fullscreen: true,
                            templateUrl: 'app/core/arc/arc-expression-syntax-help-dialog.html',
                            controllerAs: 'vm',
                            controller: function () {
                                var vm = _.merge(this, {
                                        close: $mdDialog.hide,
                                    });
                            },
                        });
                },
                
                showSelectTagSourceExample: function () {
                    var dialog = $mdDialog.show({
                            fullscreen: true,
                            templateUrl: 'testing.html/select-tag-source-example',
                            controllerAs: 'vm',
                            controller: function () {
                                var vm = _.merge(this, {
                                        tagSource: {},
                                        close: $mdDialog.hide,
                                    });
                            },
                        });
                },
                
                showSelectTagExample: function () {
                    var dialog = $mdDialog.show({
                            fullscreen: true,
                            templateUrl: 'testing.html/select-tag-example',
                            controllerAs: 'vm',
                            controller: function ($scope, $qb) {
                                var vm = _.merge(this, {
                                        tag: {},
                                        tagSource: {},
                                        tagWhereSet: [],
                                        close: $mdDialog.hide,
                                    });
                                $scope.$watch('vm.tagSource', function () {
                                    vm.tagWhereSet = [
                                        $qb.where.equalTo('TagSourceId', $qb.as.int64(vm.tagSource.Id)),
                                    ];
                                });
                            },
                        });
                },
                
                showExpressionBuilderExample: function () {
                    var dialog = $mdDialog.show({
                            fullscreen: true,
                            templateUrl: 'testing.html/expression-builder-example',
                            controllerAs: 'vm',
                            controller: function () {
                                var vm = _.merge(this, {
                                        close: $mdDialog.hide,
                                    });
                            },
                        });
                },
                
                showSelectTagListExample: function () {
                    var dialog = $mdDialog.show({
                            fullscreen: true,
                            templateUrl: 'testing.html/select-tag-list-example',
                            controllerAs: 'vm',
                            controller: function ($danApi) {
                                var vm = _.merge(this, {
                                        tagSet: [],
                                        close: $mdDialog.hide,
                                    });
                            },
                        });
                },
                
                showSelectLocationExample: function () {
                    var dialog = $mdDialog.show({
                            fullscreen: true,
                            templateUrl: 'testing.html/select-location-example',
                            controllerAs: 'vm',
                            controller: function ($danApi) {
                                var vm = _.merge(this, {
                                        location: {},
                                        close: $mdDialog.hide,
                                    });
                            },
                        });
                },
                
            });
            
        vm.data = [];
        vm.rowIndexSet = [];
        vm.colIndexSet = [];
        vm.reportId = 1178; 
        $scope.$watch('vm.reportId', function (reportId) {
            thriftApi.resolveReportResultsByReportId(reportId).then(function (result) {
                vm.data = result;
                vm.rowIndexSet = _.range(0, vm.data.length);
                vm.colIndexSet = _.range(0, vm.data[0].length);
                console.log(vm.rowIndexSet);
                console.log(vm.colIndexSet);
            });
        });
        
        vm.someText = 'Hello World!';
        
        vm.openThing = function (item) {
            window.alert('Opening ' + item.name);
        }
        
        $interval(function () {
            var length = _.keys(vm.itemSet).length + 1;
            if (length > 10) { 
                return;
            }
            vm.itemSet[length] = {
                id: length,
                name: 'Item ' + length,
                description: 'Description for Item ' + length,
            };
        }, 500);
    }
    
})();
