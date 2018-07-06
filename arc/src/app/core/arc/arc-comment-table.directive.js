(function () {

    'use strict';

    angular.module('app.core')
        .directive('arcCommentTable', function ($timeout) {

            return {
                restrict: 'E',
                scope: {
                    whereSet: '=',
                },
                bindToController: true,
                templateUrl: 'app/core/arc/arc-comment-table.html',
                controllerAs: 'vm',
                controller: function ($danApi, $qb, $scope, $mdDialog, $stateParams) {
                    var vm = _.merge(this, {
                        _: _,
                        whereSet: [],
                        moment: moment,
                        limitIndex: 0,
                        limitCount: 20,
                        commentSet: [],
                        refresh: refresh,
                        pageBack: function () {
                            vm.limitIndex = Math.max(0, vm.limitIndex - 1);
                        },
                        pageNext: function () {
                            vm.limitIndex++;
                        },
                    });



                    vm.showCommentReportsDialog = showCommentReportsDialog;

                    function showCommentReportsDialog(comment) {
                        var dialog = $mdDialog.show({
                            clickOutsideToClose: true,
                            locals: {
                                comment: comment,
                            },

                            controllerAs: 'vm',
                            templateUrl: 'app/main/comments/comment-reports.dialog.html',
                            controller: function (comment, msApi) {
                                console.log(comment);
                                var vm = _.merge(this, {
                                    reportSet: [],
                                    closeDialog: function () {
                                        $mdDialog.hide();
                                    },
                                });

                                msApi.request('reportlist@query', {
                                    id: comment.TagId,
                                    dateTime: comment.DateTime
                                }, function (reportSet) {
                                    //  console.log('fetching query');
                                    vm.reportSet = reportSet;
                                    console.log(vm.reportSet);
                                });
                            },
                        });

                        dialog.finally(function (result) {
                            console.log(result);
                        });
                    }


                    $scope.$watch('vm.whereSet', function () {
                        vm.limitIndex = 0;
                        refresh();
                    }, true);

                    $scope.$watchGroup([
                        'vm.limitIndex',
                        'vm.limitCount',
                    ], function () {
                        refresh();
                    });

                    refresh();

                    function refresh() {

                        var whereSet = [];

                        _.forEach(vm.whereSet, function (where) {
                            whereSet.push(where);
                        });

                        var query = {
                            $type: 'Gfsa.Arc.Api.ArcService.Query, Gfsa.Arc.Api',
                            Where: $qb.where.all(whereSet),
                            Limit: {
                                $type: 'Gfsa.Arc.Api.ArcService.PageLimit, Gfsa.Arc.Api',
                                Index: vm.limitIndex,
                                Count: vm.limitCount,
                            },
                        };
                        $danApi.selectCommentSetByQuery({
                                query: query,
                            })
                            .then(function (response) {
                                vm.commentSet = response.data;
                                console.log(vm.commentSet);
                            });
                    }
                },
            };

        });

})();
