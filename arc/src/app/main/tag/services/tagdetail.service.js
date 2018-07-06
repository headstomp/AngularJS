(function ()
{
    'use strict';

    angular
        .module('app.tag')
        .factory('TagDetailService', TagDetailService);

    /** @ngInject */
    /** @ngInject */
    function TagDetailService($q, msApi)
    {
        var service = {
            data        : {},
            getTagDetail: getTagDetail  
        };
        /**
         * Get tag data from the server
         *
         * @param tagId
         * @returns {*}
         */
        function getTagDetail(Id)
        {
            // Create a new deferred object
            var deferred = $q.defer();

            msApi.request('tagdetail@get', {id: Id},

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