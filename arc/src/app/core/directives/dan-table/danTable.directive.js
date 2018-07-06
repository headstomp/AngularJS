(function () {
    var direction = {
        DESCENDING: 0,
        ASCENDING: 1,
        inverse: function (value) {
            if (value === direction.ASCENDING) return direction.DESCENDING;
            if (value === direction.DESCENDING) return direction.ASCENDING;
        },
    };

    function danTableDirectiveController($scope, $filter) {
        $scope.$watch('config', function (config) {
            $scope.setWhere(config.search);
        }, true);

        $scope.colSet = [].concat($scope.colSet);
        $scope.rowSet = [].concat($scope.rowSet);
        $scope.visSet = [];

        function filterWhereOrder(rowSet) {
            rowSet = [].concat(rowSet);
            if (!!$scope.where.expression) {
                rowSet = rowSet.filter($scope.where.expression);
            }
            if (!!$scope.order.expression) {
                rowSet = rowSet.sort($scope.order.expression);
            }
            return rowSet;
        }

        function updateWhereOrder() {
            $scope.visSet = filterWhereOrder($scope.rowSet);
        }

        $scope.invokeRow = function (row) {
            if ($scope.config.rowOnClick) {
                $scope.config.rowOnClick(row);
            }
        };

        $scope.where = {
            expression: null,
        };
        $scope.setWhere = function (search) {
            if (!search) {
                $scope.where.expression = null;
            }
            else {
                $scope.where.expression = function (row) {
                    for (var colIndex in $scope.colSet) {
                        var col = $scope.colSet[colIndex];
                        var value = String(row[col.key]).toLowerCase();
                        if (value.indexOf(String(search).toLowerCase()) >= 0) {
                            return true;
                        }
                    }
                    return false;
                };
            }
            updateWhereOrder();
        };

        $scope.order = {
            key: null,
            direction: null,
            expression: null,
        };
        $scope.setOrder = function (col) {
            if (!col) {
                $scope.order.key = null;
                $scope.order.direction = null;
                $scope.order.expression = null;
            }
            else {
                if ($scope.order.key === col.key) {
                    $scope.order.direction = direction.inverse($scope.order.direction);
                }
                else {
                    $scope.order.key = col.key;
                    $scope.order.direction = direction.DESCENDING;
                    $scope.order.expression = function (row1, row2) {
                        if ($scope.order.direction === direction.ASCENDING) {
                            return row1[col.key] < row2[col.key] ? 1 : -1;
                        }
                        return row1[col.key] > row2[col.key] ? 1 : -1;
                    };
                }
            }
            updateWhereOrder();
        };

        $scope.limit = {
            index: null,
            count: null,
            final: null,
        };
        $scope.setLimit = function (index, count) {
            count = Math.max(1, count);
            final = Math.floor($scope.rowSet.length / count);
            index = Math.max(0, Math.min(index, final));
            $scope.limit.index = index;
            $scope.limit.count = count;
            $scope.limit.final = final;
        };

        $scope.setWhere(null);
        $scope.setOrder($scope.colSet[0]);
        $scope.setLimit(0, 20);

        $scope.$watch('limit', function (limit) {
            $scope.setLimit(limit.index, limit.count);
        }, true);

        $scope.$watch('search', function (search) {
            $scope.setWhere(search);
        });
    }

    function danTableDirective() {
        return {
            restrict: 'E',
            templateUrl: 'app/core/directives/dan-table/views/danTable.view.html',
            scope: {
                rowSet: '=dtRowSet',
                colSet: '=dtColSet',
                config: '=?dtConfig',
            },
            controller: danTableDirectiveController,
        };
    }

    angular.module('app.core').directive('danTable', danTableDirective);
})();
