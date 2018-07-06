(function () {

    angular.module('app.arcReport')
        .factory('saveReportDetailsService', saveReportDetailsService);

    function saveReportDetailsService($q, msApi) {

        var vm = this;
        var service = {
            saveReportDetails: saveReportDetails
        }

        function saveReportDetails(dataForUpdate) {

            var deferred = $q.defer();

            var order = '';
            angular.forEach(dataForUpdate.ReportDataItemSet, function (value, key) {
                order = key + 1;
                value.DisplayOrder = order;
            });
            if (dataForUpdate.Id == "-1") {
                console.log('new Report');
                msApi.request('designDetailUpdate@post', dataForUpdate,
                    function (response) {
                        console.log(response);
                        deferred.resolve(response);
                    },
                    function (err) {

                        deferred.reject('Failed to save report');
                    });

                return deferred.promise;
            }
            else {
                console.log('Updating Report');
                msApi.request('designDetailUpdate@update', dataForUpdate,
                    function (response) {

                        deferred.resolve = response;
                    },
                    function (err) {

                        deferred.reject = err;
                    });

                return deferred.promise;
            }

        }

        return service;

    }
})();
