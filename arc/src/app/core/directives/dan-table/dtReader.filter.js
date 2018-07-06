(function () {
    function dtReaderFilter() {
        return function (row, col) {
            if (col.reader) {
                return col.reader(row, col);
            }
            return row;
        };
    }

    angular.module('app.core').filter('dtReader', dtReaderFilter);
})();
