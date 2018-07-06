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
        .module('app.tagdetail', ['highcharts-ng'])
        .component('dtTagDetail', {
            //transclude: true,
            templateUrl: 'app/main/tag/views/tagdetail/tableComponent.html',
            // require: {
            //     parentCtrl: '^^tagdetailController'
            // },
            bindings: {
                aspects: '<',
                data: '<',
                meta: '<'

            },
            controllerAs: 'vm',
            controller: function ($scope, $timeout, $element, $mdDialog, $danApi, $document) {
                var vm = this;
                vm.dtInstance = {};
                vm.refreshComments = refreshComments;
                vm.openEditTagValueDialog = openEditTagValueDialog;
                vm.deleteTagValue = deleteTagValue;
                if (vm.meta.tagType != 'rawlive') {
                    vm.refreshComments(vm.meta.bucketId);
                }

                vm.commentCounts = {};
                //console.log('onrefresh', vm.onrefresh);
                //console.log('$scope', $scope.$parent.vm.refreshTagResults);
                vm.refresh = $scope.$parent.vm.refreshTagResults;
                //console.log(vm.refresh);
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
                vm.dtInstanceCallback = dtInstanceCallback;

                function dtInstanceCallback(dtInstance) {
                    vm.dtInstance = dtInstance;
                    //  console.log(vm.dtInstance);
                }
                this.$onInit = function () {
                    //  this.aspects = [];
                    //  this.data = [];
                    return;
                }
                this.$onChanges = function (changesObj) {
                    console.log('changesObj', changesObj);
                    vm.refreshComments(vm.meta.bucketId);
                    if (changesObj.aspects && changesObj.data && changesObj.tagDetail) {
                        $timeout(function () {
                            if (changesObj.aspects != null && this) {
                                this.aspects = changesObj.aspects;

                            }
                            if (changesObj.aspects != null && this) {
                                this.data = changesObj.data;
                            }

                            this.chartype = changesObj.chartype;
                            this.meta = changesObj.meta;
                            //vm.refreshComments(this.meta.bucketId);
                            vm.dtInstance.rerender();
                        }, 3000);
                    }
                }


                vm.showCommentPrompt = function (ev, val, key) {

                    console.log(val, key);

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
                                    BucketTypeId: vm.meta.bucketId,
                                },
                            },
                        })
                        .finally(function () {
                            console.log('yes i am dialog');
                            vm.refreshComments(vm.meta.bucketId);

                        });

                };



                function refreshComments(bucketTypeId) {
                    console.log('refresh comments', bucketTypeId);
                    vm.commentCounts = {};
                    var tagId = vm.meta.tagDetail.Id;
                    $danApi.selectCommentSetByTagId({
                            tagId: tagId
                        })
                        .then(function (response) {
                            vm.commentCounts = {};
                            if (vm.meta.tagDetail.DataLocationId == 4) {
                                angular.forEach(vm.data, function (resultSet) {
                                    var arr = _.filter(response.data, function (o) {
                                        //console.log(resultSet);
                                        if (o.CommentTypeId != 4) {
                                            var dateFromResultSet = resultSet.DateTime; // to make comparison
                                            var dateTime = getCommentDateTimeSubtracted(o.DateTime, true, bucketTypeId);
                                            var dateTime1 = roundDateTimeByBucket(dateTime, bucketTypeId);
                                            var dateFromApi = moment(dateTime1)
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
                                angular.forEach(vm.data, function (resultSet) {
                                    var arr = _.filter(response.data, function (o) {
                                        return o.GroupId == resultSet.GroupId
                                    })
                                    if (arr.length > 0) {
                                        vm.commentCounts[resultSet.GroupId] = arr.length;
                                    }
                                });
                            }
                        });
                }

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
                                console.log('$scope', vm);
                                vm.refresh(value.TagId);
                            }, 2000);
                        });
                }

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
                                vm.refresh(dataForUpdate.TagId);
                            }, 2000);
                        });;
                }
            } // controller close bracket
        })
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider) {
        // State
        $stateProvider.state('app.tagdetail', {
            url: '/detail/:id',
            views: {
                'content@app': {
                    templateUrl: 'app/main/tag/views/tagdetail/tagdetail.html',
                    controller: 'tagdetailController as vm'
                }
            },
            resolve: {
                TagDetailService: function ($stateParams, TagDetailService) {
                    return TagDetailService.getTagDetail($stateParams.id);
                },
                tagData: function ($stateParams, TagResultService) {
                    return TagResultService.getTagResult($stateParams.id);
                }



            }
        });

        // Test
        msApiProvider.register('tagdata', ['app/data/tag/tagdata/2.json']);

        // get tag details
        msApiProvider.register('tagdetail', ['/Tag/:id']);

        // get tag results
        msApiProvider.register('tagresult', ['/TagReducedResult/:id',
            {
                id: '@Id',
            },
            {
                query: {
                    method: 'get',
                    params: {
                        /* Defaults if any ex. (getByDate: true) */
                    }
                }
            }
        ]);

        // get tag results live
        msApiProvider.register('tagresultLive', ['/TagReducedResult/Live/:id',
            {
                id: '@Id',
            },
            {
                query: {
                    method: 'get',
                    params: {
                        /* Defaults if any ex. (getByDate: true) */
                    }
                }
            }
        ]);

        // get report list
        msApiProvider.register('reportlist', ['/Report/Tag/:id',
            {
                id: '@Id',
            },

        ]);

        // update report details
        msApiProvider.register('editValue', ['/ReportResult/NonReducedReportResult',
            {},
            {
                update: {
                    method: 'POST',
                    params: {
                        /* Defaults if any ex. (getByDate: true) */
                    }
                }
            }
        ]);

        msApiProvider.register('deleteValue', ['/ReportResult/NonReducedReportResult/Tag/:tagId/Group/:groupId',
            {
                tagId: '@tagId',
                groupId: '@groupId',
            },
            {
                delete: {
                    method: 'DELETE',
                    params: {},
                }
            }
        ]);


        // update tag details
        msApiProvider.register('saveTagDetails', ['/Tag',
            {},
            {
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
            }
        ]);
    }
})();
