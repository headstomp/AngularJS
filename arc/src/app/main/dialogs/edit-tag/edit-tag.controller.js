(function () {
    'use strict';

    angular
        .module('app.tagdetail')
        .controller('editTagController', editTagController);

    /** @ngInject */
    function editTagController($mdDialog, Value, parentVm, event, msApi, moment, $scope) {
        var vm = _.merge(this, {
            title: 'Edit Value',
            value: angular.copy(Value),

            showDCS: false,
            showFlow: false,
            showNormal: false,
            dataChanged: false,
            disableSpecialProperties: parentVm.disableSpecialProperties,
            bucketId: parentVm.bucketId,

            makeNormal: makeNormal,
            makeTotalizer: makeTotalizer,

            saveTagDetails: saveTagDetails,
            closeDialog: closeDialog,

            commentService: {},
        });
        vm.oldValue = angular.copy(vm.value);
        initialCheck(vm.value);

        console.log(vm.value);
        console.log("vm.disableSpecialProperties", vm.disableSpecialProperties)
        if (vm.value.DataLocationId == 2 || vm.value.TagTypeId == 8) {
            console.log('setting true');
            vm.disableSpecialProperties = true;
        }
        else {
            console.log('setting false');
            vm.disableSpecialProperties = false;
        }

        function makeNormal() {
            if (vm.isNotTotalizer == true) {
                vm.isNotTotalizer = false;
            }
            vm.showDCS = false;
            vm.showFlow = false;
            vm.active = null;
        }

        function makeTotalizer(name) {
            if (name == 'DCS') {
                if (!vm.showDCS) {
                    vm.showDCS = true;
                    vm.showFlow = false;
                }
                vm.value.ResetTotalizerAt = new Date(1970, 1, 1, 0, 0, 0);
                vm.value.MinutesPerFlowMeasurement = null;
                vm.active = 'DCS';

                vm.dataChanged = true;
            }
            else if (name == 'flow') {
                if (!vm.showFlow) {
                    vm.showFlow = true;
                    vm.showDCS = false;
                }
                vm.value.ResetTotalizerAt = null;
                vm.active = 'flow';
                vm.dataChanged = true;

            }
            else if (name == 'normal') {
                vm.dataChanged = true;
                vm.showFlow = false;
                vm.showDCS = false;
                vm.value.ResetTotalizerAt = null;
                vm.value.MinutesPerFlowMeasurement = null;
                vm.active = 'normal';
                console.log('normal', vm.value);
            }
        }

        function initialCheck(tagObj) {

            if (tagObj.ResetTotalizerAt) {
                console.log('tag is DCS');
                console.log(tagObj.ResetTotalizerAt);
                var time = tagObj.ResetTotalizerAt.split(':');
                var hh = time[0];
                var mm = time[1];
                var ss = time[2];
                tagObj.ResetTotalizerAt = new Date(1970, 1, 1, hh, mm, ss);
                vm.active = 'DCS';
                vm.showDCS = true;
            }
            else if (tagObj.MinutesPerFlowMeasurement) {
                console.log('tag is flow');
                vm.active = 'flow'
                vm.showFlow = true;
            }
            else {
                console.log('tag is normal');
                vm.active = 'normal'
            }

        }

        /**
         * Save value
         */
        function saveTagDetails(dataForUpdate) {
            var data = angular.copy(dataForUpdate);
            console.log(data);
            if (data.ResetTotalizerAt) {
                data.ResetTotalizerAt = moment(data.ResetTotalizerAt)
                    .format("HH:mm:ss");
            }
            msApi.request('saveTagDetails@update', data, function (response) {
                parentVm.tagDetailflagChanged = true;
                vm.commentService.save({
                    TagId: data.Id,
                    CommentTypeId: 4,
                });
                msApi.request('tagdetail@get', {
                    id: data.Id
                }, function (response) {
                    console.log(response);
                    data = response;
                    closeDialog(data);
                });
            }, function (error) {
                console.log(error);
            });

        }

        /**
         * Close dialog
         */
        function closeDialog(data) {
            if (parentVm.tagDetailflagChanged) {
                //parentVm.tagDetailflagChanged = false;
                $mdDialog.hide(data);

            }
            else {
                $mdDialog.hide(vm.oldValue);
            }

        }
    }
})();
