(function () {
    // 'use strict';

    angular.module('app.design')
        .directive('noSpecialChar', function noSpecialCharDirective() {
            return {
                require: 'ngModel',
                restrict: 'A',
                link: function (scope, element, attrs, modelCtrl) {
                    modelCtrl.$parsers.push(function (inputValue) {
                        if (inputValue == undefined) {
                            return '';
                        }
                        cleanInputValue = inputValue.replace(/[^\w\s\.,()-]/gi, '');
                        if (cleanInputValue != inputValue) {
                            modelCtrl.$setViewValue(cleanInputValue);
                            modelCtrl.$render();
                        }
                        return cleanInputValue;
                    });
                }
            }
        });

    angular.module('app.design')
        .directive('hcStockChart', function hcStockChartDirective() {
            return {
                restrict: 'E',
                template: '<div ng-cloak ></div>',
                scope: {
                    options: '='
                },
                link: function ($scope, element) {
                    //console.log($scope);
                    $scope.$watch("options", function (newValue, oldValue) {
                        $scope.options = newValue;
                        Highcharts.setOptions({
                            lang: {
                                downloadJPEG: 'JPEG',
                                downloadPDF: 'PDF'
                            }
                        });
                        Highcharts.stockChart(element[0], $scope.options ? $scope.options : {});
                    });

                }
            };
        });

    angular.module('app.design')
        .directive('hcBarChart', function hcBarChartDirective() {
            return {
                restrict: 'E',
                template: '<div ng-cloak ></div>',
                scope: {
                    options: '='
                },
                link: function ($scope, element) {
                    $scope.$watch("options", function (newValue, oldValue) {
                        $scope.options = newValue;
                        Highcharts.setOptions({
                            lang: {
                                downloadJPEG: 'JPEG',
                                downloadPDF: 'PDF'
                            }
                        });
                        Highcharts.chart(element[0], $scope.options ? $scope.options : {});
                    });
                }
            };
        });

    angular.module('app.design')
        .run(function ($rootScope) {
            $rootScope.stateHistory = [];
            $rootScope.$on('$stateChangeSuccess', function (event, to, toParams, from, fromParams) {
                $rootScope.stateHistory.push(from);
                console.log($rootScope.stateHistory);
            });
        });

    angular.module('app.design')
        .controller('designController', designController);

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

    /** @ngInject */
    function designController($stateParams, $document, $timeout, $mdDialog, $scope, $state, $element, $q, $location, $mdColorPalette, $mdToast, $http, $qb, $mdSidenav, SelectedTagService, user, routeFrom, DesignDetailService, DesignDataService, ReportService, msApi, FileSaver, Blob, locations, $danApi) {

        function getApplicablePreviousState() {
            var state = _.findLast($scope.stateHistory, function (state) {
                console.log(state);
                switch (state.name) {
                    case 'app.designlist':
                    case 'app.publishedlist':
                        return true;
                }
                return state.name === 'app.designlist';
            });
            if (state) {
                return state.name;
            }
            return 'app.designlist';
        }

        var vm = this;
        vm.date = moment()
            .format();
        vm.saveInProgressFlag = false;

        vm.toggleResultSet = function () {
            if (vm.designdetail.IsPublished) {
                vm.designdetail.ShowTable = true;
            }
        };

        vm.previousListStateName = getApplicablePreviousState();
        vm.previousListStateNameLabel = 'My Designs List';
        switch (vm.previousListStateName) {
            case 'app.designlist':
                vm.previousListStateNameLabel = 'My Designs';
                break;
            case 'app.publishedlist':
                vm.previousListStateNameLabel = 'Published Reports';
                break;
        }
        console.log(vm.previousListStateName);

        vm.lastState = _.last($scope.stateHistory) || {};

        // Data
        vm.username = user.Username;
        vm.isadmin = user.IsAdmin;
        vm.orignalDesignDetail = DesignDetailService;
        vm.designdetail = angular.copy(vm.orignalDesignDetail);

        console.log('report design detail', vm.designdetail);

        vm.sliderObject
        vm.designdata = DesignDataService;
        // console.log(vm.designdata);
        vm.copyTag = {};
        vm.aspectData = {};
        vm.chartdate = [];
        vm.limit = 100;
        vm.isLive = false;
        vm.disableLiveButton = false;
        vm.isBucketed = vm.designdetail.IsBucketed;
        vm.totalizerflagChanged = false;
        // console.log(vm.designdetail);
        vm.downloadExcel = downloadExcel;
        vm.routeFrom = routeFrom;
        vm.makeTotalizerTagDialog = makeTotalizerTagDialog;
        vm.totalizerFlag = getTotalizerFlag(vm.designdetail);
        vm.totalizerAndBucket = totalizerBucketFlag;
        vm.totalizerBucketFlag = vm.totalizerAndBucket(vm.isBucketed, vm.totalizerFlag);
        vm.getSliderObject = getSliderObject;
        vm.sliderObject = vm.getSliderObject(vm.designdetail);
        vm.getMinMaxForYaxis = getMinMaxForYaxis;
        vm.calculatedTagClass = calculatedTagClass;
        vm.loadingFlag = true;
        vm.dropFlag = true;
        //  console.log(vm.CalculatedTagId);
        vm.commentCounts = {};

        vm.dragCancelled = dragCancelled;

        function dragCancelled() {
            console.log('dragCancelled');
            if (vm.designdetail.Id == -1) {
                vm.importerType = 0;
                vm.designdetail.BucketTypeId = 9; // TODO look at this in html (hard coded crap) should add 9 to database
                vm.designdetail.IsBucketed = undefined;
                vm.dropFlag = false;
            }




        }

        vm.aspectMap = {
            'Last': 'HeadingLastValue',
            'Value': "HeadingValue",
            'WAvg': 'HeadingWeightedAverage',
            'Avg': 'HeadingAverage',
            'Min': 'HeadingMinimum',
            'Max': 'HeadingMaximum',
            'Total': 'HeadingTotal',
            'Count': 'HeadingCount',
            'Range': 'HeadingRange',
            'Variance': 'HeadingVariance',
            'StanDev': 'HeadingStandardDeviation',
            'Totalizer': 'HeadingTotalizer',
        }
        vm.tagSource = undefined;
        $scope.$watch('vm.tagSource', function () {
            console.log('vm.tagSource', vm.tagSource);
            if (vm.tagSource) {
                vm.tagSourceId = vm.tagSource.Id;
                console.log('vm.tagSourceId', vm.tagSourceId);
            }
        });

        vm.tagSourceWhereSet = [];
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

        vm.getComments = getComments;
        vm.getComments();

        vm.getCalculatedTagIds = getCalculatedTagIds;

        function getCalculatedTagIds(reportSet) {
            var filteredItems = (_.filter(reportSet.ReportDataItemSet, function (o) {
                return o.Tag.TagTypeId == 8
            }));
            var filteredItems1 = _.map(filteredItems, 'TagId');
            //console.log(filteredItems1);
            return filteredItems1;
        };

        function calculatedTagClass(val) {
            //console.log(val);

            if (val.TagId && vm.calculatedTagIds.indexOf(val.TagId) != -1) {
                //console.log(val.TagId);
                return true;

            }
            else {
                return false;
            }
        }

        vm.calculatedTagIds = vm.getCalculatedTagIds(vm.designdetail);
        console.log(vm.calculatedTagIds);

        function getMinMaxForYaxis(chartData) {
            var maxArray = [];
            var minArray = [];
            var counter = 0;
            var max = 0;
            var min = 0;
            angular.forEach(chartData, function (data) {
                //console.log(typeof data[0]);
                if (typeof data[0] === 'number') {
                    var maxTemp = data.reduce(function (a, b) {
                        return Math.max(a, b);

                    });
                    //  console.log('max', maxTemp);
                    if (maxTemp > max) {
                        max = maxTemp;
                        //  console.log(max);
                    }
                    var minTemp = data.reduce(function (a, b) {
                        return Math.min(a, b);
                        counter++;
                    });
                    if (minTemp < min) {
                        min = minTemp;
                        //  console.log(min);
                    }
                    //  console.log('min', minTemp);

                }
                counter++;
            });

            //  console.log(counter);
            //  console.log(chartData.length);
            if (counter == chartData.length) {
                //    console.log('went in');
                //    console.log(max);
                //    console.log(min);
                return {
                    max: max,
                    min: min
                };
            }

        }

        function refreshComments() {
            vm.commentCounts = {};
            var bucketTypeId = parseInt(vm.designdetail.BucketTypeId);
            var isLabelPeriodStart = vm.designdetail.LabelPeriodStart;
            _.forEach(vm.designdetail.ReportDataItemSet, function (reportDataItem) {
                var tagId = reportDataItem.TagId;
                $danApi.selectCommentSetByTagId({
                        tagId: tagId
                    })
                    .then(function (response) {
                        vm.commentCounts[tagId] = {};
                        if (reportDataItem.Tag.DataLocationId == 4) {
                            vm.commentCounts[tagId] = _(response.data)
                                .filter(function (comment) {
                                    return comment.CommentTypeId > 0 && comment.CommentTypeId != 4;
                                })
                                .groupBy(function (comment) {
                                    var dateTime = getCommentDateTimeSubtracted(comment.DateTime, isLabelPeriodStart, bucketTypeId);
                                    var dateTime = roundDateTimeByBucket(dateTime, bucketTypeId)
                                        .utc()
                                        .format();
                                })
                                .value();
                        }
                        else {
                            vm.commentCounts[tagId] = _(response.data)
                                .filter(function (comment) {
                                    return comment.CommentTypeId > 0;
                                })
                                .groupBy(function (comment) {
                                    return comment.GroupId;
                                })
                                .value();
                        }
                        //  console.log(vm.commentCounts);
                    });
            });
        }

        // .seconds(0)
        //     .format();
        // .seconds(0)
        //     .format();
        // .seconds(0)
        //     .format();
        // .minutes(0)
        //     .seconds(0)
        //     .format();
        // .minutes(0)
        //     .seconds(0)
        //     .format();

        function getComments() {
            refreshComments();
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
                    value: val,
                    dateTime: key,
                    reportDesignDetail: vm.designdetail,
                },
                onRemoving: function () {
                    console.log('refereshing the comments');
                    vm.getComments();
                }
                //fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
        };

        //


        function getSliderObject(designdetail) {
            if (designdetail.Id === -1) {}
        }

        //slider Function

        if ($stateParams.sourceId) {
            $danApi.getTagSourceById({
                    id: parseInt($stateParams.sourceId)
                })
                .then(function (response) {
                    vm.tagSource = response.data;
                });
        }

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

        // get locations for any dropdowns needed
        getLocation();
        // get locations
        function getLocation() {
            locations.getLocation()
                .then(function (locations) {
                    vm.locationSet = locations;
                });
        };

        //
        // REPORT WIDE ACTIONS
        //


        // no changes if not report owner or admin
        if (user.IsAdmin == true || user.Username == vm.designdetail.Owner || vm.designdetail.Id == -1) {
            vm.disableSaveButton = false;
            vm.reportOwner = true;
            console.log(user.Username + ' is admin');
        }
        else {
            vm.disableSaveButton = true;
            console.log(user.Username + ' not admin');
        }

        // if its a new report bring user to details tab, else the table tab
        if (vm.designdetail.Id === '-1') {
            vm.contenView = 'details';
            //vm.disableSaveButton = false;
            vm.designdetail.Owner = vm.username;
            if (vm.lastState.name == 'app.importerdetail' || vm.lastState.name == 'app.formsdetail') {
                vm.detailView = 'tags';
                getImporterList();
                console.log(getImporterList());
                getTagSet();
                vm.tagSourceId = vm.routeFrom;
                console.log('vm.tagSourceId', vm.tagSourceId);
            }
            else {
                vm.detailView = 'more';
            }
        }
        else {
            //vm.disableSaveButton = false;
            vm.contenView = $state.params.display || 'table';
            if ($state.params.sourceId && $state.params.sourceId !== 'new' && $state.params.display === 'details') {
                vm.detailView = 'tags';
                getImporterList();
                getTagSet();
                vm.tagSourceId = $state.params.sourceId;
                console.log('vm.tagSourceId in else', vm.tagSourceId);
            }
            else {
                vm.detailView = 'more';
            }
        }

        // save report
        vm.putReportDetails = putReportDetails;

        function putReportDetails() {
            vm.loadingFlag = false;

            if (vm.disableSaveButton) {
                return;
            }
            vm.disableSaveButton = true;

            if (!_.isEmpty(vm.DetailForm.$error)) {
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
            var reportDataItemSet = [];
            angular.forEach(vm.designdetail.ReportDataItemSet || [], function (reportDataItem) {
                this.push(reportDataItem);
            }, reportDataItemSet);
            if (!reportDataItemSet.length) {
                dataForUpdate.IsBucketed = true;
                dataForUpdate.BucketTypeId = 8;
            }

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
                        vm.refreshData(vm.designdetail.Id);
                    }, 3000);
                }, onFailure);
            }
        }

        // Delete Report
        vm.deleteReport = deleteReport;

        function deleteReport(ev, Id) {
            var confirm = $mdDialog.confirm({
                title: 'Remove Report - ' + Id,
                parent: $document.find('#design'),
                textContent: 'Are you sure want to remove this report?',
                ariaLabel: 'remove report',
                targetEvent: ev,
                clickOutsideToClose: true,
                escapeToClose: true,
                ok: 'Remove',
                cancel: 'Cancel'
            });
            $mdDialog.show(confirm)
                .then(function () {
                    msApi.request('designDetailDelete@del', {
                        id: Id
                    }, function (response) {
                        console.log(response);
                        $state.go('app.designlist', {}, {
                            reload: true
                        });
                    }, function (response) {
                        console.log('Unable to delete Details');
                        console.error(response);
                    });
                }, function () {
                    // Canceled
                });
        }

        // open the duplicate report dialog
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

        // open the where used dialog
        vm.whereUsedDialog = whereUsedDialog;

        function whereUsedDialog(ev, value, $scope) {
            $mdDialog.show({
                controller: 'whereUsedController',
                controllerAs: 'vm',
                templateUrl: 'app/main/report/dialogs/where_used.html',
                parent: angular.element($document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    Values: value,
                    User: vm.username,
                    event: ev,
                    parentVm: vm
                },
                onRemoving: function () {
                    console.log('closed dialog');
                }
            });
        }

        // load the help files related to reports
        vm.gotoHelp = gotoHelp;

        function gotoHelp(app) {
            console.log('help');
            if (app == 'design') {
                window.open("https://docs.google.com/document/d/19L414PkngoiHVhZBzR9VbjxCZ73_4A-ZDy3L4WvwUHk/edit#heading=h.dade44ncz3uj", 'HTML', 'height=600,width=800');
            }

            if (vm.contenView == 'publish-settings') {
                window.open("https://docs.google.com/document/d/19L414PkngoiHVhZBzR9VbjxCZ73_4A-ZDy3L4WvwUHk/edit#heading=h.f3iv932f1wkg", 'HTML', 'height=600,width=800');
            }


            else {
                return
            }
        };

        //


        //
        // DESIGN TAG LIST w/DAN FILTERS
        //


        // flags used to filter the importer list to reduced or non reduced
        if (vm.designdetail.IsBucketed == true) {
            vm.importerType = 4;
        }
        if (vm.designdetail.IsBucketed == false) {
            vm.importerType = 1;
        }

        if (vm.designdetail.Id == "-1") {
            vm.importerType = 0;
            // console.log("new report");
        }

        // check if there are tags on report and if not importer list should not be filtered and bucket type should be "select a tag first"
        var reportDataItemSet = [];
        angular.forEach(vm.designdetail.ReportDataItemSet || [], function (reportDataItem) {
            this.push(reportDataItem);
        }, reportDataItemSet);

        if (!reportDataItemSet.length) {
            // console.log(reportDataItemSet);
            vm.importerType = 0;
            vm.designdetail.BucketTypeId = 9; // TODO look at this in html (hard coded crap) should add 9 to database
            vm.designdetail.IsBucketed = undefined;
        }

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
                });
            /*
            $http.post('http://tf-devsql01:7535/Gfsa.Arc.Api/Tag/Query', query).then(function (response) {
            vm.tagSet = response.data;
            });
             */
        }

        // get the list of importers for the taglist based on already added tags and report type
        vm.getImporterList = getImporterList;

        function getImporterList() {

            if (_.isEmpty(vm.DetailForm) || !_.isEmpty(vm.DetailForm.$error)) {
                var alert = $mdDialog.alert({
                    title: 'Error',
                    textContent: 'Please make sure you provided all the required details; including a name and description.',
                    ok: 'Close',
                });
                $mdDialog.show(alert)
                    .finally(function () {
                        delete alert;
                        //vm.disableSaveButton = false;
                    });
                return;
            }
            else {

                // set bucket type and importer type based report type
                if (vm.designdetail.IsBucketed == true) {
                    vm.importerType = 4;
                }
                if (vm.designdetail.IsBucketed == false) {
                    vm.importerType = 1;
                }

                if (vm.designdetail.Id == "-1") {
                    vm.importerType = 0;
                    // console.log("new report");
                }

                // change button after get list button is clicked
                vm.detailView = 'tags'
                msApi.request('designImporterlist@query',
                    function (response) {
                        vm.importerList = response;
                        // console.log(vm.importerList);
                    },
                    function (response) {
                        // console.log('Unable to get tag list');
                        // console.error(response)
                    });

                $element.find('input')
                    .on('keyup keypress keydown click', function (ev) {
                        // console.log(ev);
                        ev.stopPropagation();
                    });

            }

        }

        // clear the search box on importer dropdown list
        vm.clearSearchTerm = clearSearchTerm;

        function clearSearchTerm() {
            vm.searchTerm = undefined;
            // vm.importerFilter = '';
        }

        // when dragging a tag from the list to the design screen - check if already on report
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

        //


        //
        // DESIGN CONTENT
        //


        // open up the importer from a tag already on the details screen
        vm.openImporter = openImporter;

        function openImporter(reportDataItem) {
            vm.detailView = 'tags';
            console.log(reportDataItem.Tag.TagSourceId);
            $danApi.getTagSourceById({
                    id: reportDataItem.Tag.TagSourceId
                })
                .then(function (response) {
                    vm.tagSource = response.data;
                });
            // vm.tagSourceId = reportDataItem.Tag.TagSourceId;
        }

        // ADD A NEW TAG TO REPORT FROM TAG LIST
        // need to map data from tag object to reportDetails object when dragged from taglist to report details
        vm.copyDraggedTagDetails = copyDraggedTagDetails;

        function copyDraggedTagDetails($data) {
            SelectedTagService.data = $data;
            // console.log($data);
            vm.selectedTag = SelectedTagService;
            // console.log(vm.selectedTag.data);
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
                    "Description": vm.selectedTag.data.Description,
                    "FirstDataAt": null,
                    "Id": vm.selectedTag.data.Id,
                    "IsActive": true,
                    "IsPlaceholder": false,
                    "IsTotalizer": !!(vm.selectedTag.data.ResetTotalizerAt || vm.selectedTag.data.MinutesPerFlowMeasurement),
                    "Location": {
                        "Code": null,
                        "Description": null,
                        "Id": null,
                        "Name": null
                    },
                    "LocationId": null,
                    "MinutesPerFlowMeasurement": vm.selectedTag.data.MinutesPerFlowMeasurement,
                    "Name": vm.selectedTag.data.Name,
                    "ParentTagId": null,
                    "RawTableName": null,
                    "ReducedTableName": null,
                    "ResetTotalizerAt": vm.selectedTag.data.ResetTotalizerAt,
                    "SourceTagName": null,
                    "TagSource": {
                        "Description": null,
                        "Id": 0,
                        "Name": null,
                        "QvReload": null
                    },
                    "TagSourceId": vm.selectedTag.data.TagSourceId,
                    "TagTypeId": vm.selectedTag.data.TagTypeId
                },
                "TagId": vm.selectedTag.data.Id,

            }
            console.log(vm.selectedTag.data);
            console.log(vm.copyTag);

            if (vm.selectedTag.data.DataLocationId == 4) {
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
            return vm.copyTag;
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////Calculated Tag Drag and Copy starts/////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////////


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

                                putReportDetails();
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

        vm.isCalculatedTag = isCalculatedTag;

        function isCalculatedTag(tag) {
            //console.log('entering in');
            if (tag.TagType == 8) {
                return true;
            }
            else {
                return false;
            }

        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////Calculated Tag Drag and Copy ends///////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////////


        // DELETE A TAG FROM REPORT
        vm.deleteTagFromReport = deleteTagFromReport;

        function deleteTagFromReport(ev, index, reportDataItem) {
            console.log(reportDataItem);
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

        //


        //
        // DESIGN DETAILS
        //


        // set location from user profile on new report
        if (!vm.designdetail.LocationId) {
            vm.designdetail.LocationId = user.LocationId;
        }

        //


        //
        // CHARTS
        //


        vm.getChartData = getChartData;

        function getChartData() {
            //  console.log(vm.aspectData);
            if (vm.aspectData) {
                vm.chartConfig = {};
                vm.chartConfig1 = {};
                vm.highChartsData = [];
                vm.barChartData = [];
                vm.tagNamesForCharts = [];

                vm.chartType = 'line';
                var dateArray = [];
                var dataCollection = [];
                var dt = '';
                var obj = {};
                var data = [];
                var i = 0;
                var tagAspectKeys = Object.keys(_.findLast(vm.aspectData));
                console.log(tagAspectKeys);
                console.log(vm.aspectData);
                for (key in tagAspectKeys) {
                    vm.tagNamesForCharts.push(getLegendNames(tagAspectKeys[key], key));
                    var dataArray = [];
                    var dateArray = [];
                    angular.forEach(vm.aspectData, function (val, key) {
                        dt = moment.parseZone(key)
                            .utc()
                            .format();
                        dateArray.push(dt);
                        obj = val;
                        var arr = Object.keys(obj)
                            .map(function (key) {
                                return obj[key];
                            });
                        //console.log(arr);
                        arr.map(function (val) {});
                        data = arr[i].Value
                        dataArray.push(data);
                        // console.log('something new');
                    })
                    dataCollection.push(dataArray);
                    i++;
                }
                vm.chartdate = dateArray;

                vm.chartdata = dataCollection;
                console.log(vm.chartdata);
                vm.minMaxForYaxis = vm.getMinMaxForYaxis(vm.chartdata);
                //    console.log(vm.minMaxForYaxis);

                // console.log(vm.chartdate);

                var index = 0;
                var tagIndex = 0;
                angular.forEach(vm.chartdata, function (tagdata, index) {
                    var tempForLineChart = [];
                    var tempForBarChart = [];
                    var mainArrayLine = [];
                    var mainArrayBar = [];
                    angular.forEach(tagdata, function (data, i) {
                        var value = data;
                        if (typeof data !== 'number') {
                            value = null;
                        }
                        tempForLineChart.push(Date.parse(vm.chartdate[i]));
                        tempForLineChart.push(value);
                        tempForBarChart.push(value);
                        //tempForBarChart.push(moment(vm.chartdate[i]).format());
                        mainArrayLine.push(tempForLineChart);
                        mainArrayBar.push(tempForBarChart);
                        tempForLineChart = [];
                        //  console.log(mainArrayLine);
                        //tempForBarChart = [];
                    });
                    var barChartData = {
                        name: vm.tagNamesForCharts[index],
                        data: tempForBarChart
                    };
                    var seriesData = {
                        data: mainArrayLine,
                        name: vm.tagNamesForCharts[index]
                    };
                    tempForBarChart = [];
                    mainArrayLine = [];
                    mainArrayBar = [];
                    vm.barChartData.push(barChartData);
                    vm.highChartsData.push(seriesData);
                    //console.log(vm.highChartsData);
                    if (vm.highChartsData.length == vm.chartdata.length) {


                        vm.chartConfig = {
                            credits: {
                                enabled: false
                            },
                            chart: {
                                height: 500,
                                width: 1200,
                                type: 'line',
                                colorCount: 32
                            },
                            title: {
                                text: vm.designdetail.Name
                            },
                            rangeSelector: {
                                selected: 1
                            },
                            legend: {
                                enabled: true,
                                layout: 'vertical',
                                align: 'right',
                                verticalAlign: 'top',
                                y: 100
                            },

                            yAxis: {
                                max: vm.minMaxForYaxis.max,
                                min: vm.minMaxForYaxis.max * -1,
                                tickAmount: 8,
                                plotLines: [{
                                    value: 0,
                                    width: 4,
                                    color: 'silver'
                                }]
                            },
                            //plotOptions: {
                            series: {
                                selected: true,
                                compare: 'value',
                                showInNavigator: true,
                                showCheckbox: true,
                                connectNulls: true,
                                marker: {
                                    enabled: true
                                },
                                animation: {
                                    duration: 2000
                                },
                                events: {
                                    legendItemClick: function (event) {
                                        event.preventDefault();
                                    },
                                    checkboxClick: function (event) {

                                        if (event.checked) {
                                            event.item.show()
                                        }
                                        else {
                                            event.item.hide()
                                        }
                                    },
                                    click: function (event) {
                                        alert(this.name + ' clicked');
                                    }
                                }
                            },
                            //  },
                            tooltip: {
                                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.y})<br/>',
                                valueDecimals: 2,
                                split: true
                            },
                            series: vm.highChartsData,
                            xAxis: {},
                        };

                        vm.chartConfig1 = {
                            credits: {
                                enabled: false
                            },
                            chart: {
                                height: 500,
                                width: 1200,
                                type: 'column',
                                colorCount: 32
                            },
                            title: {
                                text: vm.designdetail.Name
                            },
                            rangeSelector: {
                                selected: 1
                            },
                            legend: {
                                enabled: true,
                                layout: 'vertical',
                                align: 'right',
                                verticalAlign: 'top',
                                y: 100
                            },

                            yAxis: {
                                min: 0,
                                labels: {
                                    overflow: 'justify'
                                }
                            },
                            plotOptions: {
                                series: {
                                    selected: true,
                                    showCheckbox: true,
                                    animation: {
                                        duration: 2000
                                    },
                                    events: {
                                        legendItemClick: function (event) {
                                            event.preventDefault();
                                        },
                                        checkboxClick: function (event) {

                                            if (event.checked) {
                                                event.item.show()
                                            }
                                            else {
                                                event.item.hide()
                                            }
                                        },
                                        click: function (event) {
                                            alert(this.name + ' clicked');
                                        }
                                    }
                                }
                            },
                            tooltip: {
                                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
                                valueDecimals: 2,
                                split: true
                            },
                            series: vm.barChartData,
                            xAxis: {
                                categories: vm.chartdate,
                                crosshair: true
                            },
                        };

                        //  console.log(vm.barChartData);

                    }
                });
            }
            else {
                return;
            }

            //chart Data ends here
            // vm.lineChart = {
            //     labels: vm.chartdate,
            //     series: aspectDataColumns(),
            //     data: vm.chartdata
            // };
            // vm.barChart = {
            //     labels: vm.chartdate,
            //     series: aspectDataColumns(),
            //     data: vm.chartdata
            // };
        }

        //
        // REPORT RESULTS
        //


        // datatable historical
        vm.arcReportTagDataDTInstance = {};
        vm.arcReportTagDataDTOptions = {
            // f = search

            dom: 'rt<"bottom"<"left"<"buttons"B><"length"l>><"right"<"info"i><"pagination"p>>>',
            buttons: [
                'copy',
                'print',
                'pdf', {
                    text: 'Excel',
                    key: '1',
                    action: function (e, dt, node, config) {
                        window.location.assign($scope.BASE_URL + '/Report/' + vm.designdetail.Id + '/Excel');
                    }
                }
            ],
            pagingType: 'simple',
            pageLength: 20,
            lengthMenu: [
                [10, 20, 50, 100, -1],
                [10, 20, 50, 100, "All"]
            ],
            autoWidth: false,
            responsive: false,
            order: [
                [0, "desc"]
            ]
        };

        // datatable live
        vm.arcReportTagLiveDTInstance = {};
        vm.dtOptionsLive = {
            // f = search
            dom: 'rt<"bottom"<"left"<"buttons"B><"length"l>><"right"<"info"i><"pagination"p>>>',
            buttons: [
                'copy',
                'print',
                'pdf', {
                    text: 'Excel',
                    key: '1',
                    action: function (e, dt, node, config) {
                        window.location.assign($scope.BASE_URL + '/Report/' + vm.designdetail.Id + '/Excel/Live?reportStart=' + vm.date);
                    }
                }
            ],
            pagingType: 'simple',
            pageLength: 20,
            lengthMenu: [
                [10, 25, 50, 100, -1],
                [10, 20, 50, 100, "All"]
            ],
            autoWidth: false,
            responsive: false,
            order: [
                [0, "desc"]
            ]
        };

        angular.element('tagData')
            .append("<button>click</button");

        // refresh the results set
        vm.refreshData = refreshData;

        function refreshData(id) {
            vm.loadingFlag = false;

            delete vm.highChartsData;
            delete vm.barChartData;
            delete vm.chartConfig;
            delete vm.chartConfig1;
            if (vm.disableRefreshButton) {
                return;
            }
            vm.disableRefreshButton = true;
            vm.designdata = {};

            msApi.request('designData@get', {
                id: id,
                pageCount: parseInt(id) === 1007 ? 1000 : 100,
                pageIndex: -1,
            }, function (response) {
                vm.isLive = false;
                vm.designdata = response;
                vm.CalculatedTagId = vm.getCalculatedTagIds(vm.designdetail);
                console.log(vm.CalculatedTagId);
                updateAspectHeader();
                updateAspectData();
                getChartData();
                var message = 'Updated data from server';
                $mdToast.show({
                    template: '<md-toast id="" layout="column" layout-align="center start"><div class="md-toast-content">' + message + '</div></md-toast>',
                    hideDelay: 3000,
                    position: 'top right',
                    parent: '#content'
                });

                $timeout(function () {
                    vm.loadingFlag = true;
                    vm.disableRefreshButton = false;
                    // console.log(newId);
                    vm.getComments();
                }, 3000);
            }, function (response) {

                $timeout(function () {
                    vm.disableRefreshButton = false;
                    // console.log(newId);
                    vm.loadingFlag = true;
                    vm.getComments();
                }, 3000);
            });
        }

        // refrsh the live results set
        vm.refreshDataLive = refreshDataLive;

        function refreshDataLive(id) {
            vm.loadingFlag = false;
            delete vm.highChartsData;
            delete vm.barChartData;
            delete vm.chartConfig;
            delete vm.chartConfig1;
            if (vm.disableRefreshButton) {
                return;
            }
            // delete vm.chartConfig;
            // delete vm.chartConfig1;
            //vm.chartTypeLive = 'bar';
            vm.disableRefreshButton = true;
            msApi.request('getLiveData@get', {
                id: id
            }, function (response) {
                vm.designdata = response;
               console.log(response);
                vm.isLive = true;
                updateAspectHeader();
                updateAspectData();
                getChartData();
                var message = 'Displaying live data from DCS';
                $mdToast.show({
                    template: '<md-toast id="" layout="column" layout-align="center start"><div class="md-toast-content">' + message + '</div></md-toast>',
                    hideDelay: 3000,
                    position: 'top right',
                    parent: '#content'
                });
                $timeout(function () {
                    vm.disableRefreshButton = false;
                    vm.loadingFlag = true;
                    // console.log(newId);
                }, 3000);
            }, function (response) {
                vm.isLive = true;
                vm.designdata = {};
                updateAspectData();
                console.log('Unable to refresh data');
                var message = 'No Live Data Available';
                $mdToast.show({
                    template: '<md-toast id="" layout="column" layout-align="center start"><div class="md-toast-content">' + message + '</div></md-toast>',
                    hideDelay: 3000,
                    position: 'top right',
                    parent: '#content'
                });
                $timeout(function () {
                    vm.disableRefreshButton = false;
                    vm.loadingFlag = true;
                    // console.log(newId);
                }, 3000);
            });

        }

        // terrible way of trying to update the html column spans to display the many aspects to single tags
        vm.updateColumnSpan = updateColumnSpan;

        function updateColumnSpan($tag) {
            //  console.log('$tag', $tag);
            //updateAspectHeader();
            var columns = 0;

            angular.forEach(vm.designdetail.ReportDataItemSet, function (value, key) {
                // console.log(value);
                if (value.Tag.Id == $tag && value.ShowLastValue == true) {
                    ++columns;
                }
                if (value.Tag.Id == $tag && value.ShowValue == true) {
                    ++columns;
                }
                if (value.Tag.Id == $tag && value.ShowWeightedAverage == true) {
                    ++columns;
                }
                if (value.Tag.Id == $tag && value.ShowAverage == true) {
                    ++columns;
                }
                if (value.Tag.Id == $tag && value.ShowMinimum == true) {
                    ++columns;
                }
                if (value.Tag.Id == $tag && value.ShowMaximum == true) {
                    ++columns;
                }
                if (value.Tag.Id == $tag && value.ShowTotal == true) {
                    ++columns;
                }
                if (value.Tag.Id == $tag && value.ShowCount == true) {
                    ++columns;
                }
                if (value.Tag.Id == $tag && value.ShowRange == true) {
                    ++columns;
                }
                if (value.Tag.Id == $tag && value.ShowVariance == true) {
                    ++columns;
                }
                if (value.Tag.Id == $tag && value.ShowStandardDeviation == true) {
                    ++columns;
                }
                if (value.Tag.Id == $tag && value.ShowTotalizer == true) {
                    ++columns;
                }
            })
            //console.log(columns);
            return columns;
        }

        // create list of all the aspect columns headers needed per tag from tag details
        vm.updateAspectHeader = updateAspectHeader;
        var count = 0;

        function updateAspectHeader(whatever) {
            var header = [];
            //console.log(vm.designdetail.ReportDataItemSet);
            angular.forEach(vm.designdetail.ReportDataItemSet, function (value, key) {

                if (value.ShowLastValue == true) {
                    header.push('Last');
                }
                if (value.ShowValue == true) {
                    header.push('Value');
                }
                if (value.ShowWeightedAverage == true) {
                    header.push('WAvg');
                }
                if (value.ShowAverage == true) {
                    header.push('Average');
                }
                if (value.ShowMinimum == true) {
                    header.push('Min');
                }
                if (value.ShowMaximum == true) {
                    header.push('Max');
                }
                if (value.ShowTotal == true) {
                    header.push('Total');
                }
                if (value.ShowCount == true) {
                    header.push('Count');
                }
                if (value.ShowRange == true) {
                    header.push('Range');
                }
                if (value.ShowVariance == true) {
                    header.push('Variance');
                }
                if (value.ShowStandardDeviation == true) {
                    header.push('StanDev');
                }
                if (value.ShowTotalizer == true) {
                    header.push('Totalizer');
                }
                count++


            })
            return header;
        }

        // create list of all the aspect columns needed per tag
        function aspectDataColumns() {


            var tags = [];
            var header = [];
            //console.log(vm.designdetail.ReportDataItemSet);
            angular.forEach(vm.designdetail.ReportDataItemSet, function (value, key) {
                // console.log(value);
                if (value.ShowLastValue === true) {
                    tags.push(key + 1 + '-Last');
                }
                if (value.ShowValue === true) {
                    tags.push(key + 1 + '-Value');
                }
                if (value.ShowWeightedAverage === true) {
                    tags.push(key + 1 + '-WAvg');
                }
                if (value.ShowAverage === true) {
                    tags.push(key + 1 + '-Avg');
                }
                if (value.ShowMinimum === true) {
                    tags.push(key + 1 + '-Min');
                }
                if (value.ShowMaximum === true) {
                    tags.push(key + 1 + '-Max');
                }
                if (value.ShowTotal === true) {
                    tags.push(key + 1 + '-Total');
                }
                if (value.ShowCount === true) {
                    tags.push(key + 1 + '-Count');
                }
                if (value.ShowRange === true) {
                    tags.push(key + 1 + '-Range');
                }
                if (value.ShowVariance === true) {
                    tags.push(key + 1 + '-Variance');
                }
                if (value.ShowStandardDeviation === true) {
                    tags.push(key + 1 + '-StanDev');
                }
                if (value.ShowTotalizer === true) {
                    tags.push(key + 1 + '-Totalizer');
                }
            })
            //console.log(tags);
            return tags;
        }

        // god help you if you made it this far and are trying to fix anything realted to this mess
        function updateAspectData() {
            var data = {};
            var count = 0;
            for (var key in vm.designdata) {
                //console.log('design data key',key);

                if (key.substring(0, 1) == "1" || key.substring(0, 1) == "2") {
                    var obj1 = {};
                    var obj2 = {};
                    // var time = key;
                    // var time = key.toLocaleString();
                    var time = key
                    // .utc(true)
                    // .toISOString();
                    //  console.log(time);
                    // convertedDateString = convertedDateString.replace('at ', '')
                    // var time = new Date(convertedDateString);

                    //console.log('vm.designdata[key]', vm.designdata[key]);
                    angular.forEach(vm.designdata[key], function (value, key) {
                        // console.log('designdata',count++);
                        vm.tag = key;
                        //console.log(key);

                        // name the data aspect the same as the column aspects to compare next
                        var lstName = vm.tag + '-Last';
                        var vlName = vm.tag + '-Value';
                        var wvgName = vm.tag + '-WAvg';
                        var avgName = vm.tag + '-Avg';
                        var minName = vm.tag + '-Min';
                        var maxName = vm.tag + '-Max';
                        var ttlName = vm.tag + '-Total';
                        var cntName = vm.tag + '-Count';
                        var rngName = vm.tag + '-Range';
                        var varName = vm.tag + '-Variance';
                        var stdName = vm.tag + '-StanDev';
                        var ttzName = vm.tag + '-Totalizer';
                        var val = value;
                        var md5 = value.MD5;
                        var grp = value.GroupId;
                        // console.log(value)

                        // compare the column names to aspect names to display the correct aspect
                        //    console.log(aspectDataColumns());
                        angular.forEach(aspectDataColumns(), function (value, key) {
                            var list = value;
                            //console.log(val);
                            if (list == lstName) {
                                // console.log(list, lstName);
                                if (typeof val === 'undefined') {
                                    var lst = '-';
                                }
                                else {
                                    var lst = val.LastValue;
                                    var tagId = val.TagId;
                                }
                                obj1[lstName] = {
                                    Value: lst,
                                    hash: md,
                                    TagId: tagId
                                };
                                //    console.log(md);
                                obj2[time] = obj1;
                                mix(obj2, data);
                            }
                            if (list == wvgName) {
                                // console.log(list,wvgName);
                                if (typeof val === 'undefined') {
                                    var wvg = '-';
                                }
                                else {
                                    var wvg = val.WeightedAverage;
                                    var tagId = val.TagId;
                                }
                                obj1[wvgName] = {
                                    Value: wvg,
                                    hash: md,
                                    TagId: tagId
                                };
                                obj2[time] = obj1;
                                mix(obj2, data);
                            }
                            if (list == avgName) {
                                // console.log(list,avgName);
                                if (typeof val === 'undefined') {
                                    var avg = '-';
                                }
                                else {
                                    var avg = val.Average;
                                    var tagId = val.TagId;
                                }
                                obj1[avgName] = {
                                    Value: avg,
                                    hash: md,
                                    TagId: tagId
                                };
                                obj2[time] = obj1;
                                mix(obj2, data);
                            }
                            if (list == minName) {
                                if (typeof val === 'undefined') {
                                    var min = '-';
                                }
                                else {
                                    var min = val.Minimum;
                                    var tagId = val.TagId;
                                }
                                obj1[minName] = {
                                    Value: min,
                                    hash: md,
                                    TagId: tagId
                                };
                                obj2[time] = obj1;
                                mix(obj2, data);
                            }
                            if (list == maxName) {
                                if (typeof val === 'undefined') {
                                    var max = '-';
                                }
                                else {
                                    var max = val.Maximum;
                                    var tagId = val.TagId;
                                }
                                obj1[maxName] = {
                                    Value: max,
                                    hash: md,
                                    TagId: tagId
                                };
                                obj2[time] = obj1;
                                mix(obj2, data);
                            }
                            if (list == ttlName) {
                                if (typeof val === 'undefined') {
                                    var ttl = '-';
                                }
                                else {
                                    var ttl = val.Total;
                                    var tagId = val.TagId;
                                }
                                obj1[ttlName] = {
                                    Value: ttl,
                                    hash: md,
                                    TagId: tagId
                                };
                                obj2[time] = obj1;
                                mix(obj2, data);
                            }
                            if (list == cntName) {
                                if (typeof val === 'undefined') {
                                    var cnt = '-';
                                }
                                else {
                                    var cnt = val.Count;
                                    var tagId = val.TagId;
                                }
                                obj1[cntName] = {
                                    Value: cnt,
                                    hash: md,
                                    TagId: tagId
                                };
                                obj2[time] = obj1;
                                mix(obj2, data);
                            }
                            if (list == rngName) {
                                if (typeof val === 'undefined') {
                                    var rng = '-';
                                }
                                else {
                                    var rng = val.Range;
                                    var tagId = val.TagId;
                                }
                                obj1[rngName] = {
                                    Value: rng,
                                    hash: md,
                                    TagId: tagId
                                };
                                obj2[time] = obj1;
                                mix(obj2, data);
                            }
                            if (list == varName) {
                                if (typeof val === 'undefined') {
                                    var vr = '-';
                                }
                                else {
                                    var vr = val.Variance;
                                    var tagId = val.TagId;
                                }
                                obj1[varName] = {
                                    Value: vr,
                                    hash: md,
                                    TagId: tagId
                                };
                                obj2[time] = obj1;
                                mix(obj2, data);
                            }
                            if (list == stdName) {
                                if (typeof val === 'undefined') {
                                    var std = '-';
                                }
                                else {
                                    var std = val.StandardDeviation;
                                    var tagId = val.TagId;
                                }
                                obj1[stdName] = {
                                    Value: std,
                                    hash: md,
                                    TagId: tagId
                                };
                                obj2[time] = obj1;
                                mix(obj2, data);
                            }
                            if (list == vlName) {
                                var raw = 1;
                                if (typeof val === 'undefined') {
                                    var vl = '-';
                                }
                                else {
                                    var vl = val.Value;
                                    var md = val.MD5;
                                    var type = val.$type;
                                    var grp = val.GroupId;
                                    var tag = val.TagId;
                                    var dt = val.DateTime;
                                }
                                obj1[vlName] = {
                                    hash: md,
                                    $type: type,
                                    GroupId: grp,
                                    DateTime: dt,
                                    TagId: tag,
                                    Value: vl,
                                    Raw: raw
                                };
                                obj2[time] = obj1;
                                mix(obj2, data);
                            }
                            if (list == ttzName) {
                                if (typeof val === 'undefined') {
                                    var ttz = '-';
                                }
                                else {
                                    var ttz = val.Totalizer;
                                    var tagId = val.TagId;
                                }
                                obj1[ttzName] = {
                                    Value: ttz,
                                    hash: md,
                                    TagId: tagId
                                };
                                obj2[time] = obj1;
                                mix(obj2, data);
                            }
                        });
                    });
                }
            }
            //  console.log(data);
            vm.aspectData = data;
        }

        // get data for tagResults per bucket type
        vm.getTagResults = getTagResults;

        function getTagResults(ev, value, $scope) {
            $mdDialog.show({
                controller: 'tagLastValuesController',
                controllerAs: 'vm',
                templateUrl: 'app/main/report/dialogs/tag_last_values.html',
                parent: angular.element($document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    Value: value,
                    event: ev,
                    parentVm: vm
                },
                onRemoving: function () {
                    console.log('closed dialog');
                }
            });
        }

        // this is for editing values on the report results
        vm.openEditDialog = openEditDialog;

        function openEditDialog(ev, value, $scope) {
            // console.log(value);
            $mdDialog.show({
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
                onRemoving: function () {
                    console.log('remiving called');
                    //

                    $timeout(function () {
                        //  console.log('vm.designdetail', vm.designdetail);
                        vm.getComments();
                        refreshData(vm.designdetail.Id);

                    }, 1000);
                }
            });
        }

        function downloadExcel() {
            msApi.request('downloadExcel@get', {
                    id: vm.designdetail.Id
                },
                function (response) {
                    console.log(response);
                    var data = JSON.stringify(response, undefined, 2);
                    var blob = new Blob([data], {
                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
                    });
                    var name = 'Report' + vm.designdetail.Id;
                    FileSaver.saveAs(blob, name + ".xls");
                },
                function (err) {
                    console.log(err);
                });

        }

        // update stuff after SAVE is clicked
        vm.updateStuff = updateStuff;

        function updateStuff(whatever) {
            updateAspectHeader();
            updateAspectData();
            // dtInstance.rerender();
            // console.log("ubout fucking time this works")
        }

        // TODO - redo this using Dans Type information
        // is checking every report value to try and determine its type
        // used in report results html table to do stuff
        vm.typeCheck = typeCheck;

        function typeCheck(value, hash) {
            if (typeof value === 'number') {
                if (value === parseInt(value, 10)) {
                    // console.log('integer');
                    return 'I';
                }
                else {
                    // console.log('float');
                    return 'N';
                }
            };
            if (typeof value === 'string') {
                // console.log('string');
                if (hash) {
                    return 'F';
                }
                else {
                    return 'S';
                }
            };
            if (typeof value === 'boolean') {
                // console.log('bool')
                return 'B';;
            };
            if (typeof value === null) {
                // console.log('null');
                return 'E';
            }
            if (typeof value === 'undefined') {
                // console.log('undefined');
                return 'U';
            }
        }

        // add object to object
        function mix(source, target) {
            for (var key in source) {
                if (source.hasOwnProperty(key)) {
                    target[key] = source[key];
                }
            }
        }

        // get locations
        vm.locationMap = {};

        function getLocation() {
            locations.getLocation()
                .then(function (locations) {
                    vm.locationSet = locations;

                    angular.forEach(vm.locationSet, function (location) {
                        vm.locationMap[location.Id] = location.Name;
                        // console.log(location.Name);
                    });

                });
        };

        //


        //
        //
        //  NOT SURE ABOUT THIS STUFF //
        //
        //
        //
        //


        // whats is this for???????????????????????????????????????????????????????????????????????????????????????????????????
        function getShowSummaryAggregate() {
            return vm.designdetail.ShowSummaryCount ||
                vm.designdetail.ShowSummaryRange ||
                vm.designdetail.ShowSummaryTotal ||
                vm.designdetail.ShowSummaryMaximum ||
                vm.designdetail.ShowSummaryMinimum ||
                vm.designdetail.ShowSummaryWeightedAverage ||
                vm.designdetail.ShowSummaryLastValue;
        }

        // whats is this for???????????????????????????????????????????????????????????????????????????????????????????????????
        function setShowSummaryAggregate(value) {
            vm.designdetail.ShowSummaryCount = value;
            vm.designdetail.ShowSummaryRange = value;
            vm.designdetail.ShowSummaryTotal = value;
            vm.designdetail.ShowSummaryMaximum = value;
            vm.designdetail.ShowSummaryMinimum = value;
            vm.designdetail.ShowSummaryWeightedAverage = value;
            vm.designdetail.ShowSummaryLastValue = value;
        }

        vm.ShowBlock = getShowSummaryAggregate();

        $scope.$watch('vm.ShowBlock', function () {
            if (!vm.ShowBlock) {
                setShowSummaryAggregate(false);
            }
        });

        //
        // Totalizer flag Functions
        //

        function totalizerBucketFlag(isBucket, isTotalizer) {
            if (isBucket && isTotalizer) {
                return true
            }
            else {
                return false;
            }
        }

        function getTotalizerFlag(designDetail) {
            if (designDetail.BucketTypeId == 8) {
                return true;
            }
            else {
                return false;
            }
        }

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
                    result.IsTotalizer = result.ResetTotalizerAt || result.MinutesPerFlowMeasurement;
                    vm.designdetail.ReportDataItemSet[index].ShowTotalizer = result.IsTotalizer;
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

        //
        // Totalizer flag Functions ends
        //


        //
        //
        // Slider Starts here
        //
        //
        // changeslider(vm.designdetail.RollingOffsetUnitId);
        // vm.getRangeflag = function (val) {
        // var rangeFlag = parseInt(val);
        // changeslider(rangeFlag);
        // }
        // function changeslider(offSetUnitId) {
        // var range;
        // var minValue=0;
        // var maxValue=0;
        // if(offSetUnitId==5){
        // vm.designdetail.RollingOffsetUnitId = 5;
        // range = 10;
        // }else if(offSetUnitId==4){
        // vm.designdetail.RollingOffsetUnitId = 4;
        // range = 24;
        // }else if(offSetUnitId==3){
        // vm.designdetail.RollingOffsetUnitId = 3;
        // range = 90;
        // }else if(offSetUnitId==2){
        // vm.designdetail.RollingOffsetUnitId = 2;
        // range = 72;
        // }
        //
        // if(vm.designdetail.RollingStartOffsetOptionId==1){
        // minValue = parseInt('-' + vm.designdetail.RollingStartOffset );
        // }else{
        // minValue = parseInt(vm.designdetail.RollingStartOffset);
        // }
        //
        // if(vm.designdetail.RollingEndOffsetOptionId==1){
        // maxValue = parseInt('-' + vm.designdetail.RollingEndOffset );
        // }else{
        // maxValue = parseInt(vm.designdetail.RollingEndOffset);
        // }
        //
        //
        //
        // vm.slider = {
        // minValue: minValue,
        // maxValue: maxValue,
        // options: {
        // floor:parseInt('-' + range),
        // ceil: range,
        // step: 1,
        // noSwitching: true,
        // minRange: 0,
        // maxRange: (range + range),
        // ticksArray: [0],
        // onChange: function(sliderId) {
        // var slider = angular.copy(vm.slider);
        // var rollingEndOffsetUnitId = '';
        // if(slider.minValue>0){
        // vm.designdetail.RollingStartOffsetOptionId = 2;
        // vm.designdetail.RollingStartOffset = slider.minValue;
        // console.log('minValue '+minValue+' startOffSet '+ startOffSet)
        // } else if(slider.minValue<0){
        // vm.designdetail.RollingStartOffsetOptionId = 1;
        // console.log(typeof slider.minValue);
        // vm.designdetail.RollingStartOffset = parseInt(slider.minValue.toString().substring(1));
        // console.log('minValue '+minValue+' startOffSet '+ startOffSet)
        // }else {
        // vm.designdetail.RollingStartOffsetOptionId = 1;
        // vm.designdetail.RollingStartOffset = 0;
        // }
        // if(slider.maxValue>0){
        // vm.designdetail.RollingEndOffsetOptionId = 2;
        // vm.designdetail.RollingEndOffset = slider.maxValue;
        // console.log('maxValue '+maxValue+' endOffSet '+ endOffSet)
        // } else if(slider.maxValue<0){
        // vm.designdetail.RollingEndOffsetOptionId = 1;
        // vm.designdetail.RollingEndOffset = parseInt(slider.maxValue.toString().substring(1));
        // console.log('maxValue '+maxValue+' endOffSet '+ endOffSet)
        // } else {
        // vm.designdetail.RollingEndOffsetOptionId = 1;
        // vm.designdetail.RollingEndOffset=0;
        // }
        // var unit = slider.options.ceil;
        // switch(unit){
        // case 72:
        // vm.designdetail.RollingOffsetUnitId = 2;
        // break;
        // case 90:
        // vm.designdetail.RollingOffsetUnitId = 3;
        // break;
        // case 24:
        // vm.designdetail.RollingOffsetUnitId = 4;
        // break;
        // case 10:
        // vm.designdetail.RollingOffsetUnitId = 5;
        // break;
        // }
        // vm.lastSliderUpdated = vm.slider.value;
        // },
        // getLegend: function (value) {
        // var result = '';
        // if (value === 0) {
        // result += 'Now';
        // }
        // return result;
        // },
        // translate: function (value) {
        //
        // switch (range) {
        //
        // case 10:
        // var rangeUnit = "years";
        //  var yearValue =
        //  console.log(range);
        // var value = getRange(value, rangeUnit);
        // return value;
        // case 90:
        //
        // var rangeUnit = "days";
        // var value = getRange(value, rangeUnit);
        // return value;
        //
        // case 72:
        // var rangeUnit = "hours";
        // var value = getRange(value, rangeUnit);
        // return value;
        //
        // case 24:
        // var rangeUnit = "months";
        // var value = getRange(value, rangeUnit);
        // return value;
        //
        // }
        //
        // }
        //
        // }
        //
        // };
        // }
        // function getRange(value, range) {
        //  console.log('function called');
        // if (value > 0) {
        // return value + ' ' + range + ' after now'
        // } else if (value < 0) {
        // return value.toString().substring(1) + ' ' + range + ' before now'
        // } else {
        // return 'From now'
        // }
        // }
        //
        //
        //  slider ends here //
        //
        //


        // whats is this for???????????????????????????????????????????????????????????????????????????????????????????????????
        function defaultFilter(n) {
            return n > 5;
        }

        // function for concatnating the tag names and aspects
        function getLegendNames(aspect, key) {
            var temp = aspect.split('-');
            var index = parseInt(temp[0]);
            console.log(vm.designdetail.ReportDataItemSet[index - 1]);


            // ['1-Wavg']
            //  console.log(temp); //['1', Wavg]
            //temp[0]==1;.
            console.log('aspect', temp);
            var tagName = vm.designdetail.ReportDataItemSet[index - 1].Tag.Name;

            var label = vm.designdetail.ReportDataItemSet[index - 1][vm.aspectMap[temp[1]]]; // temp[1]==WAvg
            if (label) {
                label = label.concat(" ", aspect);
                return label;
            }
            else {
                tagName = tagName.concat(" ", aspect);
                return tagName;
            }

        }

        vm.todate = todate;

        function todate(string) {
            var dto = '';
            if (string == 'undefined' || string === 'null') {
                dto = new Date();
            }
            else {
                // console.log(string);
                dto = new Date(string);
            }
            // console.log('this is date' + string);
            return dto
        }

        updateAspectData();
    };

})();
