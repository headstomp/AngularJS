(function ()
{
    'use strict';

    angular
        .module('app.tag')
        .factory('tagList', tagList);

    /** @ngInject */
    function tagList($q, msApi)
    {
        var service = {
            data        : {},
           
          
        };

        
        

        return service;
    }
})();