(function ()
{
    'use strict';

    angular
        .module('app.report')
        .factory('TagList', TagList);

    /** @ngInject */
    function TagList($q, msApi)
    {
        var service = {
            data        : {},
           
          
        };

        
        

        return service;
    }
})();