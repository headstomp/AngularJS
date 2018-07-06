(function () {
    'use strict';

    angular
        .module('fuse')
        .config(config);

    /** @ngInject */
    function config($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
    }
})();
