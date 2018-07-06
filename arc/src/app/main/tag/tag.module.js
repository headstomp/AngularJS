(function ()
{
    'use strict';

    angular
        .module('app.tag', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        $stateProvider

            .state('app.taghome', {
                url  : '/taghome',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/tag/tag.html',
                        controller : 'tagController as vm'
                    }
                }
            });

          
           

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/tag');

    }

})();