(function ()
{
    'use strict';

    angular
        .module('app.report')
        .factory('PublishedList', PublishedList);

    /** @ngInject */
    function PublishedList($q, msApi)
    {
        var service = {
            data        : {}
           
          
        };

        
        

        return service;
    }
})();