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
        .module('app.tagdetail')
        .controller('tagdetailController', tagdetailController)
        .directive('hcStockCharts', function hcStockChartDirective() {
            return {
                restrict: 'E',
                template: '<div ng-cloak ></div>',
                scope: {
                    options: '='
                },
                link: function ($scope, element) {
                    $scope.$watch("options", function (newValue, oldValue) {
                        if (newValue !== null || {}) {
                            $scope.options = newValue;
                            Highcharts.setOptions({
                                lang: {
                                    downloadJPEG: 'JPEG',
                                    downloadPDF: 'PDF'
                                }
                            });
                            Highcharts.stockChart(element[0], $scope.options ? $scope.options : {});
                        }
                        else {
                            return;
                        }
                    });
                }
            };
        });

    /** @ngInject */
    function tagdetailController($state, $scope, $document, msApi, $mdDialog, $mdToast, tagData, TagDetailService, $timeout, $location, $danApi, $q) {
        var vm = this;

        vm.moment = moment;

        // Data
        vm.tagDetail = TagDetailService;
        //console.log(vm.tagDetail);

        vm.tagDetailflagChanged = false;
        vm.nonreducedTagValueChanged = false;
        vm.tagData = tagData;
        vm.getChartData = getChartData;
        vm.tagResultSet = {};
        vm.reportList = [];
        vm.tagType = '';
        vm.limit = 100;
        vm.progressBarHide = true;
        vm.disableSpecialProperties = false;
        vm.disableLiveButton = false;
        vm.disableHistoryButton = false;
        vm.checkTagType = checkTagType;
        vm.showCalTagDetail = showCalTagDetail;
        var rawAspects = ['Date', 'Value'];
        vm.rawLiveAspects = ['Date', 'Value'];
        var redAspects = ['Date', 'Totalizer', 'Last', 'Min', 'Max', 'Wavg', 'Var', 'StD', 'Cnt', 'Tot', 'TagId'];
        var redAspects2 = ['Date', 'Last', 'Min', 'Max', 'Wavg', 'Var', 'StD', 'Cnt', 'Tot', 'TagId'];
        var aspectForCalculatedTag = ['DateTime', 'Last Value']; // for labels in datatables
        var aspectForCalculatedTagLabels = ['Date', 'Last Value']; // for filtering of tagdata

        vm.onReportHead = ['Name', 'Owner'];
        vm.mvel = angular.fromJson(vm.tagDetail.Expression);
        vm.mvelMappings = {};
        vm.chartConfig = {};
        //  vm.aspects = [];
        //vm.dataMap = [];
        var temp = {};
        var map = [];
        vm.loadingFlag = false;

        vm.meta = { // meta object to pass to table component
            tagDetail: vm.tagDetail,
            bucketId: vm.bucketId,
            tagType: vm.tagType,
            chartType: vm.chartType
        };
        vm.ifNullsForCalculatedTags = {};
        var aspectNameMap = {
            'lst': 'Last Value',
            'wvg': 'Weighted Average',
            'avg': 'Average',
            'min': 'Minimum',
            'max': 'Maximum',
            'tot': 'Total',
            'cnt': 'Count',
            'rng': 'Range',
            'var': 'Variance'
        };

        var aspectMapForHighCharts = {
            'lst': 'LastValue',
            'wavg': 'WeightedAverage',
            'std': 'StandardDeviation',
            'min': 'Minimum',
            'max': 'Maximum',
            'tot': 'Total',
            'cnt': 'Count',
            'totalizer': 'Totalizer',
            'var': 'Variance',
            'raw': 'Value'
        }

        vm.aspectMap = {
            'Date': 'DateTime',
            'Totalizer': 'Totalizer',
            'Last': 'LastValue',
            'Min': 'Minimum',
            'Max': 'Maximum',
            'Wavg': 'WeightedAverage',
            'Var': 'Variance',
            'StD': 'StandardDeviation',
            'Cnt': 'Count',
            'Tot': 'Total',
            'Value': 'Value',
            'GroupId': 'GroupId',
            'TagId': 'TagId'
        };
        vm.chartType = 'lst';

        if (vm.mvel) {

            var tagPromiseSet = [];
            _.forEach(vm.mvel.mapping, function (value, key) {
                tagPromiseSet.push($danApi.getTagById({
                        id: value.tagId
                    })
                    .then(function (response) {
                        return {
                            key: key,
                            tag: response.data,
                            aspect: aspectNameMap[value.aspect]
                        };
                    }));
            });
            $q.all(tagPromiseSet)
                .then(function (results) {
                    _.forEach(results, function (result) {
                        vm.mvelMappings[result.key] = {
                            tag: result.tag,
                            aspect: result.aspect,
                        };
                    });
                });
        }

        console.log(vm.mvel);

        vm.arcTagDataDTInstance = {};
        vm.arcTagDataDTOptions = {

            dom: 'rt<"bottom"<"left"<""B>><"right"<"info"i><"pagination"p>>>',
            buttons: [
                'copy',
                'print',
                'pdf', {
                    text: ' Excel',
                    key: '1',
                    action: function (e, dt, node, config) {

                        if (vm.tagType == 'red' || vm.tagType == 'raw') {
                            window.location.assign($scope.BASE_URL + '/Tag/' + vm.tagDetail.Id + '/Excel?bucketTypeId=' + vm.bucketId);
                        }
                        else {
                            window.location.assign($scope.BASE_URL + '/Tag/' + vm.tagDetail.Id + '/Excel/Live?reportStart=' + vm.date);
                        }
                    }
                }
            ],
            autoWidth: false,
            responsive: false,
            pagingType: 'simple',
            pageLength: 15,
            order: [
                [0, "desc"]
            ],
            lengthMenu: [
                [10, 20, 50, 100, -1],
                [10, 20, 50, 100, "All"]
            ],
            columnDefs: [{
                // Target the image column
                targets: 1,
                filterable: true,
                sortable: true
            }]
        };

        //var elem = angular.element(document.querySelector(".documentResult"));


        vm.getTagResults = getTagResults;
        vm.getTagResultsLive = getTagResultsLive;
        vm.tagResult = tagResult;
        vm.typeCheck = typeCheck;
        //vm.openEditDialog = openEditDialog;
        vm.deleteTagValue = deleteTagValue;
        vm.refreshTagResults = refreshTagResults;
        vm.openEditTagDialog = openEditTagDialog;

        vm.openUsedOnDialog = openUsedOnDialog;
        vm.getChartData = getChartData;
        vm.checkAspect = checkAspect;
        vm.commentCounts = {};
        vm.deactivateTag = deactivateTag;
        vm.getCommentCount = getCommentCount;
        vm.highChartsData = [];
        //vm.getCommentCount();

        function deactivateTag(event) {
            var confirm = $mdDialog.confirm({
                title: 'Deactivate Tag',
                parent: angular.element($document.body),
                textContent: 'Do you want to deactivate this calculation system wide?',
                ariaLabel: 'Do you want to deactivate this calculation system wide?',
                targetEvent: event,
                clickOutsideToClose: true,
                escapeToClose: true,
                ok: 'Ok',
                cancel: 'Cancel'
            });
            $mdDialog.show(confirm)
                .then(function () {
                    $danApi.deleteTagById({
                            id: vm.tagDetail.Id
                        })
                        .then(function (response) {
                            vm.tagDetail.IsActive = false;
                            //  console.log(response);
                            $location.url('/taglist');
                        }, function () {
                            console.log('unable to deactivate');
                        })
                }, function () {
                    vm.tagDetail.IsActive = true;
                });
        }

        function refreshComments(bucketTypeId) {
            vm.commentCounts = {};
            var tagId = vm.tagDetail.Id;
            $danApi.selectCommentSetByTagId({
                    tagId: tagId
                })
                .then(function (response) {
                    // vm.filterdResponse = _(response.data)
                    //     .filter(function (comment) {
                    //         return comment.CommentTypeId > 0;
                    //     });
                    // console.log(vm.filterdResponse);
                    vm.commentCounts = {};
                    if (vm.tagDetail.DataLocationId == 4) {
                        angular.forEach(vm.tagResultSet, function (resultSet) {
                            var arr = _.filter(response.data, function (o) {
                                //console.log(o);
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
                        });
                    }
                    //  console.log(vm.commentCounts);
                });
        }

        function getCommentCount(bucketTypeId) {

            refreshComments(bucketTypeId);
            return;

        }

        // comment for tags

        vm.showCommentPrompt = function (ev, val, key) {

            //console.log(val, key);

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

        //console.log(vm.dialogPromise);


        // comment for tags

        function checkAspect(value) {
            //delete vm.redAspects;
            if (value == 'Totalizer' && vm.totalizerFlag == false) {
                return false;
            }
            else {
                return true;
            }
        };

        //var date = moment().subtract(1, 'hours');
        vm.date = moment()
            .format();
        //console.log(vm.date);

        // determine if its a reduced or non reduced data source and sets flag
        if (vm.tagDetail.DataLocationId == 2) {
            vm.tagType = 'raw';
            vm.chartType = 'raw';
            vm.disableSpecialProperties = true;
        }
        else {
            vm.tagType = 'red';
            if (vm.tagDetail.TagTypeId == 8) {
                vm.chartType = 'lst';
                vm.isCalculated = 'true';
                vm.tagType = 'cal';
                vm.meta.tagType = 'cal';
                vm.disableSpecialProperties = true;
            }
            else {
                vm.chartType = 'wavg';
            }

            vm.disableSpecialProperties = false;
        }
        //console.log(vm.tagList[0]);

        // get data for LIVE tagResults per bucket type
        function getTagResultsLive(id) {
            //  console.log('vm.meta', vm.meta);
            if (vm.disableRefresh) {
                return;
            }
            vm.disableRefresh = true;
            if (vm.tagType !== 'raw') {
                msApi.request('tagresultLive@get', {
                        id: id,
                    },
                    function (response) {
                        vm.tagData = response;
                        //  vm.dataMap = response;
                        vm.aspects = rawAspects;
                        vm.live = true;
                        vm.tagType = 'rawLive';
                        vm.meta.tagType = 'rawLive';
                        vm.chartType = 'raw';
                        vm.aspectTitle = "Raw";
                        //  console.log(vm.tagData);
                        vm.tagResult(1);
                        var message = 'Live data has been retreived from DCS';
                        $mdToast.show({
                            template: '<md-toast id="" layout="column" layout-align="center start"><div class="md-toast-content">' + message + '</div></md-toast>',
                            hideDelay: 2000,
                            position: 'top right',
                            parent: '#content'
                        });
                        $timeout(function () {
                            vm.disableRefresh = false;
                        }, 3000);
                    },
                    function (response) {
                        vm.live = true;
                        var message = 'Unable to retreive live data at this time';
                        $mdToast.show({
                            template: '<md-toast id="" layout="column" layout-align="center start"><div class="md-toast-content">' + message + '</div></md-toast>',
                            hideDelay: 2000,
                            position: 'top right',
                            parent: '#content'
                        });
                        //  console.error(response)
                    });
            }

        };

        // get data for tagResults per bucket type
        function getTagResults(id) {
            console.log('in the function');
            if (vm.disableRefresh) {
                return;
            }
            vm.disableRefresh = true;
            vm.live = false;
            // determine if its a reduced or non reduced data source and sets flag
            if (vm.tagDetail.DataLocationId == 2) {
                vm.tagType = 'raw';
                vm.meta.tagType = 'raw';
            }
            else {
                vm.tagType = 'red';
                vm.meta.tagType = 'red';
                if (vm.tagDetail.TagTypeId == 8) {
                    vm.chartType = 'lst';
                    vm.isCalculated = 'true';
                    vm.tagType = 'cal'
                    vm.meta.tagType = 'cal';
                    vm.disableSpecialProperties = true;
                }
                else {
                    vm.chartType = 'wavg';
                }
            }
            //  console.log(vm.tagData);
            if (vm.tagType == 'raw') {
                // if non reduced data default to bucket type 1 (Raw)
                vm.tagResult(1);

            }
            else {
                // if reduced data default to bucket type 8 (1 day)
                //vm.loadingFlag = false;
                vm.tagResult(8);
            }
            $timeout(function () {
                vm.disableRefresh = false;
            }, 3000);
            //},

            // function (response) {
            //     vm.live = false;
            //     var message = 'Unable to retreive saved data';
            //     $mdToast.show({
            //         template: '<md-toast id="" layout="column" layout-align="center start"><div class="md-toast-content">' + message + '</div></md-toast>',
            //         hideDelay: 2000,
            //         position: 'top right',
            //         parent: '#content'
            //     });
            // }
            //);
        };

        function refreshTagResults(id) {
            if (vm.disableRefresh) {
                return;
            }
            vm.disableHistoryButton = true;
            msApi.request('tagresult@query', {
                    id: id,
                },
                function (response) {
                    vm.tagData = response;
                    vm.live = false;
                    if (vm.tagDetail.DataLocationId == 2) {
                        vm.getTagResults(1);
                    }
                    else {
                        vm.getTagResults(8);
                    }

                    var message = 'Retreiving saved data';
                    $mdToast.show({
                        template: '<md-toast id="" layout="column" layout-align="center start"><div class="md-toast-content">' + message + '</div></md-toast>',
                        hideDelay: 2000,
                        position: 'top right',
                        parent: '#content'
                    });
                    $timeout(function () {
                        vm.disableRefresh = false;
                    }, 3000);
                },
                function (response) {
                    console.log('Unable to refresh data');
                    var message = 'Unable to retreive saved data';
                    $mdToast.show({
                        template: '<md-toast id="" layout="column" layout-align="center start"><div class="md-toast-content">' + message + '</div></md-toast>',
                        hideDelay: 2000,
                        position: 'top right',
                        parent: '#content'
                    });
                });

        };
        // new directive
        //vm.dataMap = [];
        //vm.aspects = redAspects;



        function tagResult(bucketId) {
            vm.dataMap = [];
            vm.aspects = [];
            vm.meta.bucketId = bucketId;

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

            if (vm.tagDetail.TagTypeId == 8) {
                var data = {};
                var resultSet = [];
                var tempValues = {};
                vm.meta.tagType = 'cal';
                vm.aspects = _.map(aspectForCalculatedTagLabels, function (asp) {
                    return asp.replace(/\s/g, '')
                });
                //console.log('vm.aspects', vm.aspects);
                var asp = _.map(aspectForCalculatedTag, function (aspect) {
                    return aspect.replace(/\s/g, '');
                });
                //console.log('asp', asp);
                var tagData = angular.copy(vm.tagData);
                var keys = _.keys(tagData[0][bucketId])
                var tagDataKeys = keys.filter(function (key) {
                    return key != '$type';
                });
                for (var i = 0; i < tagDataKeys.length; i++) {
                    tempValues["DateTime"] = tagDataKeys[i]
                    for (var y = 0; y < tagData.length; y++) {
                        if (vm.tagData[y][bucketId]) {
                            var tagObj = vm.tagData[y][bucketId][tagDataKeys[i]]
                            //console.log(tagObj);
                            if (tagObj) {
                                angular.forEach(tagObj, function (t) {
                                    if (t[asp[y]]) {
                                        tempValues[vm.aspects[y + 1]] = t[asp[y + 1]];
                                    }
                                    else {
                                        tempValues[vm.aspects[y + 1]] = '';
                                    }
                                });
                            }
                            else {
                                tempValues[vm.aspects[y + 1]] = '';
                            }
                        }
                    }
                    tempValues['TagId'] = vm.tagDetail.Id;
                    resultSet.push(tempValues);
                    tempValues = {};
                }
                vm.dataMap = resultSet;
                //  console.log(vm.dataMap);
                //console.log(vm.chartType);
                vm.getChartData(vm.chartType);
                tagDataKeys = [];
                keys = [];
            }
            else {
                if (vm.tagType == 'raw' || vm.tagType == 'rawLive') {
                    //  console.log(vm.tagType);
                    vm.aspects = rawAspects;
                    //console.log(vm.tagData);
                    angular.forEach(vm.tagData[1], function (tag, date) {
                        //console.log(tag);
                        if (date == '$type') {
                            return;
                        }
                        else {
                            angular.forEach(tag, function (tagObj, index) {
                                vm.dataMap.push(tagObj);
                            });
                        }
                    });
                    //  console.log('in raw', vm.dataMap);
                    vm.getChartData(vm.chartType);
                    vm.progressBarHide = true;
                }
                else if (vm.tagType == 'red') {
                    //  console.log('its red');
                    vm.currentBucketData = vm.tagData[bucketId];
                    //  console.log('vm.currentBucketData', vm.currentBucketData);
                    vm.totalizerFlag = getTotalizerFlag(vm.tagDetail);
                    //  console.log(vm.totalizerFlag)
                    if (vm.totalizerFlag) {
                        vm.aspects = redAspects;
                    }
                    else {
                        vm.aspects = redAspects2;
                    }
                    angular.forEach(vm.currentBucketData, function (tag, date) {
                        if (date == '$type') {
                            return;
                        }
                        else {
                            angular.forEach(tag, function (tagObj, index) {
                                for (var i = 0; i < vm.aspects.length; i++) {
                                    temp[vm.aspectMap[vm.aspects[i]]] = tagObj[vm.aspectMap[vm.aspects[i]]];
                                }
                                vm.dataMap.push(temp);
                                temp = {};
                            });
                        }
                    });
                    vm.getChartData(vm.chartType);
                    vm.progressBarHide = true;
                }

            }


        } // new directive function bracket

        // new directive


        // prepare data for chart
        function getChartData(chartType) {
            //  console.log(chartType);
            vm.chartType = '';
            //  console.log(aspectMapForHighCharts);
            vm.highChartsData = [];
            var tempForLineChart = [];
            var mainArrayLine = [];
            vm.chartType = chartType;
            var options = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',

            };
            console.log(vm.dataMap);
            angular.forEach(vm.dataMap, function (tagData, key) {
                var value = tagData;
                //console.log('value for Chart', value);
                if (vm.tagDetail.TagTypeId == 8) {
                    var d = new Date(value.DateTime);
                    tempForLineChart.push(d.toLocaleString('en-US', options));
                    tempForLineChart.push(value[aspectMapForHighCharts[chartType]]);
                    mainArrayLine.push(tempForLineChart);
                    tempForLineChart = [];
                }
                else {
                    //var result = new Date(Date.UTC(value.DateTime));
                    var d = new Date(value.DateTime);
                    tempForLineChart.push(d.toLocaleString('en-US', options)); //Date.parse(value.DateTime) - 14400000 to decerese the UTC 4 hours diffrence in date

                    tempForLineChart.push(value[aspectMapForHighCharts[chartType]]);
                    mainArrayLine.push(tempForLineChart);
                    tempForLineChart = [];
                }
            });
            var seriesData = {
                data: mainArrayLine,
                name: aspectMapForHighCharts[chartType],
                type: 'area',
                threshold: null,
                tooltip: {
                    valueDecimals: 2
                },
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, Highcharts.getOptions()
                            .colors[0]
                        ],
                        [1, Highcharts.Color(Highcharts.getOptions()
                                .colors[0])
                            .setOpacity(0)
                            .get('rgba')
                        ]
                    ]
                }
            };
            //  console.log(seriesData);
            vm.highChartsData.push(seriesData);
            var height = $("#hc-container")
                .height();
            var width = $("#hc-container")
                .width();
            //  console.log(height, width);
            vm.chartConfig = {
                credits: {
                    enabled: false
                },
                chart: {
                    type: 'area',
                    colorCount: 32
                },
                legend: {
                    enabled: true,
                    layout: 'vertical',
                    align: 'top',
                    verticalAlign: 'top',
                    y: 100
                },
                yAxis: {
                    tickAmount: 8,
                    plotLines: [{
                        value: 0,
                        width: 4,
                        color: 'silver'
                    }]
                },
                tooltip: {
                    pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.y})<br/>',
                    valueDecimals: 2,
                    split: true,
                    xDateFormat: '%Y-%m-%d %H:%M'
                },
                series: vm.highChartsData,
                navigator: {
                    enabled: false
                },
                scrollbar: {
                    enabled: false
                },
                rangeSelector: {
                    enabled: false
                },
                xAxis: {
                    type: 'datetime',
                    dateTimeLabelFormats: {
                        //  second: '%Y-%m-%d<br/>%H:%M:%S',
                        // minute: '%Y-%m-%d<br/>%H:%M',
                        hour: '%Y-%m-%d<br/>%H:%M',
                        //  day: '%Y<br/>%m-%d',
                        //  week: '%Y<br/>%m-%d',
                        //  month: '%Y-%m',
                        //  year: '%Y'
                    }
                },
            };
            //console.log(vm.chartConfig);
            vm.loadingFlag = true; // true for hide
            vm.meta.chartType = aspectMapForHighCharts[chartType];
            //  console.log(vm.meta);


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

        function openEditTagValueDialog(ev, value, $scope) {
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
                    }
                })
                .then(function (flag) {
                    vm.nonreducedTagValueChanged = false;
                    $timeout(function () {
                        vm.refreshTagResults(value.TagId);
                    }, 2000);
                });
        }

        function openUsedOnDialog(ev, value, $scope) {
            $mdDialog.show({
                controller: 'editTagValueController',
                controllerAs: 'vm',
                templateUrl: 'app/main/importer/dialogs/edit_tag_value/edit-dialog.html',
                parent: angular.element($document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    Value: value,
                    event: ev,
                    parentVm: vm
                },
                onRemoving: function () {
                    $timeout(function () {
                        vm.refreshTagResults(value.TagId);
                    }, 2000);
                }
            });
        }

        /**
         * Delete task
         */
        function deleteTagValue(ev, dataForUpdate) {
            //  console.log(dataForUpdate);
            $mdDialog.show({
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
                })
                .then(function (flag) {
                    vm.nonreducedTagValueChanged = false;
                    $timeout(function () {
                        vm.refreshTagResults(dataForUpdate.TagId);
                    }, 2000);
                });;
        }

        function openEditTagDialog(ev, value, $scope) {
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
                },
            });

            dialog.then(function (data) {

                    vm.tagDetail = data;

                })
                .finally(function () {

                    //  console.log('noodles');

                    if (vm.tagDetailflagChanged) {
                        if (vm.tagType == 'raw') {
                            // if non reduced data default to bucket type 1 (Raw)
                            $timeout(function () {
                                vm.tagResult(1);

                            }, 1000);
                            vm.tagDetailflagChanged = false;
                        }
                        else {
                            $timeout(function () {
                                if (vm.tagDetail.MinutesPerFlowMeasurement || vm.tagDetail.ResetTotalizerAt) {
                                    vm.redAspects = null;
                                    vm.tagResultSet = [];
                                    vm.tagResult(8)
                                }
                                else {
                                    vm.redAspects = null;
                                    vm.tagResultSet = [];
                                    vm.tagResult(4)
                                }
                            }, 2000);
                            vm.tagDetailflagChanged = false;
                        }
                    }
                });
        }

        // start of rendering of tagdetails
        vm.checkTagType(vm.tagDetail);

        function checkTagType(tagDetail) {
            if (tagDetail.TagTypeId == 8) {
                vm.showCalTagDetail(tagDetail);
            }
            else {
                vm.getTagResults(tagDetail.Id);
            }
        }

        function showCalTagDetail(tagDetail) {
            //  console.log('fucntion called');
            var tagIds = [];
            tagIds[0] = tagDetail.Id;
            var expresion = JSON.parse(tagDetail.Expression);
            //  console.log(expresion);
            var aspects = angular.copy(aspectForCalculatedTag);
            //  console.log(expresion);
            angular.forEach(expresion.mapping, function (exp, key) {
                //  console.log(key);
                tagIds.push(exp.tagId);
                var asp = aspectNameMap[exp.aspect] + '(' + key + ')';
                aspectForCalculatedTagLabels.push(asp);
                aspectForCalculatedTag.push(aspectNameMap[exp.aspect]);
                vm.ifNullsForCalculatedTags[key] = exp.ifNull === null || exp.ifNull === undefined ? 'No Value' : exp.ifNull;
            });
            aspectForCalculatedTagLabels.push('TagId');
            aspectForCalculatedTag.push('TagId');
            //  console.log(vm.ifNullsForCalculatedTags);
            //  console.log(tagIds);
            var tagPromises = getReportReducedResults(tagIds);
            //  console.log(tagPromises);

            $q.all(tagPromises)
                .then(function (promiseValues) {
                    vm.tagData = promiseValues;
                    //  console.log(vm.tagData);
                    if (vm.tagData.length == tagPromises.length) {
                        vm.tagResult(4);
                    }
                });
        }

        function getReportReducedResults(tagIds) {
            var promises = tagIds.map(function (id) {
                var deferred = $q.defer();
                msApi.request('tagresult@query', {
                    id: id
                }, function (response) {
                    deferred.resolve(response);
                }, function (err) {
                    console.log('error', err);
                });
                return deferred.promise;
            });
            return promises;
        }

        function getTotalizerFlag(tagDetail) {
            if (tagDetail.ResetTotalizerAt || tagDetail.MinutesPerFlowMeasurement) {
                return true;
            }
            else {
                return false;
            }
        }

        // function to remove the totalizer rad aspect from the array if totalizer flag is false
        // means that its not a totalizer
        function getDataTableColumns(flag, redAspects) {
            if (flag) {
                return redAspects;
            }
            else {
                return redAspects.filter(function (aspect) {
                    if (aspect !== 'Totalizer') {
                        //  console.log(aspect);
                        return aspect;
                    }
                });
            }
        }
        // totalizer flag stuff ends here


        vm.gotoHelp = gotoHelp;

        function gotoHelp(app) {
            console.log('help');
            if (app == 'tagDetails') {
                window.open("https://docs.google.com/document/d/19L414PkngoiHVhZBzR9VbjxCZ73_4A-ZDy3L4WvwUHk/edit#heading=h.pcb6q5h4f7c3", 'HTML', 'height=600,width=800');
            }
            else {
                return
            }
        };

        // where used dialog
        function openUsedOnDialog(ev, value) {
            $mdDialog.show({
                controller: 'usedOnController',
                controllerAs: 'vm',
                templateUrl: 'app/main/tag/dialogs/used-on/used-on-dialog.html',
                parent: angular.element($document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    Value: value,
                    event: ev,
                    parentVm: vm
                },
                // scope: $scope,
                onRemoving: function () {}

            });
        }
    }
})();
