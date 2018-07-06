(function ()
{
    'use strict';

    angular
        .module('app.report')
        .factory('commentService', commentService);
    /** @ngInject */
    function commentService($q, msApi)
    {
        var service = {
            data        : {},
            getComment: getComment
        };

        function getComment()
        {
            // Create a new deferred object
            var deferred = $q.defer();

            msApi.request('getComment@get', {},

                // SUCCESS
                function (response)
                {
                    // Attach the data
                    service.data = response.data;
                  //  console.log(response);

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
