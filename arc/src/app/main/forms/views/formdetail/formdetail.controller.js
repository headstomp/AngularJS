(function () {
    'use strict';

    function roundDateTimeByBucket(dateTime, bucketTypeId) {
        dateTime = moment(dateTime);
        switch (bucketTypeId) {
            case 4: // 10m
                var minutes = Math.floor(dateTime.minutes() / 10) * 10;
                return dateTime.minutes(minutes)
                    .seconds(0)
                    .format();

            case 5: // 30m
                var minutes = Math.floor(dateTime.minutes() / 30) * 30;
                return dateTime.minutes(minutes)
                    .seconds(0)
                    .format();

            case 6: // 01h
                return dateTime.minutes(0)
                    .seconds(0)
                    .format();

            case 7: // 12h
                var hours = Math.floor(dateTime.hours() / 12) * 12;
                return dateTime.hours(hours)
                    .minutes(0)
                    .seconds(0)
                    .format();

            case 8: // 01d
                return dateTime.hours(0)
                    .minutes(0)
                    .seconds(0)
                    .format();
        }
        return dateTime.format();
    }

    function getCommentDateTimeSubtracted(dateTime, isLabelPeriodStart, bucketTypeId) {
        dateTime = moment(dateTime);
        if (isLabelPeriodStart) {
            switch (bucketTypeId) {
                case 4: // 10m
                    return dateTime.subtract(10, 'minutes')
                        .format();
                case 5: // 30m
                    return dateTime.subtract(30, 'minutes')
                        .format();
                case 6: // 60m
                    return dateTime.subtract(60, 'minutes')
                        .format();
                case 7: // 12h
                    return dateTime.subtract(12, 'hours')
                        .format();
                case 8: // 24h
                    return dateTime.subtract(24, 'hours')
                        .format();
            }
        }
        return dateTime.format();
    }

    angular
        .module('app.formsdetail')
        .controller('formsdetailController', formsdetailController);

    /** @ngInject */
    function formsdetailController($document, $mdDialog, msApi, ImporterDetailService, $scope, locations, $http, $qb, $danApi) {
        var vm = this;

        var vm = _.merge(this, {
            tagDetail: {},
            tagDetailflagChanged: false,
            tagList: [],
            importerDetails: ImporterDetailService,
            tagData: [],
            tagResultSet: {},
            reportList: [],
            tagName: 'Select a Tag',
            disableTagEditDialogue: false,
            tagType: 'raw',
            disableBucket: false,
            disableRefresh: false,
            tagSourceSearch: '',
            tagSourceId: ImporterDetailService.Id,
            tagSearch: '',
            importerType: 0,
            dataLocationId: 0,
            firstDataAtSince: '',
            valueCount: 0,
            tagSet: [],
            tagSourceSet: [],
            nonreducedTagValueChanged: false
        });



        ///////////////////////////////////////////////////////////////////
        // DAN FILTERS
        ///////////////////////////////////////////////////////////////////

        $scope.$watchGroup([
            'vm.tagSearch',
        ], function () {
            if (vm.tagSearch.length <= 3) {
                getTagSet(20);
            }
            else {
                getTagSet(0);
            }
        });


        function getTagSet(limit) {
            var query = {
                $type: 'Gfsa.Arc.Api.ArcService.Query, Gfsa.Arc.Api',
                Where: $qb.where.all([
                    $qb.where.any([
                        $qb.where.contains('Name', $qb.as.string(vm.tagSearch)),
                        $qb.where.contains('Description', $qb.as.string(vm.tagSearch)),
                    ]),
                    vm.tagSourceId && $qb.where.equalTo('TagSourceId', $qb.as.int64(vm.tagSourceId)),
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
                    vm.tagSet = response.data
                });
            /*
            $http.post('http://tf-devsql01:7535/Gfsa.Arc.Api/Tag/Query', query).then(function (response) {
                vm.tagSet = response.data;
            });
            */
        }

        ///////////////////////////////////////////////////////////////////


        vm.rawAspects = ['Date', 'Value', 'Actions'];
        vm.redAspects = ['Date', 'Last', 'Min', 'Max', 'Avg', 'Wavg', 'Var', 'StD'];
        vm.onReportHead = ['Name', 'Owner'];
        vm.onPropertiesHead = ['Name', 'Value1', 'Value2', 'Value3'];

        // tagResults widget table layout for datatables
        vm.dtOptions = {
            dom: 'rt<"bottom"<"left"<""B>><"right"<"info"i><"pagination"p>>>',
            buttons: [
                'copy',
                'print',
                'pdf',
                'excel',
            ],
            pagingType: 'simple',
            pageLength: 20,
            lengthMenu: [
                [10, 20, 50, 100, -1],
                [10, 20, 50, 100, "All"]
            ],
            autoWidth: true,
            responsive: true,
            order: [
                [0, "desc"]
            ]
        };
        // onReports widget table layout for datatables
        vm.dtOptions1 = {
            dom: 'rt<"bottom"<"left"<"length"i>><"right"<"info"><"pagination"p>>>',
            pagingType: 'simple',
            pageLength: 5,
            autoWidth: false,
            responsive: false
        };
        vm.dtOptions2 = {
            dom: 'rt<"bottom"<"left"<"length"i>><"right"<"info"><"pagination"p>>>',
            pagingType: 'simple',
            pageLength: 5,
            autoWidth: false,
            responsive: false
        };

        // Methods
        vm.getTagResults = getTagResults;
        vm.tagResult = tagResult;
        vm.typeCheck = typeCheck;
        vm.openEditDialog = openEditDialog;
        vm.deleteTagValue = deleteTagValue;
        vm.refreshTagResults = refreshTagResults;
        // vm.openEditTagDialog = openEditTagDialog;
        //vm.getValueCount = getValueCount;

        vm.commentCounts = {};
        vm.getCommentCount = getCommentCount;
        //vm.getCommentCount();

        function refreshComments(bucketTypeId) {
            vm.commentCounts = {};
            var tagId = vm.tagDetail.Id;
            $danApi.selectCommentSetByTagId({
                    tagId: tagId
                })
                .then(function (response) {
                    vm.commentCounts = {};
                    if (vm.tagDetail.DataLocationId == 4) {

                        angular.forEach(vm.tagResultSet, function (resultSet) {
                            var arr = _.filter(response.data, function (o) {
                                if (o.CommentTypeId != 4) {
                                    var dateFromResultSet = resultSet.DateTime; // to make comparison
                                    var dateTime = getCommentDateTimeSubtracted(o.DateTime, true, bucketTypeId);
                                    var dateTime = roundDateTimeByBucket(dateTime, bucketTypeId);
                                    var dateFromApi = moment(dateTime)
                                        .format("YYYY-MM-DDTHH:mm:ss");
                                    return (_.isEqual(dateFromResultSet, dateFromApi))
                                }
                            })
                            if (arr.length > 0) {
                                vm.commentCounts[resultSet.DateTime] = arr.length;
                            }
                        });

                    }
                    else {
                        angular.forEach(vm.tagResultSet, function (resultSet) {
                            var arr = _.filter(response.data, function (o) {
                                return o.GroupId == resultSet.GroupId
                            })
                            if (arr.length > 0) {
                                vm.commentCounts[resultSet.GroupId] = arr.length;
                            }
                            //console.log(vm.commentCounts);
                        });
                    }
                    //  console.log(vm.commentCounts);
                });
        }

        function getCommentCount(bucketTypeId) {

            refreshComments(bucketTypeId);
            return;

        }

        function formatDateToLabelPeriod(bucketId, Key) {

            //  console.log(Key);
            var tempDate = '';
            var dateKey = '';
            switch (bucketId) {
                case 8:
                    tempDate = moment(Key)
                        .subtract(24, 'h');
                    dateKey = moment.parseZone(tempDate)
                        .utc()
                        .format();
                    //  console.log(dateKey);
                    return dateKey;

                    break;
                case 7:
                    tempDate = moment(Key)
                        .subtract(12, 'h');
                    dateKey = moment.parseZone(tempDate)
                        .utc()
                        .format();
                    return dateKey;
                    break;
                case 6:
                    tempDate = moment(Key)
                        .subtract(1, 'h');
                    dateKey = moment.parseZone(tempDate)
                        .utc()
                        .format();
                    return dateKey;
                    break;
                case 5:
                    tempDate = moment(Key)
                        .subtract(30, 'm');
                    dateKey = moment.parseZone(tempDate)
                        .utc()
                        .format();
                    return dateKey;
                    break;
                case 4:
                    tempDate = moment(Key)
                        .subtract(10, 'm');
                    dateKey = moment.parseZone(tempDate)
                        .utc()
                        .format();
                    return dateKey;
                    break;

            }

        }


        vm.showCommentPrompt = function (ev, val, key) {
            // Appending dialog to document.body to cover sidenav in docs app
            $mdDialog.show({
                    bindToController: true,
                    controller: 'valueCommentController',
                    controllerAs: 'vm',
                    templateUrl: 'app/main/dialogs/comment/comment.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    locals: {
                        event: ev,
                        value: val,
                        dateTime: val.DateTime,
                        reportDesignDetail: {
                            LabelPeriodStart: true,
                            BucketTypeId: vm.bucketId,
                        },
                    },
                })
                .finally(function () {
                    console.log('yes i am dialog');
                    vm.getCommentCount(vm.bucketId);

                });


        };


        // get data for tagResults per bucket type
        function getTagResults(id, Name) {
            if (vm.disableRefresh) {
                return;
            }
            vm.disableRefresh = true;
            vm.tagId = id;
            vm.tagName = Name;
            vm.tagDetail.Name = Name;
            vm.tagDetail.Id = id;
            getReportList(id); // trigger query for Reports this tag is on
            msApi.request('tagresult@query', {
                    id: id,
                },
                function (response) {
                    console.log(response);
                    vm.tagData = response;
                    vm.tagData.selected = true;
                    if (vm.tagData[1]) {
                        // if non reduced data default to bucket type 1 (Raw)
                        vm.tagDetail.DataLocationId = 2;
                        vm.tagResult(1);

                    }
                    else {
                        // if reduced data default to bucket type 8 (1 day)
                        vm.tagDetail.DataLocationId = 4;
                        vm.tagResult(8);
                    }
                    vm.disableRefresh = false;
                },
                function (response) {
                    console.log('Unable to refresh data');
                    console.error(response)
                });
        };

        function refreshTagResults(id) {
            msApi.request('tagresult@query', {
                    id: id,
                },
                function (response) {
                    vm.tagData = response;
                    vm.tagResult(1);
                },
                function (response) {
                    console.log('Unable to refresh data');
                    console.error(response)
                });

        };

        // get list of reports for tag selected
        function getReportList(id) {
            //console.log('getting reports for' + id);
            msApi.request('reportlist@query', {
                    id: id,
                },
                function (response) {
                    vm.reportList = response;
                    //console.log(response);
                },
                function (response) {
                    console.log('Unable to refresh data');
                    console.error(response)
                });
        };

        // change results based on bucket type selection
        function tagResult(bucketId) {
            vm.bukcetId = bucketId;
            var data = '';
            var resultSet = [];
            angular.forEach(vm.tagData[bucketId], function (value, key, obj) {
                if (key === '$type') {
                    return;
                }
                data = value[0];
                // data.DateTime = keys.toLocaleString();
                data.DateTime = key;
                resultSet.push(data);
            });
            // display the selected bucket type in header
            vm.tagResultSet = resultSet;
            if (bucketId == 1) {
                vm.aspectTitle = "Raw";
            };
            if (bucketId == 4) {
                vm.aspectTitle = "10 Minute Reduction";
            };
            if (bucketId == 5) {
                vm.aspectTitle = "30 Minute Reduction";
            };
            if (bucketId == 6) {
                vm.aspectTitle = "1 Hour Reduction";
            };
            if (bucketId == 7) {
                vm.aspectTitle = "12 Hour Reduction";
            };
            if (bucketId == 8) {
                vm.aspectTitle = "1 Day Reduction";
            };
            vm.getCommentCount(vm.bucketId, vm.tagId);
            //console.log(vm.tagResultSet);


        };

        // TODO change this to $type check
        function typeCheck(value, hash) {
            if (typeof value === 'number') {
                if (value === parseInt(value, 10)) {
                    //console.log('integer');
                    return 'I';
                }
                else {
                    //console.log('float');
                    return 'N';
                }
            };
            if (typeof value === 'string') {
                //console.log('string');
                if (hash) {
                    return 'F';
                }
                else {
                    return 'S';
                }
            };
            if (typeof value === 'boolean') {
                //console.log('bool')
                return 'B';;
            };
            if (typeof value === null) {
                //console.log('null');
                return 'E';
            }
            if (typeof value === 'undefined') {
                //console.log('undefined');
                return 'U';
            }
        };

        function openEditDialog(ev, value, $scope) {
            var dialog = $mdDialog.show({
                controller: 'editValueController',
                controllerAs: 'vm',
                templateUrl: 'app/main/dialogs/edit-value/edit-value-dialog.html',
                parent: angular.element($document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    Value: value,
                    event: ev,
                    parentVm: vm
                },
            });
            dialog.then(function (flag) {
                if (flag) {
                    vm.nonreducedTagValueChanged = false;
                    vm.getTagResults(vm.tagId, vm.tagName);
                }

            });
        }

        /**
         * Delete task
         */
        function deleteTagValue(ev, dataForUpdate) {

            var confirm = $mdDialog.show({
                controller: 'deleteValueController',
                controllerAs: 'vm',
                templateUrl: 'app/main/dialogs/delete-value/delete-value-dialog.html',
                parent: angular.element($document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    Value: dataForUpdate,
                    event: ev,
                    parentVm: vm
                }
            });
            confirm.then(function () {
                if (vm.nonreducedTagValueChanged) {
                    vm.nonreducedTagValueChanged = false;
                    vm.getTagResults(vm.tagId, vm.tagName);
                }
            });

        }

        getLocation();

        // get locations
        vm.locationMap = {};

        function getLocation() {
            locations.getLocation()
                .then(function (locations) {
                    vm.locationSet = locations;

                    angular.forEach(vm.locationSet, function (location) {
                        vm.locationMap[location.Id] = location.Name;
                        //  console.log(location.Name);
                    });

                });
        };

        vm.gotoHelp = gotoHelp;

        function gotoHelp(app) {
            console.log('help');
            if (app == 'formDetail') {
                window.open("https://docs.google.com/document/d/19L414PkngoiHVhZBzR9VbjxCZ73_4A-ZDy3L4WvwUHk/edit#heading=h.4s1lazf35oay", 'HTML', 'height=600,width=800');
            }
            else {
                return
            }
        };

        /*
        function openEditTagDialog(ev, value) {
            console.log('openEditTagDialog');
            $mdDialog.show({
                controller: 'editImporterTagController',
                controllerAs: 'vm',
                templateUrl: 'app/main/importer/dialogs/edit_tag/edit-tag-dialog.html',
                parent: angular.element($document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    Value: value,
                    event: ev,
                    parentVm: vm
                },
                // scope: $scope,
                onRemoving: function () {
                    console.log(vm.tagDetailflagChanged);
                    if (vm.tagDetailflagChanged) {
                        console.log('Value edited in dailog box'); // refresh the tagList after changing the value in edit dailog
                        TagListService.getTagList(vm.importerDetails.Id).then(function (data) {
                            console.log(data);
                            vm.tagList = data;
                        });
                        vm.tagDetailflagChanged = false;
                        //  console.log('vm.tagList',vm.tagList);
                    }

                }

            });
        }
        */
    }
})();
