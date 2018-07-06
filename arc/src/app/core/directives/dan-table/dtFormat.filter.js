(function () {
    function dtFormatFilter() {
        return function (value, col, row) {
            if (col.format) {
                return col.format(value, col, row);
            }
            return value;
        };
    }

    angular.module('app.core').filter('dtFormat', dtFormatFilter);
})();
