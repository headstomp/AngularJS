(function () {
    
    angular.module('app.core').directive('arcSelectTagType', function () {
        return {
            scope: {
                tagType: '=',
                whereSet: '=?',
                disabled: '<?ngDisabled',
                required: '<?ngRequired',
                format: '@?',
            },
            bindToController: true,
            replace: true,
            restrict: 'E',
            templateUrl: 'app/core/arc/arc-select-tag-type.html',
            controllerAs: 'vm',
            controller: function ($scope, $danApi, $qb, $interpolate) {
                
                var throttledUpdateTagTypeSet = _.throttle(updateTagTypeSet, 1000);
                
                var vm = _.merge(this, {
                        _: _,
                        format: '%Name',
                        tagType: {},
                        tagTypeSet: [],
                        search: '',
                        formatTagType: formatTagType,
                        updateTagTypeSet: throttledUpdateTagTypeSet,
                        disabled: false,
                        required: false,
                    });
                
                throttledUpdateTagTypeSet();
                
                $scope.$watch('vm.tagType', throttledUpdateTagTypeSet);
                $scope.$watch('vm.search', throttledUpdateTagTypeSet);
                $scope.$watch('vm.whereSet', throttledUpdateTagTypeSet, true);
                
                function formatTagType(tagType) {
                    var expression = vm.format.replace(/%([\w\.]+)/g, function (match, name) {
                            return '{{' + name + '}}';
                        });
                    return $interpolate(expression)(tagType);
                }
                
                function updateTagTypeSet() {
                    var count = (vm.search && vm.search.length > 3) ? 1000 : 25;
                    var query = {
                        Where: getWhere(),
                        Limit: $qb.limit.page(0, count),
                    };
                    $danApi.selectTagTypeSetByQuery({
                        query: query
                    }).then(function (response) {
                        vm.tagTypeSet = _(response.data)
                            .concat(vm.tagType)
                            .filter(function (tagType) {
                                return !!tagType.Id;
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
