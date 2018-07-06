(function () {
    angular.module('app.demoTable')
        .factory('tagDataService', tagDataService);

    function tagDataService($q, msApi) {

        var service = {
            //data        : {},
            getTagResult: getTagResult
        };


        function getTagResult(Id) {
            // Create a new deferred object
            var deferred = $q.defer();

            msApi.request('tagresult@get', {
                    id: Id
                },

                // SUCCESS
                function (response) {
                    // Attach the data
                    service.data = response.data;

                    // Resolve the promise
                    deferred.resolve(response);
                },

                // ERROR
                function (response) {
                    // Reject the promise
                    deferred.reject(response);
                }
            );

            return deferred.promise;
        };

        return service;
    }
})();
