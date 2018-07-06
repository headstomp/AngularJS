(function () {
    'use strict';
    
    angular
    .module('app.importerdetail')
    .controller('editImporterTagController', editImporterTagController);
    
    /** @ngInject */
    function editImporterTagController($mdDialog, Value, parentVm, event, msApi, moment, $scope, $danApi) {
        var index = parentVm.tagSet.indexOf(Value);
        
        console.log(index);
        
        console.log('parentVm', parentVm);
        console.log('Value', Value);
        var vm = this;
        //vm.active='DCS';
        vm.showDCS = false;
        vm.showFlow = false;
        vm.showNormal = false;
        vm.dataChanged = false;
        vm.disableSpecialProperties = parentVm.disableSpecialProperties;
        
        vm.makeNormal = function () {
            if (vm.isNotTotalizer == true) {
                vm.isNotTotalizer = false;
            }
            vm.showDCS = false;
            vm.showFlow = false;
            vm.active = null;
        }
        
        vm.makeTotalizer = function (name) {
            if (name == 'DCS') {
                if (!vm.showDCS) {
                    vm.showDCS = true;
                    vm.showFlow = false;
                    
                }
                vm.value.ResetTotalizerAt = new Date(1970, 1, 1, 0, 0, 0);
                vm.value.MinutesPerFlowMeasurement = null;
                vm.active = 'DCS';
                
                vm.dataChanged = true;
            } else if (name == 'flow') {
                if (!vm.showFlow) {
                    vm.showFlow = true;
                    vm.showDCS = false;
                }
                vm.value.ResetTotalizerAt = null;
                vm.active = 'flow';
                vm.dataChanged = true;
                
            } else if (name == 'normal') {
                vm.dataChanged = true;
                vm.showFlow = false;
                vm.showDCS = false;
                vm.value.ResetTotalizerAt = null;
                vm.value.MinutesPerFlowMeasurement = null;
                vm.active = 'normal';
                console.log('normal', vm.value);
            }
        }
        vm.title = 'Edit Value';
        vm.value = angular.copy(Value);
        initialCheck(vm.value);
        vm.saveTagDetails = saveTagDetails;
        vm.closeDialog = closeDialog;
        
        function initialCheck(tagObj) {
            
            if (tagObj.ResetTotalizerAt) {
                console.log('tag is DCS');
                var time = tagObj.ResetTotalizerAt.split(':');
                var hh = time[0];
                var mm = time[1];
                var ss = time[2];
                tagObj.ResetTotalizerAt = new Date(1970, 1, 1, hh, mm, ss);
                vm.active = 'DCS';
                vm.showDCS = true;
            } else if (tagObj.MinutesPerFlowMeasurement) {
                console.log('tag is flow');
                vm.active = 'flow'
                    vm.showFlow = true;
            } else {
                console.log('tag is normal');
                vm.active = 'normal'
            }
            
        }
        
        vm.saveTagDetails = saveTagDetails;
        vm.closeDialog = closeDialog;
        
        //////////
        //set time and is totlizer flag
        
        
        /**
         * Save value
         */
        function saveTagDetails(dataForUpdate) {
            var data = angular.copy(dataForUpdate);
            parentVm.tagDetailflagChanged = true;
            parentVm.tagSet[index] = data;
            console.log('tagData', data);
            if (data.ResetTotalizerAt == null) {
                postData(data);
            } else {
                
                var changedTime = data.ResetTotalizerAt;
                //  console.log('time',moment(changedTime).format("HH:mm:ss"));
                data.ResetTotalizerAt = moment(changedTime).format("HH:mm:ss");
                postData(data);
            }
            
            closeDialog();
        }
        
        function postData(data) {
            msApi.request('saveTagDetails@update', data,
                function (response) {
                console.log('success in edit controller posting data', response);
                vm.value = data;
                parentVm = vm.value;
            },
                function (err) {
                console.log('error in edit dialog, response', err);
            });
        }
        
        /**
         * Close dialog
         */
        function closeDialog() {
            $mdDialog.hide();
        }
    }
})();
