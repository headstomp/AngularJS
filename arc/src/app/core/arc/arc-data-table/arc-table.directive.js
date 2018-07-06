(function () {
    
    'use strict';
    
    angular.module('app.core').filter('console', function () {
        return function (value) {
            console.log(value);
        };
    });
    
    angular.module('app.core').directive('arcTable', function ($compile, $templateRequest, $timeout) {
        
        var e = angular.element;
        
        return {
            restrict: 'E',
            scope: {
                itemSet: '<',
                onFilterChange: '&',
            },
            controllerAs: '$table',
            bindToController: true,
            compile: compile,
            controller: controller,
        };
        
        function compile($element, $attrs) {
            
            var containerElement = e();
            
            var headTrElement = e('<tr></tr>');
            _.each($element.find('table-head > column'), function (columnElement) {
                var attributes = {};
                _.each(columnElement.attributes, function (attribute) {
                    attributes[attribute.name] = attribute.value;
                });
                headTrElement.append([
                        e('<th></th>', attributes).append([
                                e(columnElement).html(),
                            ]),
                    ]);
            });
            
            var dataTrElement = e('<tr></tr>');
            _.each($element.find('table-data > column'), function (columnElement) {
                var attributes = {};
                _.each(columnElement.attributes, function (attribute) {
                    attributes[attribute.name] = attribute.value;
                });
                dataTrElement.append([
                        e('<td></td>', attributes).append([
                                e(columnElement).html(),
                            ]),
                    ]);
            });
            
            $templateRequest('app/core/arc/arc-data-table/arc-table.html').then(function (template) {
                var scopedTemplate = $compile(template)({
                    // TODO;
                });
                containerElement = $element.empty().append([
                            e(scopedTemplate),
                        ]);
            });
            
            return function ($scope, $element) {
                
                $timeout(function () {
                    e(containerElement).find('thead').empty();
                    var scopedTrElement = $compile(headTrElement.clone())(_.merge($scope, {
                                $filter: {},
                            }));
                    e(containerElement).find('thead').append(scopedTrElement);
                });
                
                $scope.$watchCollection('$table.itemSet', function (itemSet) {
                    
                    e(containerElement).find('tbody').empty();
                    if (_.isEmpty(itemSet)) {
                        e(containerElement).find('tbody').append([
                            e('<tr></tr>', { class: 'no-results' }).append([
                                e('<td></td>', { colspan: 999 }).append([
                                    e('<span></span>', { class: 'fa fa-fw fa-search' }),
                                    e('<span>No results to display</span>'),
                                ]),
                            ]),
                        ]);
                    }
                    _.each(itemSet, function (item, key) {
                        var scopedTrElement = $compile(dataTrElement.clone())(_.merge($scope.$parent.$new(), {
                                    $key: key,
                                    $item: item,
                                }));
                        e(containerElement).find('tbody').append(scopedTrElement);
                    });
                });
            };
            
        }
        
        function controller($scope) {
            
            var $table = _.merge(this, {
                    // TODO;
                });
            
            var filterChange = _.throttle(function (filter) {
                    $table.onFilterChange({
                        filter: filter,
                    });
                }, 1000);
            
            $scope.$watch('$filter', function (filter) {
                filterChange(filter);
            }, true);
            
        }
        
    });
    
    angular.module('app.core').directive('arcTableContainer', function ($compile, $templateRequest) {
        
        var e = angular.element;
        
        return {
            restrict: 'E',
            transclude: true,
            scope: {},
            template: '<div ng-transclude></div>',
            controllerAs: 'self',
            bindToController: true,
            controller: controller,
        };
        
        function controller() {
            // TODO;
        }
        
    });
    
    angular.module('app.core').directive('arcTableTag', function ($timeout) {
        
        return {
            restrict: 'E',
            scope: {},
            controllerAs: '$vm',
            bindToController: true,
            controller: controller,
            templateUrl: 'app/core/arc/arc-data-table/arc-table-tag.html'
        };
        
        function controller($scope, $danApi, $qb) {
            var $vm = _.merge(this, {
                filter: {},
                tagSet: [],
                minimumPage: minimumPage,
                maximumPage: maximumPage,
                incrementPage: incrementPage,
                decrementPage: decrementPage,
            });

            $scope.moment = moment;
            
            var throttledRefreshTagSet = _.throttle(refreshTagSet, 500);
            
            $scope.$watch('$vm.filter', throttledRefreshTagSet, true);
            
            function incrementPage() {
                _.set($vm.filter, 'page.index', _.toInteger(_.get($vm.filter, 'page.index')) + 1);
            }
            
            function decrementPage() {
                _.set($vm.filter, 'page.index', _.toInteger(_.get($vm.filter, 'page.index')) - 1);
            }
            
            function minimumPage() {
                _.set($vm.filter, 'page.index', 0);
            }
            
            function maximumPage() {
                _.set($vm.filter, 'page.index', -1);
            }
            
            function refreshTagSet() { 
                var query = getQuery($vm.filter);
                console.log(query);
                $danApi.selectTagSetByQuery({
                    query: query,
                }).then(function (response) {
                    $vm.tagSet = response.data;
                }).catch(function (error) {
                    console.warn(error);
                    // TODO; notify user
                });
            }
            
            function getQuery(filter) {
                var whereSet = [];
                
                var name = _.get(filter, 'name');
                if (name) {
                    whereSet.push($qb.where.contains('Name', $qb.as.string(name)));
                }
                
                var description = _.get(filter, 'description');
                if (description) {
                    whereSet.push($qb.where.contains('Description', $qb.as.string(description)));
                }
                
                var locationId = _.get(filter, 'location.Id');
                if (locationId) {
                    whereSet.push($qb.where.equalTo('LocationId', $qb.as.int64(locationId)));
                }
                
                var area = _.get(filter, 'area');
                if (area) {
                    whereSet.push($qb.where.contains('Area', $qb.as.string(area)));
                }
                
                var tagSourceId = _.get(filter, 'tagSource.Id');
                if (tagSourceId) {
                    whereSet.push($qb.where.equalTo('TagSourceId', $qb.as.int64(tagSourceId)));
                }
                
                var tagTypeId = _.get(filter, 'tagType.Id');
                if (tagTypeId) {
                    whereSet.push($qb.where.equalTo('TagTypeId', $qb.as.int64(tagTypeId)));
                }
                
                var pageIndex = _.get(filter, 'page.index', 0);
                return {
                    Where: $qb.where.all(whereSet),
                    Limit: $qb.limit.page(pageIndex, 15),
                };
            }
            
        }
        
    });
    
    angular.module('app.core').directive('arcTableTagSource', function ($timeout) {
        
        return {
            restrict: 'E',
            scope: {},
            controllerAs: '$vm',
            bindToController: true,
            controller: controller,
            templateUrl: 'app/core/arc/arc-data-table/arc-table-tag-source.html'
        };
        
        function controller($scope, $danApi, $qb) {
            var $vm = _.merge(this, {
                filter: {},
                tagSourceSet: [],
                minimumPage: minimumPage,
                maximumPage: maximumPage,
                incrementPage: incrementPage,
                decrementPage: decrementPage,
            });
            
            $scope.moment = moment;
            
            var throttledRefreshTagSourceSet = _.throttle(refreshTagSourceSet, 500);
            
            $scope.$watch('$vm.filter', throttledRefreshTagSourceSet, true);
            
            function incrementPage() {
                _.set($vm.filter, 'page.index', _.toInteger(_.get($vm.filter, 'page.index')) + 1);
            }
            
            function decrementPage() {
                _.set($vm.filter, 'page.index', _.toInteger(_.get($vm.filter, 'page.index')) - 1);
            }
            
            function minimumPage() {
                _.set($vm.filter, 'page.index', 0);
            }
            
            function maximumPage() {
                _.set($vm.filter, 'page.index', -1);
            }
            
            function refreshTagSourceSet() { 
                var query = getQuery($vm.filter);
                console.log(query);
                $danApi.selectTagSourceSetByQuery({
                    query: query,
                }).then(function (response) {
                    $vm.tagSourceSet = response.data;
                }).catch(function (error) {
                    console.warn(error);
                    // TODO; notify user
                });
            }
            
            function getQuery(filter) {
                var whereSet = [];
                
                var name = _.get(filter, 'name');
                if (name) {
                    whereSet.push($qb.where.contains('Name', $qb.as.string(name)));
                }
                
                var description = _.get(filter, 'description');
                if (description) {
                    whereSet.push($qb.where.contains('Description', $qb.as.string(description)));
                }
                
                var locationId = _.get(filter, 'location.Id');
                if (locationId) {
                    whereSet.push($qb.where.equalTo('LocationId', $qb.as.int64(locationId)));
                }
                
                var lastRun = _.get(filter, 'lastRun');
                if (lastRun) {
                    whereSet.push($qb.where.greaterThanEqualTo('LastRun', $qb.as.dateTime(lastRun)));
                }
                
                var lastData = _.get(filter, 'lastData');
                if (lastData) {
                    whereSet.push($qb.where.greaterThanEqualTo('LastData', $qb.as.dateTime(lastData)));
                }
                
                var pageIndex = _.get(filter, 'page.index', 0);
                return {
                    Where: $qb.where.all(whereSet),
                    Limit: $qb.limit.page(pageIndex, 15),
                };
            }
            
        }
        
    });
    
    angular.module('app.core').directive('arcTableReport', function ($timeout) {
        
        return {
            restrict: 'E',
            scope: {},
            controllerAs: '$vm',
            bindToController: true,
            controller: controller,
            templateUrl: 'app/core/arc/arc-data-table/arc-table-report.html'
        };
        
        function controller($scope, $danApi, $qb) {
            var $vm = _.merge(this, {
                filter: {},
                reportSet: [],
                minimumPage: minimumPage,
                maximumPage: maximumPage,
                incrementPage: incrementPage,
                decrementPage: decrementPage,
            });
            
            $scope.moment = moment;
            
            var throttledRefreshReportSet = _.throttle(refreshReportSet, 500);
            
            $scope.$watch('$vm.filter', throttledRefreshReportSet, true);
            
            function incrementPage() {
                _.set($vm.filter, 'page.index', _.toInteger(_.get($vm.filter, 'page.index')) + 1);
            }
            
            function decrementPage() {
                _.set($vm.filter, 'page.index', _.toInteger(_.get($vm.filter, 'page.index')) - 1);
            }
            
            function minimumPage() {
                _.set($vm.filter, 'page.index', 0);
            }
            
            function maximumPage() {
                _.set($vm.filter, 'page.index', -1);
            }            
            
            function refreshReportSet() { 
                var query = getQuery($vm.filter);
                console.log(query);
                $danApi.selectReportSetByQuery({
                    query: query,
                }).then(function (response) {
                    $vm.reportSet = response.data;
                }).catch(function (error) {
                    console.warn(error);
                    // TODO; notify user
                });
            }
            
            function getQuery(filter) {
                var whereSet = [];
                
                var name = _.get(filter, 'name');
                if (name) {
                    whereSet.push($qb.where.contains('Name', $qb.as.string(name)));
                }
                
                var description = _.get(filter, 'description');
                if (description) {
                    whereSet.push($qb.where.contains('Description', $qb.as.string(description)));
                }
                
                var locationId = _.get(filter, 'location.Id');
                if (locationId) {
                    whereSet.push($qb.where.equalTo('LocationId', $qb.as.int64(locationId)));
                }
                
                var owner = _.get(filter, 'owner');
                if (owner) {
                    whereSet.push($qb.where.contains('Owner', $qb.as.string(owner)));
                }
                
                var pageIndex = _.get(filter, 'page.index', 0);
                return {
                    Where: $qb.where.all(whereSet),
                    Limit: $qb.limit.page(pageIndex, 15),
                };
            }
            
        }
        
    });
    
})();
