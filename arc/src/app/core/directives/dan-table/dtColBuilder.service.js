(function () {
    function dtColBuilder() {
        var dtCol = {};

        this.clear = function () {
            dtCol = {
                key: 'key',
                name: 'name',
                width: 'auto',
                style: {},
                format: function (value) {
                    return value;
                },
                reader: function (row) {
                    return row[dtCol.name];
                },
                isSortable: true,
            };
            return this;
        };

        this.setReader = function (reader) {
            if (!!reader) {
                dtCol.reader = reader;
            }
            return this;
        }

        this.setKey = function (key) {
            if (!!key) {
                dtCol.key = key;
            }
            return this;
        };

        this.setIsSortable = function (isSortable) {
            dtCol.isSortable = !!isSortable;
            return this;
        }

        this.setName = function (name) {
            if (!!name) {
                dtCol.name = name;
            }
            return this;
        };

        this.setWidth = function (width) {
            if (!!width) {
                dtCol.width = width;
            }
            return this;
        };

        this.setFormat = function (format) {
            if (!!format) {
                dtCol.format = format;
            }
            return this;
        };

        this.getDtCol = function () {
            return angular.copy(dtCol);
        };

        this.clear();
    }

    function dtColBuilderFactory() {
        return new dtColBuilder();
    }

    angular.module('app.core').factory('dtColBuilder', dtColBuilderFactory);
})();
