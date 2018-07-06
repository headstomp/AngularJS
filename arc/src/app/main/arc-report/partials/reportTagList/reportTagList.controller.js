(function () {
    angular.module('app.arcReport')
        .controller('reportTagListController', reportTagListController);

    function reportTagListController($scope, $timeout, $stateParams, DesignDetailServiceForArcReport, $qb, $danApi, $mdDialog, $document, commonService) {
        var vm = this;
        vm.tagSource = undefined;
        vm.tagSourceWhereSet = [];
        vm.designdetail = commonService.reportDetails;
        console.log(commonService.reportDetails);
        //console.log(commonService);
        //  commonService.reportDetails = DesignDetailServiceForArcReport;
        vm.dragended = dragended;
        vm.checkIfTaginList = checkIfTaginList;
        vm.dragCancelled = dragCancelled;
        if (vm.designdetail.Id === '-1') {
            vm.tagSourceId = vm.routeFrom;
            vm.importerType = 0;
            vm.dataLocationId = 4;
            vm.designdetail.IsBucketed = undefined;
            vm.designdetail.BucketTypeId = 9;

        }


        $scope.$watch(function () {
            return commonService.reportDetails;
        }, function (newValue, oldValue) {
            console.log('value changed in details', oldValue, newValue);
            //vm.selectedLanguage = vm.languages[newValue];
            $timeout(function () {
                vm.designdetail = newValue;
                console.log('i am in directive changed function', vm.designdetail);

            }, 1000);
            //commonService.reportDetails = newValue;
        }, true);
        $scope.$watch(function () {
            return commonService.hideSaveButton;
        }, function (newValue, oldValue) {
            commonService.hideSaveButton = newValue;
        });

        vm.copyDraggedTagDetails = copyDraggedTagDetails;
        vm.tagDetailflagChanged = false;
        $danApi.getTagSourceById({
                id: parseInt($stateParams.id)
            })
            .then(function (response) {
                vm.tagSource = response.data;
            });
        getTagSet();

        $scope.$watch('vm.tagSource', function () {
            console.log(vm.tagSource);
            if (vm.tagSource) {
                vm.tagSourceId = vm.tagSource.Id;
            }
        });

        vm.tagSearch = '';
        vm.dataLocationId = 0;
        vm.tagSet = [];

        $scope.$watchGroup([
            'vm.tagSearch',
            'vm.tagSourceId',
            'vm.dataLocationId',
            'vm.importerType',

        ], function () {
            if (vm.tagSearch.length <= 3) {
                getTagSet(20);
            }
            else {
                getTagSet(0);
            }
        });

        $scope.$watch('vm.designdetail.IsBucketed', function () {
            vm.tagSourceWhereSet = [];
            if (vm.designdetail.IsBucketed === true) {
                if (vm.tagSource && vm.tagSource.DataLocationId !== 4) {
                    console.log('Resetting tagsource');
                    vm.tagSource = undefined;
                }
                vm.tagSourceWhereSet = [];
                vm.tagSourceWhereSet.push($qb.where.equalTo('DataLocationId', $qb.as.int64(4)));
            }
            if (vm.designdetail.IsBucketed === false) {
                vm.tagSourceWhereSet = [];
                vm.tagSourceWhereSet.push($qb.where.not($qb.where.equalTo('DataLocationId', $qb.as.int64(4))));
            }
            console.log(vm.tagSource);
            console.log(vm.tagSourceWhereSet);
        });

        function getTagSet(limit) {
            //  console.log(vm.tagSourceId);
            if (!vm.tagSourceId) {
                console.log('no tag source');
                return;
            }
            var query = {
                $type: 'Gfsa.Arc.Api.ArcService.Query, Gfsa.Arc.Api',
                Where: $qb.where.all([
                    $qb.where.any([
                        $qb.where.contains('Name', $qb.as.string(vm.tagSearch)),
                        $qb.where.contains('Description', $qb.as.string(vm.tagSearch)),
                        //  $qb.where.contains('DisplayName', $qb.as.string(vm.tagSearch)),
                    ]),
                    vm.tagSourceId && $qb.where.equalTo('TagSourceId', $qb.as.int64(vm.tagSourceId)),
                    vm.dataLocationId && $qb.where.equalTo('DataLocationId', $qb.as.int64(vm.dataLocationId)),

                ]),
            };
            if (limit > 0) {
                query.Limit = {
                    $type: 'Gfsa.Arc.Api.ArcService.PageLimit, Gfsa.Arc.Api',
                    Index: 0,
                    Count: limit,
                };
            }
            $danApi.selectTagSetByQuery({
                    query: query
                })
                .then(function (response) {
                    vm.tagSet = response.data;
                    console.log(vm.tagSet);
                });
            /*
            $http.post('http://tf-devsql01:7535/Gfsa.Arc.Api/Tag/Query', query).then(function (response) {
            vm.tagSet = response.data;
            });
             */
        }



        function copyDraggedTagDetails($data) {
            //  SelectedTagService.data = $data;
            //console.log($data);
            vm.selectedTag = $data;

            vm.copyTag = {
                "DaveItemNumber": null,
                "DisplayOrder": null,
                "Heading": null,
                "Id": "",
                "ReportId": vm.designdetail.Id,
                "ShowCount": false,
                "ShowLastValue": false,
                "ShowMaximum": false,
                "ShowMinimum": false,
                "ShowRange": false,
                "ShowTotal": false,
                "ShowAverage": false,
                "ShowVariance": false,
                "ShowStandardDeviation": false,
                "ShowWeightedAverage": false,
                "ShowTotalizer": false,
                "ShowValue": false,
                "Tag": {
                    "Area": null,
                    "DataLocationId": null,
                    "DaveItemId": null,
                    "Description": vm.selectedTag.Description,
                    "FirstDataAt": null,
                    "Id": vm.selectedTag.Id,
                    "IsActive": true,
                    "IsPlaceholder": false,
                    "IsTotalizer": !!(vm.selectedTag.ResetTotalizerAt || vm.selectedTag.MinutesPerFlowMeasurement),
                    "Location": {
                        "Code": null,
                        "Description": null,
                        "Id": null,
                        "Name": null
                    },
                    "LocationId": null,
                    "MinutesPerFlowMeasurement": vm.selectedTag.MinutesPerFlowMeasurement,
                    "Name": vm.selectedTag.Name,
                    "ParentTagId": null,
                    "RawTableName": null,
                    "ReducedTableName": null,
                    "ResetTotalizerAt": vm.selectedTag.ResetTotalizerAt,
                    "SourceTagName": null,
                    "TagSource": {
                        "Description": null,
                        "Id": 0,
                        "Name": null,
                        "QvReload": null
                    },
                    "TagSourceId": vm.selectedTag.TagSourceId,
                    "TagTypeId": vm.selectedTag.TagTypeId
                },
                "TagId": vm.selectedTag.Id,

            }
            //console.log(vm.selectedTag.data);
            //console.log(vm.copyTag);

            if (vm.selectedTag.DataLocationId == 4) {
                vm.importerType = 4;
                // console.log(vm.designdetail);
                vm.designdetail.IsBucketed = true;
                // console.log(vm.designdetail);
                if (vm.designdetail.BucketTypeId === 9) {
                    // console.log(vm.designdetail);
                    vm.designdetail.BucketTypeId = 8;
                }
                else {}
                // vm.designdetail.BucketTypeId = 8;
                if (vm.copyTag.Tag.TagTypeId == 8) {
                    vm.copyTag.ShowLastValue = true;
                    vm.isBucketed = true;
                }
                else {
                    vm.copyTag.ShowWeightedAverage = true;
                    vm.isBucketed = true;

                }
            }
            else {
                vm.importerType = 1;
                vm.designdetail.IsBucketed = false;
                vm.designdetail.BucketTypeId = 1;
                vm.copyTag.ShowValue = true;
                vm.isBucketed = false;

            }

            // console.log(vm.importerType);
            //commonService.reportDetails = vm.designdetail;

            return vm.copyTag;
        }

        vm.checkIfTaginList = checkIfTaginList;

        function checkIfTaginList(tag, source) {
            // console.log(tag);
            var data = tag;
            var onReport = false;
            angular.forEach(vm.designdetail.ReportDataItemSet, function (value, key) {
                if (tag == value.TagId) {
                    onReport = true;
                    alert("this tag has already been added to the report");
                }
            });

            return onReport;
        }


        vm.calculateTag = calculateTag;

        function calculateTag(ev, reportDataItem, reportDesignDetail) {
            console.log(reportDesignDetail);

            console.log('entering in');
            $mdDialog.show({
                    controller: 'makeCalculatedTag',
                    controllerAs: 'vm',
                    templateUrl: 'app/main/dialogs/calculate-tag/calculate-tag-dialog.html',
                    parent: angular.element($document.body),
                    targetEvent: ev,
                    //clickOutsideToClose: true,
                    locals: {
                        reportDesignDetail: reportDesignDetail,
                        reportDataItem: reportDataItem,
                        event: ev,
                    }
                })
                .then(function (tagInfo) {
                    if (tagInfo) {
                        $danApi.getTagById({
                                id: tagInfo.TagId
                            })
                            .then(function (response) {
                                vm.importerType = 4;
                                vm.isBucketed = true;
                                vm.designdetail.IsBucketed = true;
                                if (vm.designdetail.ReportDataItemSet.length == 0) {
                                    vm.designdetail.BucketTypeId = 8;
                                }


                                var reportDataItem = getReportDataItemCopy();
                                reportDataItem.TagId = response.data.Id;
                                reportDataItem.Tag = response.data;
                                reportDataItem.ReportId = vm.designdetail.Id;
                                reportDataItem.ShowLastValue = true;

                                vm.designdetail.ReportDataItemSet.push(reportDataItem);

                                //putReportDetails();
                            });
                    }
                    else {
                        if (vm.designdetail.ReportDataItemSet && vm.designdetail.ReportDataItemSet.length == 0) {
                            vm.importerType = 0;
                            vm.designdetail.BucketTypeId = 9;
                            vm.designdetail.IsBucketed = undefined;
                            vm.isBucketed = false;
                        };
                    }
                });



        }

        function getReportDataItemCopy() {
            return {
                "DaveItemNumber": null,
                "DisplayOrder": null,
                "Heading": null,
                "Id": "",
                "ReportId": vm.designdetail.Id,
                "ShowCount": false,
                "ShowLastValue": false,
                "ShowMaximum": false,
                "ShowMinimum": false,
                "ShowRange": false,
                "ShowTotal": false,
                "ShowAverage": false,
                "ShowVariance": false,
                "ShowStandardDeviation": false,
                "ShowWeightedAverage": false,
                "ShowTotalizer": false,
                "ShowValue": false,
                "Tag": {
                    "Area": null,
                    "DataLocationId": null,
                    "DaveItemId": null,
                    "Description": null,
                    "FirstDataAt": null,
                    "Id": null,
                    "IsActive": true,
                    "IsPlaceholder": false,
                    "IsTotalizer": null,
                    "Location": {
                        "Code": null,
                        "Description": null,
                        "Id": null,
                        "Name": null,
                    },
                    "LocationId": null,
                    "MinutesPerFlowMeasurement": null,
                    "Name": null,
                    "ParentTagId": null,
                    "RawTableName": null,
                    "ReducedTableName": null,
                    "ResetTotalizerAt": null,
                    "SourceTagName": null,
                    "TagSource": {
                        "Description": null,
                        "Id": null,
                        "Name": null,
                        "QvReload": null,
                    },
                    "TagSourceId": null,
                },
                "TagId": null,
                "TagtypeId": null
            };
        }


        //edit the tad details from the list screen
        vm.openEditTagDetailsDialog = openEditTagDetailsDialog;

        function openEditTagDetailsDialog(ev, value, index) {
            //console.log(index);
            var dialog = $mdDialog.show({
                controller: 'editTagController',
                controllerAs: 'vm',
                templateUrl: 'app/main/dialogs/edit-tag/edit-tag-dialog.html',
                parent: angular.element($document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    Value: value,
                    event: ev,
                    parentVm: vm
                }
            });
            dialog.then(function (result) {
                //console.log(result);
                //  console.log(vm.tagSet);
                if (vm.tagDetailflagChanged) {
                    vm.tagDetailflagChanged = false;
                    if (result.ResetTotalizerAt || result.MinutesPerFlowMeasurement) {
                        vm.tagSet[index] = result;
                        //  console.log('new tag set', vm.tagSet);
                    }
                    else {
                        vm.tagSet[index] = result;
                    }
                }
                else {
                    vm.tagSet[index] = result;
                    //  console.log('old set', vm.tagSet);
                }
            });

        }

        function dragended() {
            console.log('drag ended called');
            DesignDetailServiceForArcReport = vm.designdetail;

        }

        function dragCancelled() {
            console.log('drag canceled called');
        }





    } // controller function bracket
})();
