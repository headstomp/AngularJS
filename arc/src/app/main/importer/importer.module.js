(function () {
    'use strict';
    
    angular
    .module('app.importer', [])
    .config(config);
    
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        $stateProvider
        
        .state('app.importerhome', {
            url: '/sourcehome',
            views: {
                'content@app': {
                    templateUrl: 'app/main/importer/importer.html',
                    controller: 'importerController as vm'
                }
            }
        });
        
        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/importer');
        
    }
    
})();
