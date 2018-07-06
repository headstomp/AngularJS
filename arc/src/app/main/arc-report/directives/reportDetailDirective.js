(function () {
    angular.module('app.arcReport')
        .directive('reportDetailDirective', function (saveReportDetailsService) {
            return {
                restrict: 'E',
                scope: {
                    designdetail: '<',
                },
                bindToController: true,

                controller: reportDetailDirectiveController,
                controllerAs: 'vm',
                templateUrl: 'app/main/arc-report/directives/reportDetails.html'

            }
        });

    function reportDetailDirectiveController($mdDialog, $document, commonService, $scope, $timeout) {
        console.log(' i am in directive');
        var vm = this
        if (vm.designdetail.Id == -1) {
            vm.importerType = undefined;

        }
        else {
            if (vm.designdetail.IsBucketed == true) {
                console.log('i am change the bucket');
                vm.importerType = 4;
                //vm.designdetail.BucketTypeId = 8;
                vm.isBucketed = vm.designdetail.IsBucketed;
            }
            else if (vm.designdetail.IsBucketed == false) {
                vm.importerType = 1;
                vm.isBucketed = vm.designdetail.IsBucketed;
            }
        }

        //  console.log('i am in directive', vm.designdetail);
        //  vm.designdetail = commonService.reportDetails;
        // if (vm.designdetail.Id == "-1") {
        //     vm.importerType = 0;
        //     // console.log("new report");
        // }

        vm.deleteTagFromReport = deleteTagFromReport;
        vm.isBucketed = vm.designdetail.IsBucketed; // Local property
        vm.makeTotalizerTagDialog = makeTotalizerTagDialog;
        vm.tagDetailflagChanged = false;
        //  console.log(vm.designdetail.IsBucketed);



        $scope.$watch(function () {
            return commonService.reportDetails;
        }, function (newValue, oldValue) {
            //console.log('value changed in details', oldValue, newValue);
            //vm.selectedLanguage = vm.languages[newValue];
            $timeout(function () {
                vm.designdetail = newValue;
                if (vm.designdetail.Id == -1) {
                    if (vm.designdetail.IsBucketed == true) {
                        console.log('i am change the bucket');
                        vm.importerType = 4;
                        //vm.designdetail.BucketTypeId = 8;
                        vm.isBucketed = vm.designdetail.IsBucketed;
                    }
                    else if (vm.designdetail.IsBucketed == false) {
                        vm.importerType = 1;
                        vm.isBucketed = vm.designdetail.IsBucketed;
                    }

                }
                //console.log('i am in directive changed function', vm.designdetail);

            }, 1000);
            commonService.reportDetails = newValue;
        }, true);




        function makeTotalizerTagDialog(ev, value, index) {
            //  console.log(value);

            if (value.MinutesPerFlowMeasurement || value.ResetTotalizerAt) {
                return true;
            }
            else {
                //  console.log('totalizer not true');
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
                            //  console.log(vm.designdetail.ReportDataItemSet[index]);
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


    } // controller brace

})();
