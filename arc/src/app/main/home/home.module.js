(function () {
    'use strict';
    
    angular
    .module('app.home', [])
    .config(config);
    
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
        .state('app.home', {
            url: '/home',
            views: {
                'content@app': {
                    templateUrl: 'app/main/home/home.html',
                    controller: 'HomeController as vm'
                }
            }
        });
        
        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/home');
        
        // Api
        
        //msApiProvider.register('importerList', ['/TagSource?pageIndex=0&pageCount=500']);
        
        msApiProvider.register('importerValueCount', ['/TagSource/ValueCount', {}, {
                    query: {
                        method: 'get',
                        params: {
                            /* Defaults if any ex. (getByDate: true) */
                        }
                    }
                }
            ]);
        msApiProvider.register('diagnostics', ['/Diagnostics/Ncpa', {}, {
                    query: {
                        method: 'POST',
                        params: {}
                    }
                }
            ]);
        
    }
})();
