(function () {
    'use strict';


    angular
        .module('app.formsdetail')
        .controller('formsopenerController', formsopenerController);

    /** @ngInject */
    function formsopenerController($document, $window) {
        $window.location.href = 'gfsa://arcforms?application_id=70&form_tab_id=3';
    }
})();
