(function ()
{
    'use strict';

    angular
        .module('app.export', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        $stateProvider
          
            // Home
            .state('app.exporthome', {
                url  : '/exporthome',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/export/export.html',
                        controller : 'exportController as vm'
                    }
                }
            });
  

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/export');

   
    }

})();