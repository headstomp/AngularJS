(function ()
{
    'use strict';

    angular
        .module('app.tag')
        .factory('TagListService', TagListService);

    /** @ngInject */
    /** @ngInject */
    function TagListService($q, msApi)
    {
        var service = {
            data        : {},
            getTagList: getTagList
        };
        /**
         * Get design data from the server
         *
         * @param designId
         * @returns {*}
         */
        function getTagList(Id)
        {
          console.log(Id);
            // Create a new deferred object
            var deferred = $q.defer();

            msApi.request('tagList@query', {id: Id},

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
