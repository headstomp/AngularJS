(function () {

    'use strict';

    angular.module('app.core').provider('arcCommentService', function arcCommentServiceProvider () {

        this.$get = function arcCommentServiceFactory ($danApi, $timeout) {

            return new (function arcCommentService() {
                var vm = _.merge(this, {
                    saveComment: saveComment,
                    getEmptyComment: getEmptyComment,
                });

                function saveComment(comment) {
                    console.log('Saving...');
                    console.log(comment);
                    return $danApi.createOrUpdateNonReducedReportResult({
                        reportResultSet: comment,
                    });
                }

                function getEmptyComment() {
                    return {
                        $type: 'Gfsa.Arc.Api.ArcService.CommentNonReducedReportResult, Gfsa.Arc.Api',
                        Id: 0,
                        TagId: 0,
                        AssociatedTagId: 0,
                        CommentTypeId: 0,
                        GroupId: '',
                        DateTime: moment().format(),
                        Value: null,
                        CreatedAt: moment().format(),
                        CreatedBy: null,
                        IsDeleted: false,
                    };
                }
            });

        };

    });

})();
