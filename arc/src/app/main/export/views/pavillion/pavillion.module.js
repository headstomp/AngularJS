(function () {
    'use strict';
    
    angular
    .module('app.pavillion', [])
    .config(config);
    
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        $stateProvider
        // export
        .state('app.pavillionhome', {
            url: '/pavillionhome',
            views: {
                'content@app': {
                    templateUrl: 'app/main/export/views/pavillion/pavillion.html',
                    controller: 'pavillionController as vm'
                }
            },
            resolve: {}
        });
        
        msApiProvider.register('pavillionData', ['/Pavillion', {}, {
                    get: {
                        method: 'GET',
                        isArray: true,
                        params: {
                            /* Defaults if any ex. (getByDate: true) */
                        }
                    }
                }
            ]);
    }
})();
