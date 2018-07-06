(function () {
    'use strict';

    angular
        .module('app.arcReport')
        .factory('DesignDetailService', DesignDetailService);

    /** @ngInject */
    function DesignDetailService($q, msApi) {

        console.log('function called in service for demo');
        var service = {
            data: {},
            getDesignDetail: getDesignDetail
        };
        /**
         * Get design data from the server
         *
         * @param designId
         * @returns {*}
         */
        function getDesignDetail(Id) {
            // Create a new deferred object
            var deferred = $q.defer();

            msApi.request('designDetail@get', {
                    id: Id
                },

                // SUCCESS
                function (response) {
                    // Attach the data
                    //console.log(response);
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
