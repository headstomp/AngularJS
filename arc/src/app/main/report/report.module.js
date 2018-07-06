(function ()
{
    'use strict';

    angular
        .module('app.report', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        $stateProvider

            // Home
            .state('app.reporthome', {
                url  : '/reporthome',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/report/report.html',
                        controller : 'reportController as vm'
                    }
                }
            });


        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/report');
        //update tag reduced data
        


    }

})();
