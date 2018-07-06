(function () {
    
    /** @ngInject */
    angular.module('app.core').provider('thriftApi', function thriftApiProvider() {
        return _.merge(this, {
            $get: function thriftApiFactory($http, $interpolate) {
                
                return _.merge(this, {
                    resolveReportResultsByReport: resolveReportResultsByReport,
                    resolveReportResultsByReportId: resolveReportResultsByReportId,
                });
                    
                function resolveReportResultsByReport(report) {
                    return $http.post('http://localhost:60181/ReportResult/Thrift', report, {
                        // TODO;
                    }).then(function (response) {
                        return response.data;
                    });
                }
                
                function resolveReportResultsByReportId(reportId) {
                    var url = $interpolate('http://localhost:60181/ReportResult/Thrift/{{reportId}}')({
                        reportId: reportId,
                        
                    });
                    return $http.get(url, {
                        // TODO;
                    }).then(function (response) {
                        return response.data;
                    });
                }
                
            },
        });
    });
    
})();