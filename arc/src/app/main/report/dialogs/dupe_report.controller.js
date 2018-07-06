(function () {
    'use strict';

    angular
        .module('app.design')
        .controller('dupeReportController', dupeReportController);

    /** @ngInject */
    function dupeReportController($mdDialog, Value, User, event, msApi, $location) {
        var vm = this;

        // Data
        vm.username = User;
        vm.detail = angular.copy(Value);
        vm.values = {
            "Id": vm.detail.Id,
            "LocationId": vm.detail.LocationId,
            "LongDescription": vm.detail.LongDescription,
            "Name": vm.detail.Name,
            "Owner": vm.username,
            "ShortDescription": vm.detail.ShortDescription
        }


        // Methods
        vm.closeDialog = closeDialog;
        vm.dupeMe = dupeMe;
        vm.gotoDupedReport = gotoDupedReport;



        // duplicate report
        function dupeMe(dataForDupe) {
            console.log(dataForDupe);
            msApi.request('dupeReport@post', dataForDupe,

                // SUCCESS
                function (response) {
                    vm.newId = response.Id;
                    //console.log(vm.newId);
                    vm.gotoDupedReport(vm.newId)
                },
                // ERROR
                function (response) {
                    console.log('Unable to update Details');
                    console.error(response);
                }
            );
            vm.closeDialog();
        };


        function closeDialog() {
            $mdDialog.hide();
        };

        function gotoDupedReport(newId) {
            //console.log("new report id is:" + newId);
            $location.url('/arcReport/' + newId + '/table/' + newId);

        }

    }
})();
