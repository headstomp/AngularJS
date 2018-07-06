(function () {
    'use strict';

    angular
        .module('app.translation')
        .service('langDetails', langDetails);

    /** @ngInject */
    function langDetails($q, msApi) {
        var translation = {};

        var service = {
            getTranslation: function () {
                var defer = $q.defer();
                msApi.request('getTranslations@query', {},
                    function (response) {
                        defer.resolve(response);
                    },
                    function (response) {
                        console.log('Unable to find translation');
                        console.error(response)
                    });
                msApi.setBaseUrl('http://tf-devsql01/Gfsa.Arc.Api');
                return defer.promise;
            },

            updateTranslations: function () {
                var defer = $q.defer();
                msApi.request('updateTranslations@update', [],
                    function (response) {
                        defer.resolve(response);
                    },
                    function (response) {
                        console.log('Unable to find update translation');
                        console.error(response)
                    });
                msApi.setBaseUrl('http://tf-devsql01/Gfsa.Arc.Api');
                return defer.promise;
            }


        };

        return service;
    }
})();
