(function () {
    //'use strict';

    angular
        .module('app.arcReport')
        .controller('arcReportController', arcReportController)
        .service('commonService', function () {

            return new(function commonService() {
                this.reportDetails = {};
                this.hideSaveButton = true;
            });
        });
    //.controller('reportTableController', reportTableController)

    /** @ngInject */

    /** @ngInject */
    function arcReportController($state, $timeout, $stateParams, $mdDialog, $scope, DesignDetailServiceForArcReport, user, $document, saveReportDetailsService, commonService) {

        var vm = this;
        //console.log(DesignDataServiceForDemo);
        //vm.designdetail = DesignDetailServiceForArcReport;
        commonService.reportDetails = DesignDetailServiceForArcReport;
        vm.designdetail = commonService.reportDetails;
        vm.hideSaveButton = commonService.hideSaveButton;

        vm.currentState = "metaData";
        vm.changeState = changeState;
        vm.title = 'Detail';
        vm.buttonTitle = 'Tag List';
        //  console.log($stateParams);
        //  console.log($state);
        if ($stateParams.id == '-1') {
            vm.contentView = 'details';
        }
        else {
            if ($state.current.name == 'app.arcReport.chart') {
                vm.contentView = 'chart';
            }
            else if ($state.current.name == 'app.arcReport.liveData') {
                vm.contentView = 'live';
            }
            else if ($state.current.name == 'app.arcReport.tableData') {
            vm.contentView = 'table';
                vm.contentView = 'table';
            }
            else if ($state.current.name == 'app.arcReport.chart') {
                vm.contentView = 'chart';
            }
            else if ($state.current.name == 'app.arcReport') {
                vm.contentView = 'details';
            }


        }

        $scope.$watch(function () {
            return commonService.hideSaveButton;
        }, function (newValue, oldValue) {
            //  console.log('changing the hide save button');
            commonService.hideSaveButton = newValue;
            vm.hideSaveButton = commonService.hideSaveButton;
            //  console.log('commonService.hideSaveButton new', newValue);
        });

        vm.openDupeDialog = openDupeDialog;
        vm.username = user.Username;
        vm.isAdmin = user.IsAdmin;
        //  console.log('vm.isAdmin', vm.isAdmin)
        //  console.log('vm.isAdmin', vm.designdetail)
        vm.putReportDetails = putReportDetails;

        function putReportDetails() {
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
                        vm.disableSaveButton = false;
                        vm.loadingFlag = true;
                    });
                return;
            }
            else {

                //console.log('saving');
                //console.log(saveReportDetailsService.saveReportDetails());
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

                //console.log('I am saving the report');

                //console.log(newReport);

            }

        }



        function changeState() {
            //  console.log('hide save button', vm.hideSaveButton);
            if (vm.hideSaveButton) {
                var alert = $mdDialog.alert({
                    title: 'Error',
                    textContent: 'Your report was not saved! Please make sure you provided all the required details; including a name and description.',
                    ok: 'Close',
                });
                $mdDialog.show(alert)
                    .finally(function () {
                        delete alert;
                        vm.disableSaveButton = false;
                        vm.loadingFlag = true;
                    });
                return;
            }
            else if (vm.currentState == 'metaData') {
                vm.currentState = 'reportTagList';
                vm.title = "Tag List";
                vm.buttonTitle = 'Details';
                //return vm.currentState;
            }
            else if (vm.currentState == 'reportTagList') {
                vm.currentState = 'metaData';
                vm.title = "Details";
                vm.buttonTitle = 'Tag List';
                //return vm.currentState;
            }
        }



        function openDupeDialog(ev, value, $scope) {
            $mdDialog.show({
                controller: 'dupeReportController',
                controllerAs: 'vm',
                templateUrl: 'app/main/report/dialogs/dupe_report.html',
                parent: angular.element($document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    Value: value,
                    User: vm.username,
                    event: ev,
                    parentVm: vm
                },
                onRemoving: function () {
                    console.log('closed dialog');
                }
            });
        }


        vm.openDupeDialog = openDupeDialog;

        function openDupeDialog(ev, value, $scope) {
            $mdDialog.show({
                controller: 'dupeReportController',
                controllerAs: 'vm',
                templateUrl: 'app/main/report/dialogs/dupe_report.html',
                parent: angular.element($document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    Value: value,
                    User: vm.username,
                    event: ev,
                    parentVm: vm
                },
                onRemoving: function () {
                    console.log('closed dialog');
                }
            });
        }
    } // controller bracket


})();
