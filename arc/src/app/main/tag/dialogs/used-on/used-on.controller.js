(function ()
{
    'use strict';

    angular
        .module('app.tagdetail')
        .controller('usedOnController', usedOnController);

    /** @ngInject */
    function usedOnController($mdDialog, Value, parentVm, event, msApi,  moment,$scope)
    {
        //console.log(parentVm);
        // console.log($scope.$parent);
        var vm = this;
        vm.title = 'Edit Value';
        vm.value = angular.copy(Value);
        vm.reportSet = {};

      
        // Methods
        vm.closeDialog = closeDialog;


        vm.dtOptions = {
            dom: 'rt<"bottom"<"left"<"length"i>><"right"<"info"><"pagination"p>>>',
            pagingType: 'simple',
            pageLength: 15,
            autoWidth: false,
            responsive: false
        };


 
        // get list of reports for tag selected
        function getReportList(id) {
            console.log('getting reports for' + id);
            msApi.request('reportlist@query', {
                id: id,
            },
            function (response) {
                vm.reportSet = response;
                console.log(response);
            },
            function (response) {
                console.log('Unable to refresh data');
                console.error(response)
            });
        };
        
        getReportList(vm.value.Id);
      

        /**
         * Close dialog
         */
        function closeDialog()
        {
            $mdDialog.hide();
        }
    }
})();
