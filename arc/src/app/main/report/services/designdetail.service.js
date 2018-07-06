(function ()
{
    'use strict';

    angular
        .module('app.report')
        .factory('DesignDetailService', DesignDetailService);

    /** @ngInject */
    function DesignDetailService($q, msApi)
    {
        var service = {
            data        : {},
            getDesignDetail: getDesignDetail  
        };
        /**
         * Get design data from the server
         *
         * @param designId
         * @returns {*}
         */
        function getDesignDetail(Id)
        {
            // Create a new deferred object
            var deferred = $q.defer();

            msApi.request('designDetail@get', {id: Id},

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