(function () {
    function dtLimitFilter() {
        return function (rowSet, limit) {
            if (limit.count < 1) {
                limit.count = 1;
            }
            limit.count = Math.max(1, limit.count);
            limit.final = Math.floor(rowSet.length / limit.count);
            limit.index = Math.min(limit.index, limit.final);
            return rowSet.slice(limit.index * limit.count, (limit.index + 1) * limit.count);
        };
    }

    angular.module('app.core').filter('dtLimit', dtLimitFilter);
})();
