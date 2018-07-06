(function () {
    'use strict';
    
    angular
    .module('app.importerdetail')
    .controller('deactivateCalculatedTag', deactivateCalculatedTag);
    
    /** @ngInject */
    function deactivateCalculatedTag($mdDialog, $danApi) {
        var vm = _.merge(this, {
                // tag: angular.copy(vm.tag),
                isChecked: false,
                cancel: function () {
                    $mdDialog.hide(false);
                },
                remove: function () {
                    if (vm.isChecked) {
                        $danApi.deleteTagById({
                            id: vm.reportDataItem.Tag.Id
                        }).then(function () {
                            $mdDialog.hide(true);
                        });
                    } else {
                        $mdDialog.hide(true);
                    }
                },
            });
        console.log(vm);
    }
})();
