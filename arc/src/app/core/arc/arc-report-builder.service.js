(function () {
    
    'use strict';
    
    function Report() {
        var self = this;
        return _.merge(this, {
            report: getEmptyReport(),
            withReport: function (fn) {
                fn.apply(self);
            },
            addReportDataItem: function (reportDataItem) {
                
            },
        });
        
        function getEmptyReport() {
            return {};
        }
    }
    
    function ReportDataItem() {
        var self = this;
        return _.merge(this, {
            
            
        });
    }
    
    angular.module('app.core').provider('arcCommentService', function arcCommentServiceProvider() {
        
        this.$get = function arcCommentServiceFactory($danApi, $timeout) {
        };
    });
})();
