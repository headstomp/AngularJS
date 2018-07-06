(function () {
    'use strict';
    
    angular
    .module('app.importerdetail')
    .controller('deleteValueController', deleteValueController);
    
    /** @ngInject */
    function deleteValueController($mdDialog, Value, parentVm, event, msApi, moment, $scope, $danApi) {
        var vm = _.merge(this, {
                commentService: {},
            });
        
        console.log(Value);
        
        // Data
        vm.title = 'Delete Value';
        vm.value = angular.copy(Value);
        
        // Methods
        vm.deleteValue = deleteValue;
        vm.closeDialog = closeDialog;
        
        function deleteValue(dataForUpdate) {
            if (parentVm.hasOwnProperty('nonreducedTagValueChanged')) {
                parentVm.nonreducedTagValueChanged = true;
            }
            
            $danApi.deleteNonReducedReportResultSetByTagIdAndGroupId({
                tagId: dataForUpdate.TagId,
                groupId: dataForUpdate.GroupId,
            })
            .then(function () {
                console.log('values deleted');
                vm.commentService.save({
                    TagId: Value.TagId,
                    GroupId: Value.GroupId,
                    CommentTypeId: 1,
                    DateTime: Value.DateTime,
                })
                .then(function () {
                    console.log('Saved comment');
                    closeDialog();
                });
            }, function () {
                // TODO: not sure
            });
        }
        
        function closeDialog() {
            $mdDialog.hide();
        }
    }
})();
