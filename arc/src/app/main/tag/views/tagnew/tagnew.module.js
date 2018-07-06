(function ()
{
    'use strict';

    angular
        .module('app.tagnew', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        //state
        $stateProvider
            .state('app.tagnew', {
                url    : '/tagnew',
                views  : {
                    'content@app'  : {
                        templateUrl: 'app/main/tag/views/tagnew/tagnew.html',
                        controller : 'tagnewController as vm'
                    }
                },                    
            })

        // Api

        
    }

})();