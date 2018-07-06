(function () {
    'use strict';

    angular
    .module('app.core')
    .config(config);
    
    angular.module('app.core')
    .service('baseUrlService', function () {
        return (new function () {
            // TODO
        });
    });

    /** @ngInject */
    function config($compileProvider, $ariaProvider, $logProvider, msScrollConfigProvider, $translateProvider, fuseConfigProvider, msApiProvider, $danApiProvider) {
        // Enable debug logging
        $logProvider.debugEnabled(false);

        // Remove unsafe fuckery
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|gfsa):/);

        // angular-translate configuration
        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: 'http://tf-devsql01:8123/Gfsa.I18n.Api/Translation/{lang}/ARC/'
        });
        // setting default language to OS
        function getOsLang() {
            return navigator.language.substring(0, 2).toUpperCase();
        }
        var OsLang = getOsLang();
        //console.log(OsLang);
        $translateProvider.preferredLanguage(OsLang);
        $translateProvider.useSanitizeValueStrategy('sanitize');

        /*eslint-disable */

        // ng-aria configuration
        $ariaProvider.config({
            tabindex: false
        });

        // Fuse theme configurations
        fuseConfigProvider.config({
            'disableCustomScrollbars': false,
            'disableCustomScrollbarsOnMobile': true,
            'disableMdInkRippleOnMobile': true
        }); 

        // msScroll configuration
        msScrollConfigProvider.config({
            wheelPropagation: true
        });
        
        //
        // CHANGE THIS TO CHANGE THE API TARGET ENVIRONMENT
        // develop, release, or merging (don't use merging)
        //
        var environment = 'local';
        
        var baseUrlMap = {
            develop: 'http://tf-devsql01/Gfsa.Arc.Api',
            release: 'http://api.arc.greenfieldethanol.com',
            merging: 'http://tf-devsql01:9515/Gfsa.Arc.Api',
            local: 'http://localhost:60181',
        };

        msApiProvider.setBaseUrl(baseUrlMap[environment]);
        $danApiProvider.setBaseUrl(baseUrlMap[environment]);
    }
})();
