(function () {
    'use strict';

    angular
        .module('app.formslist', ['ngCookies'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.formslist', {
                url: '/formslist',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/forms/views/formlist/formlist.html',
                        controller: 'formsListController as vm'
                    }
                },
                resolve: {
                    locationSet: function (locations) {
                        return locations.getLocation();
                    }
                }
            });

        // forms
        $translatePartialLoaderProvider.addPart('app/main/forms');

        //msApiProvider.register('formsList', ['/TagSource?pageIndex=0&pageCount=500']);
    }
})();
