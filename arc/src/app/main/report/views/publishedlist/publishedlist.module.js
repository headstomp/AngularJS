(function () {
    'use strict';

    angular
        .module('app.publishedlist', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        $stateProvider
            // Published
            .state('app.publishedlist', {
                url: '/publishedlist',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/report/views/publishedlist/publishedlist.html',
                        controller: 'publishedListController as vm'
                    }
                },
                resolve: {
                    user: function (userDetails) {
                        return userDetails.getUser();
                    },
                }
            })

       
    }
})();
