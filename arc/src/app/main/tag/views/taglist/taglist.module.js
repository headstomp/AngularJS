(function () {
    'use strict';

    angular
        .module('app.taglist', ['ngCookies'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        //state
        $stateProvider
            .state('app.taglist', {
                url: '/taglist',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/tag/views/taglist/taglist.html',
                        controller: 'taglistController as vm'
                    }
                },
                resolve: {
                    locationSet: function (locations) {
                        return locations.getLocation();
                    }
                }
            })





    }
})();
