(function () {
    angular.module('app.arcReport')
        .controller('detailController', detailController);

    function detailController(DesignDetailServiceForArcReport, $scope, $timeout, $mdDialog, msApi, $document, saveReportDetailsService, commonService) {

        var vm = this;
        vm.designdetail = commonService.reportDetails;
        //console.log(commonService);
        //commonService.reportDetails = DesignDetailServiceForArcReport;
        //vm.putReportDetails = putReportDetails;
        vm.deleteTagFromReport = deleteTagFromReport;
        vm.isBucketed = vm.designdetail.IsBucketed; // Local property
        vm.makeTotalizerTagDialog = makeTotalizerTagDialog;
        vm.tagDetailflagChanged = false;
        //  console.log(vm.designdetail);
        // if (vm.designdetail.IsBucketed == true) {
        //     vm.importerType = 4;
        // }
        // if (vm.designdetail.IsBucketed == false) {
        //     vm.importerType = 1;
        // }
        //
        // if (vm.designdetail.Id == "-1") {
        //     vm.importerType = 0;
        // }
        // console.log("new report");




        // $scope.$watch('vm.designdetail', function (newValue, oldValue) {
        //     //console.log('called', newValue);
        //     $timeout(function () {
        //
        //         // DesignDetailServiceForArcReport.ReportDataItemSet = newValue;
        //         // angular.copy(DesignDetailServiceForArcReport, vm.designdetail);
        //         //vm.putReportDetails(newValue);
        //         //vm.designdetail = angular.copy(DesignDetailServiceForArcReport);
        //         //  console.log(saveReportDetailsService);
        //         //DesignDetailServiceForArcReport = saveReportDetailsService.saveReportDetails(newValue)
        //         DesignDetailServiceForArcReport = newValue;
        //         //commonService.reportDetils = newValue;
        //
        //
        //
        //     }, 1000);
        // }, true);




        function makeTotalizerTagDialog(ev, value, index) {
            console.log(value);

            if (value.MinutesPerFlowMeasurement || value.ResetTotalizerAt) {
                return true;
            }
            else {
                console.log('totalizer not true');
                var dialog = $mdDialog.show({
                    controller: 'editTagController',
                    controllerAs: 'vm',
                    templateUrl: 'app/main/dialogs/edit-tag/edit-tag-dialog.html',
                    parent: angular.element($document.body),
                    targetEvent: ev,
                    clickOutsideToClose: false,
                    locals: {
                        Value: value,
                        event: ev,
                        parentVm: vm
                    },

                });

                dialog.then(function (result) {
                    if (vm.tagDetailflagChanged) {
                        vm.tagDetailflagChanged = false;
                        if (result.ResetTotalizerAt || result.MinutesPerFlowMeasurement) {
                            result.IsTotalizer = true;
                            vm.designdetail.ReportDataItemSet[index].ShowTotalizer = result.IsTotalizer;
                            vm.designdetail.ReportDataItemSet[index].Tag = result;
                            //console.log(vm.designdetail.ReportDataItemSet[index]);
                        }
                    }
                    else {
                        vm.designdetail.ReportDataItemSet[index].ShowTotalizer = false;
                    }


                    // console.log(result);
                    // result.IsTotalizer = result.ResetTotalizerAt || result.MinutesPerFlowMeasurement;
                    // vm.designdetail.ReportDataItemSet[index].ShowTotalizer = result.IsTotalizer;
                    // vm.designdetail.ReportDataItemSet[index].Tag = result;
                    // console.log(vm.designdetail.ReportDataItemSet[index]);
                    /*
                    if (result.ResetTotalizerAt || result.MinutesPerFlowMeasurement) {
                    result.IsTotalizer = true;
                    vm.designdetail.ReportDataItemSet[index].ShowTotalizer = result.IsTotalizer;
                    }
                    else {
                    vm.designdetail.ReportDataItemSet[index].ShowTotalizer = result.IsTotalizer;
                    }
                     */
                });
            }
        }

        function deleteTagFromReport(ev, index, reportDataItem) {
            //  console.log(reportDataItem);
            var dialog = {};
            if (reportDataItem.Tag.TagTypeId == 8) {
                dialog = $mdDialog.show({
                    bindToController: true,
                    controller: 'deactivateCalculatedTag',
                    controllerAs: 'vm',
                    templateUrl: 'app/main/dialogs/deactivate-calculated-tag/deactivate-calculated-tag.html',
                    clickOutsideToClose: false,
                    escapeToClose: false,
                    locals: {
                        reportDataItem: reportDataItem,
                    },
                });
            }
            else {
                var confirm = $mdDialog.confirm({
                    title: 'Remove Tag - ' + reportDataItem.Tag.Name,
                    textContent: 'Are you sure want to remove this tag?',
                    ariaLabel: 'remove list',
                    clickOutsideToClose: false,
                    escapeToClose: false,
                    ok: 'Remove',
                    cancel: 'Cancel'
                });
                dialog = $mdDialog.show(confirm);
            }

            dialog.then(function (isRemoving) {
                if (isRemoving) {
                    vm.designdetail.ReportDataItemSet.splice(index, 1);
                    // check if there are tags on report
                    var reportDataItemSet = [];
                    angular.forEach(vm.designdetail.ReportDataItemSet || [], function (reportDataItem) {
                        this.push(reportDataItem);
                    }, reportDataItemSet);
                    if (!reportDataItemSet.length) {
                        // console.log(reportDataItemSet);
                        vm.importerType = 0;
                        vm.designdetail.BucketTypeId = 9;
                        vm.designdetail.IsBucketed = undefined;
                    };
                }
            }, function () {
                // Canceled
            });

        }


        function putReportDetails() {
            // vm.loadingFlag = false;
            //
            // if (vm.disableSaveButton) {
            //     return;
            // }
            // vm.disableSaveButton = true;
            //
            // if (!_.isEmpty(vm.DetailForm.$error)) {
            //     var alert = $mdDialog.alert({
            //         title: 'Error',
            //         textContent: 'Your report was not saved! Please make sure you provided all the required details; including a name and description.',
            //         ok: 'Close',
            //     });
            //     $mdDialog.show(alert)
            //         .finally(function () {
            //             delete alert;
            //             vm.disableSaveButton = false;
            //             vm.loadingFlag = true;
            //         });
            //     return;
            // }

            // update dsiplay order from index
            var order = '';
            angular.forEach(vm.designdetail.ReportDataItemSet, function (value, key) {
                order = key + 1;
                value.DisplayOrder = order;
                // console.log(key + ' - ' + value.DisplayOrder);
            });
            var dataForUpdate = vm.designdetail;
            // console.log("data for update", dataForUpdate);

            // check if there are tags on the report first
            // var reportDataItemSet = [];
            // angular.forEach(vm.designdetail.ReportDataItemSet || [], function (reportDataItem) {
            //     this.push(reportDataItem);
            // }, reportDataItemSet);
            // if (!reportDataItemSet.length) {
            //     dataForUpdate.IsBucketed = true;
            //     dataForUpdate.BucketTypeId = 8;
            // }

            var onFailure = function (response) {
                console.log('Unable to save');
                console.log(response);
                var message = 'Save Failed! Please contact IT Dev';
                $mdToast.show({
                    template: '<md-toast id="" layout="column" layout-align="center start"><div class="md-toast-content">' + message + '</div></md-toast>',
                    hideDelay: 3000,
                    position: 'top right',
                    parent: '#content'
                });
                $timeout(function () {
                    vm.disableSaveButton = false;
                    vm.loadingFlag = true;
                }, 3000);
            };

            // check if new report or update of old
            if (dataForUpdate.Id == "-1") {
                msApi.request('designDetailUpdate@post', dataForUpdate, function (response) {
                    var message = 'Saving New Report';
                    $mdToast.show({
                        template: '<md-toast id="" layout="column" layout-align="center start"><div class="md-toast-content">' + message + '</div></md-toast>',
                        hideDelay: 3000,
                        position: 'top right',
                        parent: '#content'
                    });
                    $timeout(function () {
                        vm.disableSaveButton = false;
                        vm.designdetail = response;
                        //refresh
                        vm.getComments();
                        var newId = response.Id;
                        $state.go('app.design', {
                            id: newId,
                            sourceId: vm.importerFilter,
                            display: vm.contenView
                        });
                        // $location.url('/design/' + newId);
                        vm.loadingFlag = true;
                    }, 3000);
                }, onFailure);
            }
            else {
                vm.loadingFlag = false;
                msApi.request('designDetailUpdate@update', dataForUpdate, function (response) {
                    var message = 'Saving Report';
                    $mdToast.show({
                        template: '<md-toast id="" layout="column" layout-align="center start"><div class="md-toast-content">' + message + '</div></md-toast>',
                        hideDelay: 3000,
                        position: 'top right',
                        parent: '#content'
                    });
                    $timeout(function () {
                        vm.disableSaveButton = false;
                        DesignDetailServiceForArcReport = response;
                        //vm.resfreshData(vm.designdetail.Id);
                    }, 3000);
                }, onFailure);
            }
        }

    }

}());
