(function () {
    'use strict';
    angular
        .module('app.arcReport', ['highcharts-ng'])
        .config(config);

    /** @ngInject */
    function config($urlRouterProvider, $stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {

        $stateProvider.state('app.arcReport.tableData', {
                url: '/table/:id',
                views: {
                    'tableData@app.arcReport': {
                        templateUrl: 'app/main/arc-report/partials/report-table/reportTable.html',
                        controller: 'reportTableController as vm'
                    }
                },
                resolve: {
                    DesignDataServiceForArcReport: function ($stateParams, DesignDataService, DesignDetailServiceForArcReport) {
                        var data = [];

                        if ($stateParams.id == -1) {
                            return {
                                '1': data,
                                '2': DesignDetailServiceForArcReport
                            }
                        }
                        else {
                            var reportId = parseInt($stateParams.id);
                            //console.log(DesignDataService.getDesignData(212, -1, reportId === 1007 ? 1000 : 100));
                            data = DesignDataService.getDesignData($stateParams.id, -1, reportId === 1007 ? 1000 : 100)
                            return {
                                '1': data,
                                '2': DesignDetailServiceForArcReport
                            }
                        }

                        // var reportId = parseInt($stateParams.id);
                        // //console.log(DesignDataService.getDesignData(212, -1, reportId === 1007 ? 1000 : 100));
                        // data = DesignDataService.getDesignData(1150, -1, reportId === 1007 ? 1000 : 100)
                        // return {
                        //     '1': data,
                        //     '2': DesignDetailServiceForArcReport
                        // }

                    }
                }

            })
            .state('app.arcReport', {
                url: '/arcReport/:id',
                //abstarct: true,
                views: {
                    'content@app': {
                        templateUrl: 'app/main/arc-report/arcReport.html',
                        controller: 'arcReportController as vm'

                    },
                    'metaData@app.arcReport': {
                        templateUrl: 'app/main/arc-report/partials/header/header.html',
                        controller: 'headerController as vm'
                    },
                    'detail@app.arcReport': {
                        templateUrl: 'app/main/arc-report/partials/detail/detail.html',
                        controller: 'detailController as vm'
                    },
                    'reportTagList@app.arcReport': {
                        templateUrl: 'app/main/arc-report/partials/reportTagList/reportTagList.html',
                        controller: 'reportTagListController as vm'
                    },

                },
                resolve: {
                    DesignDetailServiceForArcReport: function (DesignDetailService, $stateParams) {

                        if ($stateParams.id === '-1') {
                            var empty = {
                                "BucketType": null,
                                "BucketTypeId": 1,
                                "DaveExportId": null,
                                "DeletedAt": null,
                                "EndAt": moment(), //moment()
                                "ExtendData": false,
                                "GapFillMethodId": 4,
                                "Id": "-1",
                                "IsBucketed": false,
                                "IsActive": true,
                                "LabelPeriodStart": false,
                                "LocationId": null,
                                "LongDescription": "",
                                "Name": "",
                                "Owner": "",
                                "Precision": 2,
                                "QvReload": "Never",
                                "ReportDataItemSet": [],
                                "ReportOffsetOption": null,
                                "ReportOffsetUnit": null,
                                "ReportRange": null,
                                "ReportRangeId": 2,
                                "RollingEndOffset": 0,
                                "RollingEndOffsetOptionId": 1,
                                "RollingOffsetUnitId": 5,
                                "RollingStartOffset": 0,
                                "RollingStartOffsetOptionId": 1,
                                "ShortDescription": null,
                                "StartAt": moment(),
                                "IsPublished": false,
                                "IsHorizontal": false,
                                "ShowDetail": false,
                                "ShowQvdCsv": false,
                                "ShowSummary": false,
                                "ShowSummaryAverage": false,
                                "ShowSummaryVariance": false,
                                "ShowSummaryStandardDeviation": false,
                                "ShowSummaryCount": false,
                                "ShowSummaryLastValue": false,
                                "ShowSummaryMaximum": false,
                                "ShowSummaryMinimum": false,
                                "ShowSummaryRange": false,
                                "ShowSummaryTotal": false,
                                "ShowSummaryTotalizer": false,
                                "ShowSummaryWeightedAverage": false,
                                "ShowTable": true,
                            };

                            return empty
                        }
                        else {
                            //  console.log(DesignDetailService.getDesignDetail('212'))
                            return DesignDetailService.getDesignDetail($stateParams.id);

                        }
                    },
                    user: function (userDetails) {
                        return userDetails.getUser();
                    }

                }
            })

            .state('app.arcReport.liveData', {
                url: '/live/:id',
                views: {
                    'live@app.arcReport': {
                        templateUrl: 'app/main/arc-report/partials/live/reportLive.html',
                        controller: 'reportLiveController as vm'
                    }
                },
                resolve: {
                    LiveDataServiceForArcReport: function (DesignDataService, DesignDetailServiceForArcReport, $stateParams) {
                        var data = [];
                        if ($stateParams == -1) {
                            return {
                                '1': data,
                                '2': DesignDetailServiceForArcReport
                            }
                        }
                        else {
                            var reportId = parseInt($stateParams.id);
                            //console.log(DesignDataService.getLiveDesignData(reportId));
                            // //console.log(DesignDataService.getDesignData(212, -1, reportId === 1007 ? 1000 : 100));
                            data = DesignDataService.getLiveDesignData(reportId);

                            return {
                                '1': data,
                                '2': DesignDetailServiceForArcReport
                            }
                        }
                    }
                }
            })
            .state('app.arcReport.chart', {
                url: '/chart',
                views: {
                    'chart@app.arcReport': {
                        templateUrl: 'app/main/arc-report/partials/chart/reportChart.html',
                        controller: 'reportChartController as vm'
                    }
                },
                resolve: {
                    ChartDataServiceForArcReport: function (DesignDataService, DesignDetailServiceForArcReport, commonDataService, $stateParams) {
                        var data = [];
                        if ($stateParams == -1) {
                            return {
                                '1': data,
                                '2': DesignDetailServiceForArcReport
                            }
                        }
                        else {
                            var reportId = parseInt($stateParams.id);
                            // //console.log(DesignDataService.getDesignData(212, -1, reportId === 1007 ? 1000 : 100));
                            var data = DesignDataService.getDesignData($stateParams.id, -1, reportId === 1007 ? 1000 : 100)
                            return {
                                '1': data,
                                '2': DesignDetailServiceForArcReport
                            }
                        }


                    }
                }
            });

        msApiProvider.register('getLiveData', ['/ReportResult/Live/:id',
            {
                id: '@Id',
            },
            {
                get: {
                    method: 'GET',
                    params: {
                        /* Defaults if any ex. (getByDate: true) */
                    }
                }
            }
        ]);



        msApiProvider.register('designDetail', ['/Report/:id']);

        msApiProvider.register('designData', ['/ReportResult/:id/', {
            pageCount: '@pageCount',
            pageIndex: '@pageIndex',
        }, {
            get: {
                method: 'get',
                params: {
                    pageCount: 100,
                    pageIndex: -1,
                },
            },
        }, ]);

        msApiProvider.register('designDetailUpdate', ['/Report',
            {},
            {
                update: {
                    method: 'PUT',
                    params: {
                        /* Defaults if any ex. (getByDate: true) */
                    }
                },
                post: {
                    method: 'POST',
                    params: {
                        id: '-1',
                        /* Defaults if any ex. (getByDate: true) */
                    }
                },
                del: {
                    method: 'DELETE',
                    params: {
                        /* Defaults if any ex. (getByDate: true) */
                    }
                }
            }
        ]);



    } // config function closing



})();
