(function () {
    //'use strict';
    angular
        .module('app.design')
        .controller('makeCalculatedTag', makeCalculatedTag);

    function makeCalculatedTag($scope, $mdDialog, $danApi, $document, $qb, reportDataItem, reportDesignDetail, userDetails) {

        var vm = _.merge(this, {
            reportDataItem: reportDataItem,
            reportDesignDetail: reportDesignDetail,
        });

        vm.expressionIsValid = false;
        vm.calculatedTagDetail = {};
        vm.saveCalculatedTagDetail = saveCalculatedTagDetail;

        vm.closeDialog = closeDialog;
        vm.closePrompt = closePrompt;
        vm.closeEditDialog = closeEditDialog;

        // console.log(Value);
        // console.log(parentVm.designdetail.ReportDataItemSet);

        vm.calculatedTagDetail.QuickGenerateEndAt = moment()
            .startOf('day')
            .format();
        vm.calculatedTagDetail.TotalGenerateStartAt = moment()
            .subtract(5, 'years')
            .startOf('year')
            .format();

        $scope.$watch('vm.calculatedTagDetail.TagSource', function () {
            vm.calculatedTagDetail.TagSourceId = vm.calculatedTagDetail.TagSource.Id;
            vm.calculatedTagDetail.LocationId = vm.calculatedTagDetail.TagSource.LocationId;
        });

        prepopulateTagSource();

        function prepopulateTagSource() {
            userDetails.getUser()
                .then(function (user) {
                    var locationId = user.LocationId;
                    console.log(locationId);
                    var locationIdToTagSourceId = {
                        5: 352,
                        2: 359,
                        6: 360,
                        0: 361,
                        1: 365,
                        0: 366,
                        3: 368,
                    };
                    var tagSourceId = 361;
                    if (locationId in locationIdToTagSourceId) {
                        tagSourceId = locationIdToTagSourceId[locationId];
                    }
                    $danApi.getTagSourceById({
                            id: tagSourceId
                        })
                        .then(function (response) {
                            vm.calculatedTagDetail.TagSource = response.data;
                        });
                });
        }



        function saveCalculatedTagDetail() {
            $danApi.createCalculatedTag({
                    calculatedTagDetail: vm.calculatedTagDetail
                })
                .then(function (response) {
                    vm.closeDialog(response.data);
                });
        }

        function closeDialog(data) {
            $mdDialog.hide(data);

        }

        vm.tagSourceWhereSet = [
            $qb.where.contains('Name', $qb.as.string('calc')),
            $qb.where.equalTo('DataLocationId', $qb.as.int64(4)),
        ];

        function closeEditDialog(ev) {
            var confirm = $mdDialog.confirm({
                title: 'Attention',
                parent: $document.find('#design'),
                textContent: 'Please drag the tag Properly to calculate',
                ariaLabel: 'Please drag the tag Properly to calculate',
                targetEvent: ev,
                clickOutsideToClose: true,
                escapeToClose: true,
                ok: 'Ok',
                multiple: true,
            })
            $mdDialog.show(confirm)
                .then(function () {
                    vm.closeDialog(false);
                });

        }

        function closePrompt(ev) {
            var confirm = $mdDialog.confirm({
                title: 'close Calculation Dialog',
                parent: $document.find('#design'),
                textContent: 'Are you sure want to close claculation dialog?',
                ariaLabel: 'close Calculation Dialog',
                targetEvent: ev,
                clickOutsideToClose: true,
                escapeToClose: true,
                ok: 'Remove',
                cancel: 'Cancel',
                multiple: true,
            })
            $mdDialog.show(confirm)
                .then(function () {
                    vm.closeDialog(false);
                });

        }

        vm.gotoHelp = gotoHelp;

        function gotoHelp(app) {
            console.log('help');
            if (app == 'calc') {
                window.open("https://docs.google.com/document/d/19L414PkngoiHVhZBzR9VbjxCZ73_4A-ZDy3L4WvwUHk/edit#heading=h.39o6b1op5yb0", 'HTML', 'height=600,width=800');
            }
            else {
                return
            }
        };
    }

})();
