(function () {

    angular.module('app.core')
        .directive('arcSelectTagSource', function () {
            return {
                scope: {
                    tagSource: '=',
                    whereSet: '=?',
                    disabled: '<?ngDisabled',
                    required: '<?ngRequired',
                    format: '@?',
                },
                bindToController: true,
                replace: true,
                restrict: 'E',
                templateUrl: 'app/core/arc/arc-select-tag-source.html',
                controllerAs: 'vm',
                controller: function ($scope, $danApi, $qb, $interpolate) {
                    
                    var throttledUpdateTagSourceSet = _.throttle(updateTagSourceSet, 1000);
                    
                    var vm = _.merge(this, {
                        _: _,
                        format: '%Name',
                        tagSource: {},
                        tagSourceSet: [],
                        search: undefined,
                        formatTagSource: formatTagSource,
                        updateTagSourceSet: throttledUpdateTagSourceSet,
                        disabled: false,
                        required: false,
                        dataLocationId: 0,
                    });

                    throttledUpdateTagSourceSet();

                    $scope.$watch('vm.tagSource', throttledUpdateTagSourceSet);
                    $scope.$watch('vm.search', throttledUpdateTagSourceSet);
                    $scope.$watch('vm.dataLocationId', function () {
                        if (typeof (vm.dataLocationId) === 'string') {
                            vm.dataLocationId = parseInt(vm.dataLocationId);
                        }
                        throttledUpdateTagSourceSet();
                    });
                    $scope.$watch('vm.whereSet', throttledUpdateTagSourceSet, true);

                    function formatTagSource(tagSource) {
                        //console.log(tagSource);
                        var expression = vm.format.replace(/%([\w\.]+)/g, function (match, name) {

                            return '{{' + name + '}}';
                        });
                        return $interpolate(expression)(tagSource);
                    }

                    function updateTagSourceSet() {
                        var count = (vm.search && vm.search.length > 3) ? 1000 : 50;
                        var query = {
                            Where: getWhere(),
                            Limit: $qb.limit.page(0, count),
                        };
                        $danApi.selectTagSourceSetByQuery({
                                query: query
                            })
                            .then(function (response) {
                                vm.tagSourceSet = _(response.data)
                                    .concat(vm.tagSource)
                                    .filter(function (tagSource) {
                                return !!_.get(tagSource, 'Id');
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
                                $qb.where.contains('DisplayName', $qb.as.string(vm.search)),
                                $qb.where.contains('Description', $qb.as.string(vm.search)),
                            ]));
                        }
                        if (vm.dataLocationId > 0) {
                            whereSet.push($qb.where.equalTo('DataLocationId', $qb.as.int64(vm.dataLocationId)));
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
