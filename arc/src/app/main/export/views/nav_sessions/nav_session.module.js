(function () {
    'use strict';

    angular
        .module('app.navsessionhome', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        $stateProvider
            // export
            .state('app.navsessionhome', {
                url: '/nav-sessions/1',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/export/views/nav_sessions/nav_session.html',
                        controller: 'navsessionhomeController as vm'
                    }
                },
                resolve: {
                    user: function (userDetails) {
                        return userDetails.getUser();
                    },
                }
            });

       
    }
})();
