(function () {
    'use strict';

    angular
        .module('app.designlist', ['ngCookies'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        //state
        $stateProvider
            .state('app.designlist', {
                url: '/designlist',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/report/views/designlist/designlist.html',
                        controller: 'designlistController as vm'
                    }
                },
                resolve: {
                    user: function (userDetails) {
                        return userDetails.getUser();
                    },
                    locationSetForDT: function (locations) {
                        return locations.getLocation();
                    }
                }
            })



        // update report details
        msApiProvider.register('designDetailDelete', ['/Report/:id',
            {
                id: '@Id',
            },
            {
                del: {
                    method: 'DELETE',
                    params: {
                        /* Defaults if any ex. (getByDate: true) */
                    }
                }
            }
        ]);
    }
})();
