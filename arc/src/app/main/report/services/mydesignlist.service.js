(function ()
{
    'use strict';

    angular
        .module('app.report')
        .factory('MyDesignList', MyDesignList);

    /** @ngInject */
    function MyDesignList($q, msApi)
    {
        var service = {
            data        : {}
           
          
        };

        
        

        return service;
    }
})();