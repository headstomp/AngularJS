(function () {
    'use strict';

    angular
        .module('app.tag')
        .factory('TagResultService', TagResultService);

    /** @ngInject */
    /** @ngInject */
    function TagResultService($q, msApi) {
        var service = {
            data: {},
            getTagResult: getTagResult
        };
        /**
         * Get tag data from the server
         *
         * @param tagId
         * @returns {*}
         */
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
