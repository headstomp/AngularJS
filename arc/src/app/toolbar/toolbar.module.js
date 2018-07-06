(function () {
    'use strict';

    angular
        .module('app.toolbar', ['ngCookies'])
        .config(config);

    /** @ngInject */
    function config(msApiProvider, $translatePartialLoaderProvider) {
        $translatePartialLoaderProvider.addPart('app/toolbar');
    }
})();
