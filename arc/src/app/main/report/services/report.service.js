(function ()
{
    'use strict';

    angular
        .module('app.report')
        .factory('ReportService', ReportService);

    /** @ngInject */
    function ReportService($q, msApi)
    {
        var service = {
            data        : {},
           
          
        };

        
        

        return service;
    }
})();