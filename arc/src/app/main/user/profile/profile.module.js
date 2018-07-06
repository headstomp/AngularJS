(function () {
    'use strict';

    angular
        .module('app.profile', ['pascalprecht.translate', 'ngCookies', 'app.toolbar'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider, $translatePartialLoaderProvider, $translateProvider) {
        $stateProvider

            // Home
            .state('app.profilehome', {
                url: '/profilehome',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/user/profile/profile.html',
                        controller: 'profileController as vm'
                    }
                },
            });


        // Translation
        //  $translatePartialLoaderProvider.addPart('app/main/report');
        msApiProvider.register('updateProfile', ['/User', {}, {
            update: {
                method: 'PUT',
            }
        }]);

        msApiProvider.register('getComment', ['/Comment',
            {},
            {
                get: {
                    method: 'GET',
                    isArray: true,
                },

                getQuery: {
                    method: 'GET',
                    params: {

                    }

                }
            }
        ]);

        msApiProvider.register('reportlist', ['/Report/Tag/:id',
            {
                id: '@Id',
            },

        ]);



    }

})();
