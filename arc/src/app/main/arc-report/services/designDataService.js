(function () {
    'use strict';

    angular
        .module('app.arcReport')
        .factory('DesignDataService', DesignDataService);

    /** @ngInject */
    function DesignDataService($q, msApi) {
        //console.log('design data service for demo');
        var service = {
            data: {},
            getDesignData: getDesignData,
            getLiveDesignData: getLiveDesignData
        };
        /**
         * Get design data from the server
         *
         * @param designId
         * @returns {*}
         */
        function getDesignData(Id, pageIndex, pageCount) {
            //  console.log('in function');
            // Create a new deferred object
            var deferred = $q.defer();

            msApi.request('designData@get', {
                    id: Id,
                    pageIndex: pageIndex || -1,
                    pageCount: pageCount || 100,
                },

                // SUCCESS
                function (response) {
                    // Attach the data
                    service.data = response.data;
                    //console.log(response);

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


        function getLiveDesignData(id) {
            var deferred = $q.defer();

            msApi.request('getLiveData@get', {
                    id: id,
                },

                // SUCCESS
                function (response) {
                    // Attach the data
                    service.data = response.data;
                    //  console.log(response);

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
