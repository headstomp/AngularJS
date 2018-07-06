(function () {
    'use strict';

    angular
        .module('app.exportexcise', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        $stateProvider
            // export
            .state('app.exportexcise', {
                url: 'gfsa://excise',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/export/views/excise/excise.html',
                        controller: 'exciseController as vm'
                    }
                },
                resolve: {
                }
            });

        msApiProvider.register('exciseData', ['/Excise',
           {
           },
           {
               get: {
                   method: 'GET',
                   params: {
                       /* Defaults if any ex. (getByDate: true) */
                   }
               }
           }
        ]);
    }
})();
