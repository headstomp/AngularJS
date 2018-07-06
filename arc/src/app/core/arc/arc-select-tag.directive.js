(function () {
    
    angular.module('app.core').directive('arcSelectTag', function () {
        return {
            scope: {
                tag: '=',
                whereSet: '=?',
                disabled: '<?ngDisabled',
                required: '<?ngRequired',
                format: '@?',
            },
            bindToController: true,
            replace: true,
            restrict: 'E',
            templateUrl: 'app/core/arc/arc-select-tag.html',
            controllerAs: 'vm',
            controller: function ($scope, $danApi, $qb, $interpolate) {
                
                var throttledUpdateTagSet = _.throttle(updateTagSet, 1000);
                
                var vm = _.merge(this, {
                        _: _,
                        format: '%Name',
                        tag: {},
                        tagSet: [],
                        search: '',
                        formatTag: formatTag,
                        updateTagSet: throttledUpdateTagSet,
                        disabled: false,
                        required: false,
                    });
                
                throttledUpdateTagSet();
                
                $scope.$watch('vm.tag', throttledUpdateTagSet);
                $scope.$watch('vm.search', throttledUpdateTagSet);
                $scope.$watch('vm.whereSet', throttledUpdateTagSet, true);
                
                function formatTag(tag) {
                    var expression = vm.format.replace(/%([\w\.]+)/g, function (match, name) {
                            return '{{' + name + '}}';
                        });
                    return $interpolate(expression)(tag);
                }
                
                function updateTagSet() {
                    var count = (vm.search && vm.search.length > 3) ? 1000 : 25;
                    var query = {
                        Where: getWhere(),
                        Limit: $qb.limit.page(0, count),
                    };
                     
                    $danApi.selectTagSetByQuery({
                        query: query
                    }).then(function (response) {
                        vm.tagSet = _(response.data)
                            .concat(vm.tag)
                            .filter(function (tag) {
                                return !!tag.Id;
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
                                    $qb.where.contains('Description', $qb.as.string(vm.search)),
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
