(function ()
{
    'use strict';

    angular
        .module('app.tag')
        .factory('ImporterDetailService', ImporterDetailService);

    /** @ngInject */
    /** @ngInject */
    function ImporterDetailService($q, msApi)
    {
        var service = {
            data        : {},
            getImporterDetail: getImporterDetail  
        };
        /**
         * Get design data from the server
         *
         * @param designId
         * @returns {*}
         */
        function getImporterDetail(Id)
        {
            // Create a new deferred object
            var deferred = $q.defer();

            msApi.request('importerDetail@get', {id: Id},

                // SUCCESS
                function (response)
                {
                    // Attach the data
                    service.data = response.data;

                    // Resolve the promise
                    deferred.resolve(response);
                },

                // ERROR
                function (response)
                {
                    // Reject the promise
                    deferred.reject(response);
                }
            );

            return deferred.promise;
        };
        
        

        return service;
    }
})();