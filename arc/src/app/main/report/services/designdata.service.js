(function ()
{
    'use strict';

    angular
        .module('app.report')
        .factory('DesignDataService', DesignDataService);

    /** @ngInject */
    function DesignDataService($q, msApi)
    {
        var service = {
            data        : {},
            getDesignData: getDesignData  
        };
        /**
         * Get design data from the server
         *
         * @param designId
         * @returns {*}
         */
        function getDesignData(Id, pageIndex, pageCount)
        {
            // Create a new deferred object
            var deferred = $q.defer();

            msApi.request('designData@get', {
                id: Id,
                pageIndex: pageIndex || -1,
                pageCount: pageCount || 100,
            },

                // SUCCESS
                function (response)
                {
                    // Attach the data
                    service.data = response.data;
                    //console.log(response);

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