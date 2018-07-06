(function () {
    'use strict';

    angular
        .module('app.importerdetail')
        .controller('editValueController', editValueController);

    /** @ngInject */
    function editValueController($mdDialog, Value, event, msApi, parentVm, $danApi) {
        var vm = _.merge(this, {
            title: 'Edit Value',
            value: angular.copy(Value),

            saveValue: saveValue,
            closeDialog: closeDialog,

            commentService: {},
        });

        /**
         * Save value
         */
        function saveValue(dataForUpdate) {
            if (parentVm.hasOwnProperty('nonreducedTagValueChanged')) {
                parentVm.nonreducedTagValueChanged = true;
            }
            $danApi.createOrUpdateNonReducedReportResultSet({
                    reportResultSet: [dataForUpdate]
                })
                .then(function () {
                    console.log('Saved value');
                    vm.commentService.save({
                            TagId: Value.TagId,
                            GroupId: Value.GroupId,
                            CommentTypeId: 3,
                            DateTime: Value.DateTime,
                        })
                        .then(function () {
                            console.log('Saved comment');
                            closeDialog();
                        });
                });
        }

        /**
         * Close dialog
         */
        function closeDialog() {

            $mdDialog.hide(parentVm.nonreducedTagValueChanged);
        }
    }
})();
