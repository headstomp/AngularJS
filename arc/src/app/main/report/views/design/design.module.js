(function () {
    'use strict';

    angular
        .module('app.design', ['rzModule', 'ngFileSaver', 'highcharts-ng'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider, moment) {
        $stateProvider
            // Design
            .state('app.design', {
                url: '/design/:id?:sourceId&:display',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/report/views/design/design.html',
                        controller: 'designController as vm'
                    }
                },
                resolve: {
                    user: function (userDetails) {
                        return userDetails.getUser();
                    },
                    routeFrom: function ($stateParams) {
                        if ($stateParams.sourceId) {
                            //return $stateParams.sourceId;
                            return $stateParams.sourceId
                        }
                        else {
                            return 'new'
                        }
                    },
                    DesignDetailService: function ($stateParams, DesignDetailService) {
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
                            return DesignDetailService.getDesignDetail($stateParams.id);
                        }
                    },
                    DesignDataService: function ($stateParams, DesignDataService) {
                        if ($stateParams.id === '-1') {
                            var empty = {};
                            return empty;
                        }
                        else {
                            var reportId = parseInt($stateParams.id);
                            return DesignDataService.getDesignData($stateParams.id, -1, reportId === 1007 ? 1000 : 100);
                        }
                    }
                    // ,
                    // AllComments: function($stateParams,commentService){
                    //   return commentService.getComment()
                    // }
                }
            });

        //Test Data
        //    msApiProvider.register('taglistReport', [arcStubAPI + '/tag/taglist.json']);
        //    msApiProvider.register('designDetail', [arcStubAPI + '/report/designdetail/:id.json']);
        //    msApiProvider.register('designData', [arcStubAPI + '/report/designdata/:id.json']);

        // Live
        msApiProvider.register('designDetail', ['/Report/:id']);
        //msApiProvider.register('designData', ['/ReportResult/:id/?pageCount=100']);


        // get data
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

        // get data live
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

        // get importlist
        msApiProvider.register('designImporterlist', ['/TagSource?pageIndex=0&pageCount=500',
            {},
            {
                get: {
                    method: 'get',
                    params: {
                        /* Defaults if any ex. (getByDate: true) */
                    }
                }
            }
        ]);



        // update report details
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

        // update tag values
        msApiProvider.register('editValue', ['/ReportResult/NonReduced',
            {},
            {
                update: {
                    method: 'POST',
                    params: {
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

        // dupe report
        msApiProvider.register('dupeReport', ['/Report/Clone/:id',
            {
                id: '@Id',
            },
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
                        /* Defaults if any ex. (getByDate: true) */
                    }
                }
            }
        ]);

        // delete report details
        msApiProvider.register('designDetailDelete', ['/Report/:id',
            {
                id: '@Id',
            },
            {
                del: {
                    method: 'DELETE',
                    params: {
                        /* Defaults if any ex. (getByDate: true) */
                    }
                }
            }
        ]);

        // get tag results
        msApiProvider.register('tagresult', ['/TagReducedResult/:id',
            {
                id: '@Id',
            },
            {
                query: {
                    method: 'query',
                    params: {
                        /* Defaults if any ex. (getByDate: true) */
                    }
                }
            }
        ]);

        msApiProvider.register('tagReducedData', ['/ReportResult/NonReducedReportResult', {},
            {
                update: {
                    method: 'PUT',
                },
                create: {
                    method: 'POST'
                }
            }
        ]);


        // update tag details
        msApiProvider.register('saveTagDetails', ['/Tag', {}, {
            update: {
                method: 'PUT',
                params: {
                    /* Defaults if any ex. (getByDate: true) */
                }
            },
            del: {
                method: 'DELETE',
                params: {
                    /* Defaults if any ex. (getByDate: true) */
                }
            }
        }]);

        //Download Excel file
        msApiProvider.register('downloadExcel', ['/Report/:id/Excel',
            {
                id: '@Id'
            },
            {
                responseType: "blob"
            },
            {
                get: {
                    method: 'GET',
                }
            }
        ]);

        msApiProvider.register('getComment', ['/Comment',
            {},
            {
                get: {
                    method: 'GET',
                    isArray: true,
                },

                getQuery: {
                    method: 'GET',
                    params: {

                    }

                }
            }
        ]);

        msApiProvider.register('getCommentByQuery', ['/Comment/Query',
            {},
            {
                get: {
                    method: 'GET',
                },
            }
        ]);

        msApiProvider.register('getCommentByTagId', ['/Comment/:tagId',
            {
                tagId: '@TagId',
            },
            {
                get: {
                    method: 'GET',
                    isArray: true
                },
            }
        ]);

        msApiProvider.register('getCommentByTagIdDateTime', ['/Comment/Reduced/:tagId/:dateTime',
            {
                tagId: '@TagId',
                dateTime: '@DateTime'
            },
            {
                get: {
                    method: 'GET',
                    isArray: true
                },
            }
        ]);

        msApiProvider.register('getCommentByTagIdGroupId', ['/Comment/:tagId/:groupId',
            {
                tagId: '@TagId',
                groupId: '@GroupId'
            },
            {
                get: {
                    method: 'GET',
                    isArray: true
                },
            }
        ]);

        msApiProvider.register('saveComment', ['/comment',
            {},
            {
                post: {
                    method: 'POST',
                    params: {

                    }
                },

            }
        ]);

        msApiProvider.register('tagdetail', ['/Tag/:id']);
    }
})();
