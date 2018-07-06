(function () {
    
    angular.module('app.core').directive('arcSelectLocation', function () {
        return {
            scope: {
                location: '=',
                whereSet: '=?',
                disabled: '<?ngDisabled',
                required: '<?ngRequired',
                format: '@?',
            },
            bindToController: true,
            replace: true,
            restrict: 'E',
            templateUrl: 'app/core/arc/arc-select-location.html',
            controllerAs: 'vm',
            controller: function ($scope, $danApi, $qb, $interpolate) {
                
                var throttledUpdateLocationSet = _.throttle(updateLocationSet, 1000)
                
                var vm = _.merge(this, {
                        _: _,
                        format: '%Name',
                        location: {},
                        locationSet: [],
                        search: '',
                        formatLocation: formatLocation,
                        updateLocationSet: throttledUpdateLocationSet,
                        disabled: false,
                        required: false,
                    });
                
                throttledUpdateLocationSet();
                
                $scope.$watch('vm.location', throttledUpdateLocationSet);
                $scope.$watch('vm.search', throttledUpdateLocationSet);
                $scope.$watch('vm.whereSet', throttledUpdateLocationSet, true);
                
                function formatLocation(location) {
                    var expression = vm.format.replace(/%([\w\.]+)/g, function (match, name) {
                            return '{{' + name + '}}';
                        });
                    return $interpolate(expression)(location);
                }
                
                function updateLocationSet() {
                    var count = (vm.search && vm.search.length > 3) ? 1000 : 25;
                    var query = {
                        Where: getWhere(),
                        Limit: $qb.limit.page(0, count),
                    };
                    $danApi.selectLocationSetByQuery({
                        query: query
                    }).then(function (response) {
                        vm.locationSet = _(response.data)
                            .concat(vm.location)
                            .filter(function (location) {
                                return !!location.Id;
                            })
                            .uniqBy('Id')
                            .value();
                    });
                }
                
                function getWhere() {
                    var whereSet = [];
                    if (vm.search) {
                        whereSet.push($qb.where.any([
                                    $qb.where.contains('Name', $qb.as.string(vm.search)),
                                ]));
                    }
                    _.forEach(vm.whereSet || [], function (where) {
                        whereSet.push(where);
                    });
                    return $qb.where.all(whereSet);
                }
            },
        };
    });
    
})();
