(function () {
    //'use strict';

    angular
        .module('app.arcReport')
        .controller('headerController', headerController);

    /** @ngInject */

    /** @ngInject */
    function headerController(DesignDetailServiceForArcReport, $timeout, $mdDialog, user, $scope, locations, saveReportDetailsService, commonService) {

        var vm = this;
        vm.designdetail = commonService.reportDetails;
        vm.hideSaveButton = commonService.hideSaveButton;
        vm.username = user.Username;
        vm.isAdmin = user.IsAdmin;
        vm.putReportDetails = putReportDetails;
        vm.formValid = false;

        //console.log(vm.DetailForm);
        $scope.$watch('vm.DetailForm.$invalid', function (newValue, oldValue) {
            if (newValue) {
                commonService.hideSaveButton = true;
                vm.hideSaveButton = commonService.hideSaveButton;
                console.log('invalid');
            }
            else {
                console.log('valid');
                commonService.hideSaveButton = false;
                vm.hideSaveButton = commonService.hideSaveButton;
            }

        }, true)

        function putReportDetails(DetailForm) {
            //console.log(DetailForm);
            if (vm.hideSaveButton) {
                console.log('not saving please fill report');
                var alert = $mdDialog.alert({
                    title: 'Error',
                    textContent: 'Your report was not saved! Please make sure you provided all the required details; including a name and description.',
                    ok: 'Close',
                });
                $mdDialog.show(alert)
                    .finally(function () {
                        delete alert;
                        //vm.disableSaveButton = false;
                        //vm.loadingFlag = true;
                    });
                return;
                console.log('Please Provide details');
                return
            }
            else {
                saveReportDetailsService.saveReportDetails(commonService.reportDetails)
                    .then(function (result) {
                        //console.log(result);
                        $timeout(function () {
                            $state.go('app.arcReport.tableData', {
                                id: result.Id
                            });
                            commonService.hideSaveButton = false;
                        }, 1500);
                    });
            }
        }

        //  console.log('vm.isAdmin', vm.isAdmin)
        //  console.log('vm.isAdmin', vm.designdetail)
        getLocation();
        // get locations
        function getLocation() {
            locations.getLocation()
                .then(function (locations) {
                    vm.locationSet = locations;
                });
        };


    }
})();
