(function () {
    'use strict';
    
    angular
    .module('app.toolbar')
    /*
    .service('userDetails', userDetails)
    */
    .service('locations', locations);
    
    /** @ngInject */
    /*
    function userDetails($q, msApi) {
        var user = {};
        
        var service = {
            getUser: function () {
                var defer = $q.defer();
                msApi.request('getUser@query', {},
                    function (response) {
                    defer.resolve(response);
                },
                    function (response) {
                    console.log('Unable to find a user');
                    console.error(response)
                });
                return defer.promise;
            },
        };
        
        return service;
    };
    */
    
    function locations($q, msApi) {
        var locations = {};
        
        var service = {
            getLocation: function () {
                var defer = $q.defer();
                msApi.request('getLocation@query', {},
                    function (response) {
                    defer.resolve(response);
                },
                    function (response) {
                    console.log('Unable to find locations');
                    console.error(response)
                });
                return defer.promise;
            }
        };
        
        return service;
    }
})();
