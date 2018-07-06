(function () {

    angular
        .module('app.comments')
        .controller('commmentsController', commmentsController);

    function commmentsController(arcCommentService, $danApi, $qb, $scope, $mdDialog, $stateParams) {

        var vm = _.merge(this, {
            moment: moment,

            limitIndex: 0,
            limitCount: 20,

            commentService: {},
            commentSet: [],

            filter: {
                TagId: parseInt($stateParams.tagId),
            },
            tagFilter: {},


            tagId: 0,
            groupId: 0,
            dateTime: 0,

            clearTagFilter: clearTagFilter,

            refresh: refresh,

            saveComment: function () {
                vm.commentService.save({
                    TagId: vm.tagId,
                    GroupId: vm.groupId,
                    DateTime: vm.dateTime,
                });
            },

            pageBack: function () {
                vm.limitIndex = Math.max(0, vm.limitIndex - 1);
            },
            pageNext: function () {
                vm.limitIndex++;
            },


            showCommentReportsDialog: showCommentReportsDialog,
        });


        console.log($stateParams);
        console.log(vm.tagFilter);

        if (vm.filter.TagId) {
            $danApi.getTagById({
                    id: vm.filter.TagId,
                })
                .then(function (response) {
                    vm.tagFilter.Name = response.data.Name;
                });
        }



        $scope.$watch('vm.filter', function () {
            vm.limitIndex = 0;
            refresh();
        }, true);
        $scope.$watch('vm.tagFilter', getTagSet, true);

        $scope.$watchGroup([
            'vm.limitIndex',
            'vm.limitCount',
        ], function () {
            refresh();
        });

        refresh();
        refreshMeta();

        function getTagSet() {
            var whereSet = [];
            if (vm.tagFilter.Name) {
                whereSet.push($qb.where.contains("Name", $qb.as.string(vm.tagFilter.Name)));
            }
            var query = {
                $type: 'Gfsa.Arc.Api.ArcService.Query, Gfsa.Arc.Api',
                Where: $qb.where.all(whereSet),
                Limit: {
                    $type: 'Gfsa.Arc.Api.ArcService.PageLimit, Gfsa.Arc.Api',
                    Index: 0,
                    Count: 50,
                },
            };

            $danApi.selectTagSetByQuery({
                    query: query,
                })
                .then(function (response) {
                    //  console.log(response.data);
                    vm.tagSet = response.data;
                });

        }

        function clearTagFilter() {
            vm.tagFilter = {};
            vm.filter.TagId = undefined;
        }

        function refresh() {

            var whereSet = [];

            if (vm.filter.CommentTypeId !== undefined) whereSet.push($qb.where.equalTo('CommentTypeId', $qb.as.int64(vm.filter.CommentTypeId)));
            if (vm.filter.TagId) whereSet.push($qb.where.equalTo('TagId', $qb.as.int64(vm.filter.TagId)));
            if (vm.filter.CreatedBy) whereSet.push($qb.where.contains('CreatedBy', $qb.as.string(vm.filter.CreatedBy)));
            if (vm.filter.Value) whereSet.push($qb.where.contains('Value', $qb.as.string(vm.filter.Value)));

            if (vm.filter.StartOn && vm.filter.EndOn) {
                whereSet.push($qb.where.all([
                    $qb.where.greaterThanEqualTo('DateTime', $qb.as.dateTime(vm.filter.StartOn)),
                    $qb.where.lessThanEqualTo('DateTime', $qb.as.dateTime(vm.filter.EndOn)),
                ]));
            }
            else {
                if (vm.filter.StartOn) whereSet.push($qb.where.greaterThanEqualTo('DateTime', $qb.as.dateTime(vm.filter.StartOn)));
                if (vm.filter.EndOn) whereSet.push($qb.where.greaterThanEqualTo('DateTime', $qb.as.dateTime(vm.filter.EndOn)));
            }

            var query = {
                $type: 'Gfsa.Arc.Api.ArcService.Query, Gfsa.Arc.Api',
                Where: $qb.where.all(whereSet),
                Limit: {
                    $type: 'Gfsa.Arc.Api.ArcService.PageLimit, Gfsa.Arc.Api',
                    Index: vm.limitIndex,
                    Count: vm.limitCount,
                },
            };

            console.log(query);

            $danApi.selectCommentSetByQuery({
                    query: query,
                })
                .then(function (response) {
                    vm.commentSet = response.data;
                });
        }

        function refreshMeta() {
            var query = {
                $type: 'Gfsa.Arc.Api.ArcService.Query, Gfsa.Arc.Api',
                Where: $qb.where.equalTo('CommentTypeId', $qb.as.int64(4)),
                Order: null,
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
                    vm.commentSetMeta = response.data;
                    console.log('Meta', vm.commentSetMeta);
                });
        }


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
                        id: comment.TagId
                        //dateTime: comment.DateTime
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

        vm.gotoHelp = gotoHelp;
        function gotoHelp (app) {
            console.log('help');
            if (app == 'comments') {
                window.open("https://docs.google.com/document/d/19L414PkngoiHVhZBzR9VbjxCZ73_4A-ZDy3L4WvwUHk/edit#heading=h.k25dgi5j2jpi", 'HTML', 'height=600,width=800');
            } else {
                return
            }
        };


    }

})();
