(function () {

    function getCommentDateTimeAdded(dateTime, isLabelPeriodStart, bucketTypeId) {
        dateTime = moment(dateTime);
        if (isLabelPeriodStart) {
            switch (bucketTypeId) {
                case 4: // 10m
                    return dateTime.add(10, 'minutes')
                        .format();
                case 5: // 30m
                    return dateTime.add(30, 'minutes')
                        .format();
                case 6: // 60m
                    return dateTime.add(60, 'minutes')
                        .format();
                case 7: // 12h
                    return dateTime.add(12, 'hours')
                        .format();
                case 8: // 24h
                    return dateTime.add(24, 'hours')
                        .format();
            }
        }
        console.log(dateTime.format());
        return dateTime.format();
    }

    function getCommentDateTimeSubtracted(dateTime, isLabelPeriodStart, bucketTypeId) {
        console.log('datetime in function ', dateTime);
        dateTime = moment(dateTime);
        if (isLabelPeriodStart) {
            console.log('isLabelPeriodStart', isLabelPeriodStart)
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
        console.log(dateTime.format());
        return dateTime.format();
    }

    function roundDateTimeByBucket(dateTime, bucketTypeId) {
        dateTime = moment(dateTime);
        //console.log(bucketTypeId);
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
        console.log(dateTime.format());
        return dateTime.format();
    }

    'use strict';

    angular
        .module('app.design')
        .controller('valueCommentController', valueCommentController);

    function valueCommentController($mdDialog, msApi, $danApi) {
        var vm = _.merge(this, {
            comments: [],
            commentService: {},
            saveComment: saveComment,
            closeDialog: closeDialog,
        });

        console.log(vm);
        console.log(vm.dateTime);

        loadCommentSet();
        getTagDetail();

        console.log(vm.reportDesignDetail);

        var isLabelPeriodStart = !!vm.reportDesignDetail.LabelPeriodStart;
        var bucketTypeId = vm.reportDesignDetail.BucketTypeId;

        console.log(bucketTypeId);
        console.log(isLabelPeriodStart);

        function getTagDetail() {
            msApi.request('tagdetail@get', {
                id: vm.value.TagId
            }, function (response) {
                vm.title = 'Add New Comment On Tag ' + response.Name;
            }, function (response) {});
        }

        function saveComment() {

            var commentData = {
                TagId: vm.value.TagId,
                GroupId: vm.value.GroupId,
                DateTime: getCommentDateTimeAdded(vm.dateTime, isLabelPeriodStart, bucketTypeId),
                CommentTypeId: 5,
            };
            console.log(bucketTypeId);
            console.log(vm.dateTime);
            console.log(commentData);
            vm.commentService.save(commentData)
                .then(function (response) {
                    vm.commentService.clear();
                    closeDialog();
                });
        }

        function loadCommentSet() {
            $danApi.selectCommentSetByTagId({
                    tagId: vm.value.TagId
                })
                .then(function (response) {
                    console.log(response.data);
                    vm.comments = _(response.data)
                        .filter(function (comment) {
                            return comment.CommentTypeId > 0 && comment.CommentTypeId != 4;
                        })
                        .map(function (comment) {
                            console.log('before', comment.DateTime);
                            comment.DateTime = getCommentDateTimeSubtracted(comment.DateTime, isLabelPeriodStart, bucketTypeId);
                            console.log('after', comment.DateTime);
                            return comment;
                        })
                        .filter(function (comment) {
                            if (bucketTypeId === 1) {
                                return comment.GroupId == vm.value.GroupId;
                            }
                            return moment(vm.dateTime)
                                .utc()
                                .format() == moment(comment.DateTime)
                                .utc()
                                .format();
                        })
                        .value();
                    console.log(vm.comments);
                });
        }

        function closeDialog() {
            $mdDialog.hide();
        }

        vm.gotoHelp = gotoHelp;

        function gotoHelp(app) {
            console.log('help');
            if (app == 'comments') {
                window.open("https://docs.google.com/document/d/19L414PkngoiHVhZBzR9VbjxCZ73_4A-ZDy3L4WvwUHk/edit#heading=h.k25dgi5j2jpi", 'HTML', 'height=600,width=800');
            }
            else {
                return
            }
        };
    }
})();
