(function ()
{
    'use strict';

    angular
        .module('app.forms', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        $stateProvider

            .state('app.formshome', {
                url  : '/formshome',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/forms/form.html',
                        controller : 'formsController as vm'
                    }
                }
            });

          
           

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/forms');

    }

})();