(function () {
    
    angular.module('app.core').directive('arcSelectReport', function () {
        return {
            scope: {
                report: '=',
                whereSet: '=?',
                disabled: '<?ngDisabled',
                required: '<?ngRequired',
                format: '@?',
            },
            bindToController: true,
            replace: true,
            restrict: 'E',
            templateUrl: 'app/core/arc/arc-select-report.html',
            controllerAs: 'vm',
            controller: function ($scope, $danApi, $qb, $interpolate) {
                
                var throttledUpdateReportSet = _.throttle(updateReportSet, 1000);
                
                var vm = _.merge(this, {
                        _: _,
                        format: '%Name',
                        report: {},
                        reportSet: [],
                        search: '',
                        formatReport: formatReport,
                        updateReportSet: throttledUpdateReportSet,
                        disabled: false,
                        required: false,
                    });
                
                throttledUpdateReportSet();
                
                $scope.$watch('vm.report', throttledUpdateReportSet);
                $scope.$watch('vm.search', throttledUpdateReportSet);
                $scope.$watch('vm.whereSet', throttledUpdateReportSet, true);
                
                function formatReport(report) {
                    var expression = vm.format.replace(/%([\w\.]+)/g, function (match, name) {
                            return '{{' + name + '}}';
                        });
                    return $interpolate(expression)(report);
                }
                
                function updateReportSet() {
                    var count = (vm.search && vm.search.length > 3) ? 1000 : 25;
                    var query = {
                        Where: getWhere(),
                        Limit: $qb.limit.page(0, count),
                    };
                    $danApi.selectReportSetByQuery({
                        query: query
                    }).then(function (response) {
                        vm.reportSet = _(response.data)
                            .concat(vm.report)
                            .filter(function (report) {
                                return !!report.Id;
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
