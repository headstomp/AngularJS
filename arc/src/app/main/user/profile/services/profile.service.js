(function () {
    'use strict';
    
    angular
    .module('app.profile')
    .service('userDetails', userDetails);
    
    /** @ngInject */
    function userDetails($q, msApi) {
        var user = null;
        var service = {
            getUser: function (ignoreCache) {
                var defer = $q.defer();
                if (!!user && !ignoreCache) {
                    defer.resolve(user);
                    return defer.promise;
                }
                msApi.request('getUser@query', {}, function (response) {
                    console.log(response);
                    user = response;
                    defer.resolve(response);
                }, function (response) {
                    user = null;
                    console.log('Unable to find a user');
                    console.error(response)
                });
                return defer.promise;
            },
            updateUser: function (updatedUser) {
                user = null;
                return msApi.request('updateProfile@update', updatedUser).then(function (response) {
                    return service.getUser();
                })
                .catch (function (err) {
                    var defer = $q.defer();
                    defer.reject();
                    return defer.promise;
                });
            },
            clearCache: function () {
                user = null;
            },
        };
        return service;
    }
})();
