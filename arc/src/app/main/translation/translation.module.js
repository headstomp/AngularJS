(function () {
    'use strict';

    angular
        .module('app.translation', [])
        .run(function () { })
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.translation', {
                url: '/translation',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/translation/translation.html',
                        controller: 'TranslationController as vm'
                    }
                }
            });

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/translation');

        // Api
        var apiUrl = msApiProvider.getBaseUrl();
        msApiProvider.setBaseUrl('http://tf-devsql01:8123/Gfsa.I18n.Api');
        msApiProvider.register('translationSet', ['/Translation', {}, {
            get: {
                method: 'GET',
                isArray: true,
                params: {
                    applicationKey: 'ARC'
                }
            },
            update: {
                method: 'PUT',
            },
            create: {
                method: 'POST',
            },
        }]);
        msApiProvider.register('emptyTranslation', ['/Translation/Empty', {}, {
            get: {
                method: 'GET',
            },
        }]);
        msApiProvider.setBaseUrl(apiUrl);
    }
})();
