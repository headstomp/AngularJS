
(function () {

    angular.module('app.core').provider('$danApi', function $danApiProvider () {

        function buildUrlData(url, params) {
            unused = _.clone(params);
            url = url.replace(/{([^{}/]+)}/g, function (match, name) {
                if (name in params) {
                    delete unused[name];
                    return params[name];
                }
                
                return match; 
            });
            return {
                url: url,
                query: unused,
            };
        }

        var logging = true;
        var baseUrl = null;

        this.setLogging = function (newLogging) {
            logging = newLogging;
        }

        this.setBaseUrl = function (newBaseUrl) {
            baseUrl = newBaseUrl;
        };

        this.getBaseUrl = function () {
            return baseUrl;
        };

        this.$get = function $danApiFactory ($log, $http, $q) {

            return new (function $danApi () {

                this.getDataTableQueryResults = function (params) {
                    logging && $log.info('Invoking "GET@ArcTagSources"');
                    var data = {};
                    var urlData = buildUrlData('ArcTagSources', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@ArcTagSources"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@ArcTagSources"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.getDataTableQueryResults = function (params) {
                    logging && $log.info('Invoking "GET@ArcReports"');
                    var data = {};
                    var urlData = buildUrlData('ArcReports', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@ArcReports"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@ArcReports"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.getApplicationEnums = function (params) {
                    logging && $log.info('Invoking "GET@SqlRunningQueries/ApplicationEnum"');
                    var data = {};
                    var urlData = buildUrlData('SqlRunningQueries/ApplicationEnum', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@SqlRunningQueries/ApplicationEnum"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@SqlRunningQueries/ApplicationEnum"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.getRunningBlocksDataTableQueryResults = function (params) {
                    logging && $log.info('Invoking "GET@SqlRunningQueries"');
                    var data = {};
                    var urlData = buildUrlData('SqlRunningQueries', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@SqlRunningQueries"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@SqlRunningQueries"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.killSqlSession = function (params) {
                    logging && $log.info('Invoking "DELETE@SqlRunningQueries/Kill/{id}"');
                    var data = {};
                    var urlData = buildUrlData('SqlRunningQueries/Kill/{id}', params);
                    return $http({
                        method: 'DELETE',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "DELETE@SqlRunningQueries/Kill/{id}"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "DELETE@SqlRunningQueries/Kill/{id}"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.getApplicationEnums = function (params) {
                    logging && $log.info('Invoking "GET@SqlSessions/ApplicationEnum"');
                    var data = {};
                    var urlData = buildUrlData('SqlSessions/ApplicationEnum', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@SqlSessions/ApplicationEnum"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@SqlSessions/ApplicationEnum"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.getDataTableQueryResults = function (params) {
                    logging && $log.info('Invoking "GET@SqlSessions"');
                    var data = {};
                    var urlData = buildUrlData('SqlSessions', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@SqlSessions"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@SqlSessions"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.killSqlSession = function (params) {
                    logging && $log.info('Invoking "DELETE@SqlSessions/Kill/{id}"');
                    var data = {};
                    var urlData = buildUrlData('SqlSessions/Kill/{id}', params);
                    return $http({
                        method: 'DELETE',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "DELETE@SqlSessions/Kill/{id}"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "DELETE@SqlSessions/Kill/{id}"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.getDataTableQueryResults = function (params) {
                    logging && $log.info('Invoking "GET@ArcTags"');
                    var data = {};
                    var urlData = buildUrlData('ArcTags', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@ArcTags"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@ArcTags"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.getBucketTypeSet = function (params) {
                    logging && $log.info('Invoking "GET@BucketType"');
                    var data = {};
                    var urlData = buildUrlData('BucketType', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@BucketType"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@BucketType"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.getExciseReportResults = function (params) {
                    logging && $log.info('Invoking "GET@Excise"');
                    var data = {};
                    var urlData = buildUrlData('Excise', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@Excise"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@Excise"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.getFile = function (params) {
                    logging && $log.info('Invoking "GET@File/{hash}"');
                    var data = {};
                    var urlData = buildUrlData('File/{hash}', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@File/{hash}"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@File/{hash}"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.getGapFillMethodSet = function (params) {
                    logging && $log.info('Invoking "GET@GapFillMethod"');
                    var data = {};
                    var urlData = buildUrlData('GapFillMethod', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@GapFillMethod"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@GapFillMethod"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.createIssue = function (params) {
                    logging && $log.info('Invoking "POST@Issue"');
                    var data = {};
                    var urlData = buildUrlData('Issue', params);
                    return $http({
                        method: 'POST',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "POST@Issue"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "POST@Issue"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.getIssueSet = function (params) {
                    logging && $log.info('Invoking "GET@Issue"');
                    var data = {};
                    var urlData = buildUrlData('Issue', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@Issue"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@Issue"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.getIssueSetAsHtml = function (params) {
                    logging && $log.info('Invoking "GET@Issue/Html"');
                    var data = {};
                    var urlData = buildUrlData('Issue/Html', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@Issue/Html"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@Issue/Html"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.getLocationSet = function (params) {
                    logging && $log.info('Invoking "GET@Location"');
                    var data = {};
                    var urlData = buildUrlData('Location', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@Location"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@Location"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.selectLocationSetByQuery = function (params) {
                    logging && $log.info('Invoking "POST@Location/Query"');
                    var data = {};
                    var urlData = buildUrlData('Location/Query', params);
                    data = urlData.query['query'];
                    delete urlData.query['query'];
                    return $http({
                        method: 'POST',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "POST@Location/Query"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "POST@Location/Query"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.selectEmptyQueryObjectMap = function (params) {
                    logging && $log.info('Invoking "GET@Meta/QueryObjectMap"');
                    var data = {};
                    var urlData = buildUrlData('Meta/QueryObjectMap', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@Meta/QueryObjectMap"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@Meta/QueryObjectMap"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.getPavillionStatusSet = function (params) {
                    logging && $log.info('Invoking "GET@Pavillion"');
                    var data = {};
                    var urlData = buildUrlData('Pavillion', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@Pavillion"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@Pavillion"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.downloadReportLiveExcelByReportId = function (params) {
                    logging && $log.info('Invoking "GET@Report/{reportId}/Excel/Live"');
                    var data = {};
                    var urlData = buildUrlData('Report/{reportId}/Excel/Live', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@Report/{reportId}/Excel/Live"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@Report/{reportId}/Excel/Live"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.downloadReportReducedExcelByReportId = function (params) {
                    logging && $log.info('Invoking "GET@Report/{reportId}/Excel"');
                    var data = {};
                    var urlData = buildUrlData('Report/{reportId}/Excel', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@Report/{reportId}/Excel"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@Report/{reportId}/Excel"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.cloneById = function (params) {
                    logging && $log.info('Invoking "POST@Report/Clone/{id}"');
                    var data = {};
                    var urlData = buildUrlData('Report/Clone/{id}', params);
                    return $http({
                        method: 'POST',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "POST@Report/Clone/{id}"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "POST@Report/Clone/{id}"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.createReport = function (params) {
                    logging && $log.info('Invoking "POST@Report"');
                    var data = {};
                    var urlData = buildUrlData('Report', params);
                    data = urlData.query['report'];
                    delete urlData.query['report'];
                    return $http({
                        method: 'POST',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "POST@Report"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "POST@Report"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.deleteReportById = function (params) {
                    logging && $log.info('Invoking "DELETE@Report/{id}"');
                    var data = {};
                    var urlData = buildUrlData('Report/{id}', params);
                    return $http({
                        method: 'DELETE',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "DELETE@Report/{id}"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "DELETE@Report/{id}"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.getEmptyReport = function (params) {
                    logging && $log.info('Invoking "GET@Report/Empty"');
                    var data = {};
                    var urlData = buildUrlData('Report/Empty', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@Report/Empty"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@Report/Empty"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.getReportById = function (params) {
                    logging && $log.info('Invoking "GET@Report/{id}"');
                    var data = {};
                    var urlData = buildUrlData('Report/{id}', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@Report/{id}"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@Report/{id}"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.getReportSet = function (params) {
                    logging && $log.info('Invoking "GET@Report"');
                    var data = {};
                    var urlData = buildUrlData('Report', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@Report"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@Report"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.getReportSetAsHtml = function (params) {
                    logging && $log.info('Invoking "GET@Report/Html"');
                    var data = {};
                    var urlData = buildUrlData('Report/Html', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@Report/Html"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@Report/Html"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.getReportSetByTagId = function (params) {
                    logging && $log.info('Invoking "GET@Report/Tag/{tagId}"');
                    var data = {};
                    var urlData = buildUrlData('Report/Tag/{tagId}', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@Report/Tag/{tagId}"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@Report/Tag/{tagId}"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.getReportSetStripped = function (params) {
                    logging && $log.info('Invoking "GET@Report/Stripped"');
                    var data = {};
                    var urlData = buildUrlData('Report/Stripped', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@Report/Stripped"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@Report/Stripped"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.qvdReloadByTagSourceId = function (params) {
                    logging && $log.info('Invoking "POST@Report/{reportId}/QvdReload"');
                    var data = {};
                    var urlData = buildUrlData('Report/{reportId}/QvdReload', params);
                    return $http({
                        method: 'POST',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "POST@Report/{reportId}/QvdReload"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "POST@Report/{reportId}/QvdReload"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.updateReport = function (params) {
                    logging && $log.info('Invoking "PUT@Report"');
                    var data = {};
                    var urlData = buildUrlData('Report', params);
                    data = urlData.query['report'];
                    delete urlData.query['report'];
                    return $http({
                        method: 'PUT',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "PUT@Report"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "PUT@Report"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.selectReportSetByQuery = function (params) {
                    logging && $log.info('Invoking "POST@Report/Query"');
                    var data = {};
                    var urlData = buildUrlData('Report/Query', params);
                    data = urlData.query['query'];
                    delete urlData.query['query'];
                    return $http({
                        method: 'POST',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "POST@Report/Query"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "POST@Report/Query"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.getReportOffsetOptionSet = function (params) {
                    logging && $log.info('Invoking "GET@ReportOffsetOption"');
                    var data = {};
                    var urlData = buildUrlData('ReportOffsetOption', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@ReportOffsetOption"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@ReportOffsetOption"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.getReportOffsetUnitSet = function (params) {
                    logging && $log.info('Invoking "GET@ReportOffsetUnit"');
                    var data = {};
                    var urlData = buildUrlData('ReportOffsetUnit', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@ReportOffsetUnit"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@ReportOffsetUnit"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.getReportRangeSet = function (params) {
                    logging && $log.info('Invoking "GET@ReportRange"');
                    var data = {};
                    var urlData = buildUrlData('ReportRange', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@ReportRange"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@ReportRange"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.createComment = function (params) {
                    logging && $log.info('Invoking "POST@Comment"');
                    var data = {};
                    var urlData = buildUrlData('Comment', params);
                    data = urlData.query['commentNonReducedReportResult'];
                    delete urlData.query['commentNonReducedReportResult'];
                    return $http({
                        method: 'POST',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "POST@Comment"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "POST@Comment"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.selectCommentSet = function (params) {
                    logging && $log.info('Invoking "GET@Comment"');
                    var data = {};
                    var urlData = buildUrlData('Comment', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@Comment"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@Comment"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.selectCommentSetByQuery = function (params) {
                    logging && $log.info('Invoking "POST@Comment/Query"');
                    var data = {};
                    var urlData = buildUrlData('Comment/Query', params);
                    data = urlData.query['query'];
                    delete urlData.query['query'];
                    return $http({
                        method: 'POST',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "POST@Comment/Query"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "POST@Comment/Query"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.selectCommentSetByTagId = function (params) {
                    logging && $log.info('Invoking "GET@Comment/{tagId}"');
                    var data = {};
                    var urlData = buildUrlData('Comment/{tagId}', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@Comment/{tagId}"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@Comment/{tagId}"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.selectCommentSetByTagIdAndDateTime = function (params) {
                    logging && $log.info('Invoking "GET@Comment/Reduced/{tagId}/{dateTime}"');
                    var data = {};
                    var urlData = buildUrlData('Comment/Reduced/{tagId}/{dateTime}', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@Comment/Reduced/{tagId}/{dateTime}"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@Comment/Reduced/{tagId}/{dateTime}"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.selectCommentSetByTagIdAndDateTimeByQuery = function (params) {
                    logging && $log.info('Invoking "POST@Comment/Reduced/{tagId}/{dateTime}/Query"');
                    var data = {};
                    var urlData = buildUrlData('Comment/Reduced/{tagId}/{dateTime}/Query', params);
                    data = urlData.query['query'];
                    delete urlData.query['query'];
                    return $http({
                        method: 'POST',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "POST@Comment/Reduced/{tagId}/{dateTime}/Query"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "POST@Comment/Reduced/{tagId}/{dateTime}/Query"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.selectCommentSetByTagIdAndGroupId = function (params) {
                    logging && $log.info('Invoking "GET@Comment/{tagId}/{groupId}"');
                    var data = {};
                    var urlData = buildUrlData('Comment/{tagId}/{groupId}', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@Comment/{tagId}/{groupId}"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@Comment/{tagId}/{groupId}"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.selectCommentSetByTagIdAndGroupIdByQuery = function (params) {
                    logging && $log.info('Invoking "POST@Comment/{tagId}/{groupId}/Query"');
                    var data = {};
                    var urlData = buildUrlData('Comment/{tagId}/{groupId}/Query', params);
                    data = urlData.query['query'];
                    delete urlData.query['query'];
                    return $http({
                        method: 'POST',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "POST@Comment/{tagId}/{groupId}/Query"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "POST@Comment/{tagId}/{groupId}/Query"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.selectCommentSetByTagIdByQuery = function (params) {
                    logging && $log.info('Invoking "POST@Comment/{tagId}/Query"');
                    var data = {};
                    var urlData = buildUrlData('Comment/{tagId}/Query', params);
                    data = urlData.query['query'];
                    delete urlData.query['query'];
                    return $http({
                        method: 'POST',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "POST@Comment/{tagId}/Query"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "POST@Comment/{tagId}/Query"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.selectTagSetTest = function (params) {
                    logging && $log.info('Invoking "GET@TagTest"');
                    var data = {};
                    var urlData = buildUrlData('TagTest', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@TagTest"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@TagTest"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.getLiveTagRawResultSetByTagId = function (params) {
                    logging && $log.info('Invoking "GET@TagReducedResult/Live/{tagId}"');
                    var data = {};
                    var urlData = buildUrlData('TagReducedResult/Live/{tagId}', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@TagReducedResult/Live/{tagId}"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@TagReducedResult/Live/{tagId}"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.getTagReducedResultSetByTagId = function (params) {
                    logging && $log.info('Invoking "GET@TagReducedResult/{tagId}"');
                    var data = {};
                    var urlData = buildUrlData('TagReducedResult/{tagId}', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@TagReducedResult/{tagId}"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@TagReducedResult/{tagId}"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.createOrUpdateNonReducedReportResult = function (params) {
                    logging && $log.info('Invoking "POST@ReportResult/NonReducedReportResult"');
                    var data = {};
                    var urlData = buildUrlData('ReportResult/NonReducedReportResult', params);
                    data = urlData.query['reportResultSet'];
                    delete urlData.query['reportResultSet'];
                    return $http({
                        method: 'POST',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "POST@ReportResult/NonReducedReportResult"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "POST@ReportResult/NonReducedReportResult"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.createOrUpdateNonReducedReportResultSet = function (params) {
                    logging && $log.info('Invoking "POST@ReportResult/NonReducedReportResultSet"');
                    var data = {};
                    var urlData = buildUrlData('ReportResult/NonReducedReportResultSet', params);
                    data = urlData.query['reportResultSet'];
                    delete urlData.query['reportResultSet'];
                    return $http({
                        method: 'POST',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "POST@ReportResult/NonReducedReportResultSet"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "POST@ReportResult/NonReducedReportResultSet"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.deleteNonReducedReportResult = function (params) {
                    logging && $log.info('Invoking "DELETE@ReportResult/NonReducedReportResult"');
                    var data = {};
                    var urlData = buildUrlData('ReportResult/NonReducedReportResult', params);
                    data = urlData.query['reportResult'];
                    delete urlData.query['reportResult'];
                    return $http({
                        method: 'DELETE',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "DELETE@ReportResult/NonReducedReportResult"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "DELETE@ReportResult/NonReducedReportResult"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.deleteNonReducedReportResultSet = function (params) {
                    logging && $log.info('Invoking "DELETE@ReportResult/NonReducedReportResultSet"');
                    var data = {};
                    var urlData = buildUrlData('ReportResult/NonReducedReportResultSet', params);
                    data = urlData.query['reportResultSet'];
                    delete urlData.query['reportResultSet'];
                    return $http({
                        method: 'DELETE',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "DELETE@ReportResult/NonReducedReportResultSet"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "DELETE@ReportResult/NonReducedReportResultSet"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.deleteNonReducedReportResultSetByTagIdAndGroupId = function (params) {
                    logging && $log.info('Invoking "DELETE@ReportResult/NonReducedReportResult/Tag/{tagId}/Group/{groupId}"');
                    var data = {};
                    var urlData = buildUrlData('ReportResult/NonReducedReportResult/Tag/{tagId}/Group/{groupId}', params);
                    return $http({
                        method: 'DELETE',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "DELETE@ReportResult/NonReducedReportResult/Tag/{tagId}/Group/{groupId}"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "DELETE@ReportResult/NonReducedReportResult/Tag/{tagId}/Group/{groupId}"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.getEmptyNonReducedReportResult = function (params) {
                    logging && $log.info('Invoking "GET@ReportResult/NonReducedReportResult/Empty/{type}"');
                    var data = {};
                    var urlData = buildUrlData('ReportResult/NonReducedReportResult/Empty/{type}', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@ReportResult/NonReducedReportResult/Empty/{type}"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@ReportResult/NonReducedReportResult/Empty/{type}"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.getLiveReportResultSetByReportId = function (params) {
                    logging && $log.info('Invoking "GET@ReportResult/Live/{reportId}"');
                    var data = {};
                    var urlData = buildUrlData('ReportResult/Live/{reportId}', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@ReportResult/Live/{reportId}"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@ReportResult/Live/{reportId}"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.getReportResultSetByReportId = function (params) {
                    logging && $log.info('Invoking "GET@ReportResult/{reportId}"');
                    var data = {};
                    var urlData = buildUrlData('ReportResult/{reportId}', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@ReportResult/{reportId}"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@ReportResult/{reportId}"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    }); 
                };

                this.getReportResultSetByReportIdAsHtml = function (params) {
                    logging && $log.info('Invoking "GET@ReportResult/{reportId}/Html"');
                    var data = {};
                    var urlData = buildUrlData('ReportResult/{reportId}/Html', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@ReportResult/{reportId}/Html"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@ReportResult/{reportId}/Html"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.createCalculatedTag = function (params) {
                    logging && $log.info('Invoking "POST@Tag/Calculated"');
                    var data = {};
                    var urlData = buildUrlData('Tag/Calculated', params);
                    data = urlData.query['calculatedTagDetail'];
                    delete urlData.query['calculatedTagDetail'];
                    return $http({
                        method: 'POST',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "POST@Tag/Calculated"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "POST@Tag/Calculated"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.downloadTagLiveExcelByTagId = function (params) {
                    logging && $log.info('Invoking "GET@Tag/{tagId}/Excel/Live"');
                    var data = {};
                    var urlData = buildUrlData('Tag/{tagId}/Excel/Live', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@Tag/{tagId}/Excel/Live"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@Tag/{tagId}/Excel/Live"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.downloadTagReducedExcelByTagId = function (params) {
                    logging && $log.info('Invoking "GET@Tag/{tagId}/Excel"');
                    var data = {};
                    var urlData = buildUrlData('Tag/{tagId}/Excel', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@Tag/{tagId}/Excel"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@Tag/{tagId}/Excel"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.createTag = function (params) {
                    logging && $log.info('Invoking "POST@Tag"');
                    var data = {};
                    var urlData = buildUrlData('Tag', params);
                    data = urlData.query['tag'];
                    delete urlData.query['tag'];
                    return $http({
                        method: 'POST',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "POST@Tag"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "POST@Tag"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.deleteTagById = function (params) {
                    logging && $log.info('Invoking "DELETE@Tag/{id}"');
                    var data = {};
                    var urlData = buildUrlData('Tag/{id}', params);
                    return $http({
                        method: 'DELETE',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "DELETE@Tag/{id}"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "DELETE@Tag/{id}"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.downloadTagReportResultSetByTagId = function (params) {
                    logging && $log.info('Invoking "GET@Tag/{tagId}/ReportResult/Download"');
                    var data = {};
                    var urlData = buildUrlData('Tag/{tagId}/ReportResult/Download', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@Tag/{tagId}/ReportResult/Download"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@Tag/{tagId}/ReportResult/Download"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.getEmptyTag = function (params) {
                    logging && $log.info('Invoking "GET@Tag/Empty"');
                    var data = {};
                    var urlData = buildUrlData('Tag/Empty', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@Tag/Empty"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@Tag/Empty"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.getTagById = function (params) {
                    logging && $log.info('Invoking "GET@Tag/{id:long}"');
                    var data = {};
                    var urlData = buildUrlData('Tag/{id}', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@Tag/{id:long}"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@Tag/{id:long}"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.getTagByName = function (params) {
                    logging && $log.info('Invoking "GET@Tag"');
                    var data = {};
                    var urlData = buildUrlData('Tag', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@Tag"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@Tag"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.getTagLastValueById = function (params) {
                    logging && $log.info('Invoking "GET@Tag/LastValue/{id}"');
                    var data = {};
                    var urlData = buildUrlData('Tag/LastValue/{id}', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@Tag/LastValue/{id}"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@Tag/LastValue/{id}"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.getTagSet = function (params) {
                    logging && $log.info('Invoking "GET@Tag"');
                    var data = {};
                    var urlData = buildUrlData('Tag', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@Tag"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@Tag"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.getTagSetAsHtml = function (params) {
                    logging && $log.info('Invoking "GET@Tag/Html"');
                    var data = {};
                    var urlData = buildUrlData('Tag/Html', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@Tag/Html"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@Tag/Html"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.getTagSetByTagSourceId = function (params) {
                    logging && $log.info('Invoking "GET@Tag/TagSource/{tagSourceId}"');
                    var data = {};
                    var urlData = buildUrlData('Tag/TagSource/{tagSourceId}', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@Tag/TagSource/{tagSourceId}"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@Tag/TagSource/{tagSourceId}"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.getTagSetStripped = function (params) {
                    logging && $log.info('Invoking "GET@Tag/Stripped"');
                    var data = {};
                    var urlData = buildUrlData('Tag/Stripped', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@Tag/Stripped"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@Tag/Stripped"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.updateTag = function (params) {
                    logging && $log.info('Invoking "PUT@Tag"');
                    var data = {};
                    var urlData = buildUrlData('Tag', params);
                    data = urlData.query['tag'];
                    delete urlData.query['tag'];
                    return $http({
                        method: 'PUT',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "PUT@Tag"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "PUT@Tag"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.selectTagSetByQuery = function (params) {
                    logging && $log.info('Invoking "POST@Tag/Query"');
                    var data = {};
                    var urlData = buildUrlData('Tag/Query', params);
                    data = urlData.query['query'];
                    delete urlData.query['query'];
                    return $http({
                        method: 'POST',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "POST@Tag/Query"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "POST@Tag/Query"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.getNcpaData = function (params) {
                    logging && $log.info('Invoking "POST@Diagnostics/Ncpa"');
                    var data = {};
                    var urlData = buildUrlData('Diagnostics/Ncpa', params);
                    data = urlData.query['serverNameSet'];
                    delete urlData.query['serverNameSet'];
                    return $http({
                        method: 'POST',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "POST@Diagnostics/Ncpa"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "POST@Diagnostics/Ncpa"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.getTagSourceById = function (params) {
                    logging && $log.info('Invoking "GET@TagSource/{id}"');
                    var data = {};
                    var urlData = buildUrlData('TagSource/{id}', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@TagSource/{id}"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@TagSource/{id}"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.getTagSourceSet = function (params) {
                    logging && $log.info('Invoking "GET@TagSource"');
                    var data = {};
                    var urlData = buildUrlData('TagSource', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@TagSource"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@TagSource"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.getValueCount = function (params) {
                    logging && $log.info('Invoking "GET@TagSource/ValueCount"');
                    var data = {};
                    var urlData = buildUrlData('TagSource/ValueCount', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@TagSource/ValueCount"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@TagSource/ValueCount"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.qvdReloadByTagSourceId = function (params) {
                    logging && $log.info('Invoking "POST@TagSource/{tagSourceId}/QvdReload"');
                    var data = {};
                    var urlData = buildUrlData('TagSource/{tagSourceId}/QvdReload', params);
                    return $http({
                        method: 'POST',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "POST@TagSource/{tagSourceId}/QvdReload"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "POST@TagSource/{tagSourceId}/QvdReload"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.selectTagSourceSetByQuery = function (params) {
                    logging && $log.info('Invoking "POST@TagSource/Query"');
                    var data = {};
                    var urlData = buildUrlData('TagSource/Query', params);
                    data = urlData.query['query'];
                    delete urlData.query['query'];
                    return $http({
                        method: 'POST',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "POST@TagSource/Query"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "POST@TagSource/Query"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.createUser = function (params) {
                    logging && $log.info('Invoking "POST@User"');
                    var data = {};
                    var urlData = buildUrlData('User', params);
                    data = urlData.query['user'];
                    delete urlData.query['user'];
                    return $http({
                        method: 'POST',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "POST@User"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "POST@User"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.deleteUserById = function (params) {
                    logging && $log.info('Invoking "DELETE@User/{id}"');
                    var data = {};
                    var urlData = buildUrlData('User/{id}', params);
                    return $http({
                        method: 'DELETE',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "DELETE@User/{id}"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "DELETE@User/{id}"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.getCurrentUserName = function (params) {
                    logging && $log.info('Invoking "GET@User/Current"');
                    var data = {};
                    var urlData = buildUrlData('User/Current', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@User/Current"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@User/Current"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.getUserById = function (params) {
                    logging && $log.info('Invoking "GET@User/{id}"');
                    var data = {};
                    var urlData = buildUrlData('User/{id}', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@User/{id}"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@User/{id}"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.getUserSet = function (params) {
                    logging && $log.info('Invoking "GET@User"');
                    var data = {};
                    var urlData = buildUrlData('User', params);
                    return $http({
                        method: 'GET',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "GET@User"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "GET@User"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.updateReport = function (params) {
                    logging && $log.info('Invoking "PUT@User"');
                    var data = {};
                    var urlData = buildUrlData('User', params);
                    data = urlData.query['user'];
                    delete urlData.query['user'];
                    return $http({
                        method: 'PUT',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "PUT@User"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "PUT@User"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };

                this.selectUserSetByQuery = function (params) {
                    logging && $log.info('Invoking "POST@User/Query"');
                    var data = {};
                    var urlData = buildUrlData('User/Query', params);
                    data = urlData.query['query'];
                    delete urlData.query['query'];
                    return $http({
                        method: 'POST',
                        url: baseUrl + '/' + urlData.url,
                        data: data,
                        params: urlData.query,
                    }).then(function (response) {
                        logging && $log.info('Resolved "POST@User/Query"');
                        logging && $log.info(response);
                        return $q.resolve(response);
                    }, function (response) {
                        logging && $log.warn('Rejected "POST@User/Query"');
                        logging && $log.warn(response);
                        return $q.reject(response);
                    });
                };


            });

        };

    });
})();

