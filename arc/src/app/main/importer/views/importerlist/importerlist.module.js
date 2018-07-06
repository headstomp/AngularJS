(function () {
    'use strict';

    angular
        .module('app.importerlist', ['ngCookies'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.importerlist', {
                url: '/sourcelist',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/importer/views/importerlist/importerlist.html',
                        controller: 'ImporterListController as vm'
                    }
                },
                resolve: {
                    locationSet: function (locations) {
                        return locations.getLocation();
                    }
                }
            });

        // importer
        $translatePartialLoaderProvider.addPart('app/main/importer');

        //msApiProvider.register('importerList', ['/TagSource?pageIndex=0&pageCount=500']);
    }
})();
