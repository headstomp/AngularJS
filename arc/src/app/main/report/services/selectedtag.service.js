(function ()
{
    'use strict';

    angular
        .module('app.tag')
        .factory('SelectedTagService', SelectedTagService);

    /** @ngInject */
    /** @ngInject */
    function SelectedTagService($q, msApi)
    {
        var service = {
            data        : {},
         
        };
 
        
        return service;
    }
})();