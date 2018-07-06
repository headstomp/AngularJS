(function () {
    //'use strict';

    angular
        .module('app.arcReport')
        .controller('reportTableController', reportTableController);
    angular
        .module('app.arcReport')
        .service('commonDataService', function () {
            return new(function commonDataService() {
                this.data = [];
            })
        });

    /** @ngInject */

    /** @ngInject */
    function reportTableController(DesignDataServiceForArcReport, DesignDetailServiceForArcReport, commonDataService, commonService) {

        var vm = this;
        console.log(commonService);
        // var aspectMap = {
        //     'LastValue': 'ShowLastValue',
        //     'Maximum': 'ShowMaximum',
        //     'Minimum': 'ShowMinimum',
        //     'Range': 'ShowRange',
        //     'StandardDeviation': 'ShowStandardDeviation',
        //     'Total': 'ShowTotal',
        //     'Totalizer': 'ShowTotalizer',
        //     'Value': 'ShowValue',
        //     'Variance': 'ShowVariance',
        //     'WeightdAverage': 'ShowWeightedAverage',
        //     'Average': 'ShowAverage',
        //     'Count': 'ShowCount'
        // }
        //console.log(DesignDataServiceForDemo);
        console.log(DesignDetailServiceForArcReport);
        vm.designDetail = DesignDetailServiceForArcReport;

        vm.arcReportTagDataDTOptions = {
            // f = search

            dom: 'rt<"bottom"<"left"<"buttons"B><"length"l>><"right"<"info"i><"pagination"p>>>',
            buttons: [
                'copy',
                'print',
                'pdf', {
                    text: 'Excel',
                    key: '1',
                    action: function (e, dt, node, config) {
                        window.location.assign($scope.BASE_URL + '/Report/' + vm.designdetail.Id + '/Excel');
                    }
                }
            ],
            pagingType: 'simple',
            pageLength: 20,
            lengthMenu: [
                [10, 20, 50, 100, -1],
                [10, 20, 50, 100, "All"]
            ],
            autoWidth: false,
            responsive: false,
            order: [
                [0, "desc"]
            ]
        };



        //vm.aspectMapForTable = [];
        vm.columns = {};
        vm.aspect = [];
        vm.tagNames = []; // array to collect table heading and colspan
        columns = [];
        var index = 0;
        angular.forEach(vm.designDetail.ReportDataItemSet, function (value, key) {
            //console.log(value);
            if (value.ShowLastValue == true) {
                columns.push('LastValue');
                vm.aspect.push('LastValue');
            }
            if (value.ShowValue == true) {
                columns.push('Value');
                vm.aspect.push('Value');
            }
            if (value.ShowWeightedAverage == true) {
                columns.push('WeightedAverage');
                vm.aspect.push('WeightedAverage');
            }
            if (value.ShowAverage == true) {
                columns.push('Average');
                vm.aspect.push('Average');
            }
            if (value.ShowMinimum == true) {
                columns.push('Minimum');
                vm.aspect.push('Minimum');
            }
            if (value.ShowMaximum == true) {
                columns.push('Maximum');
                vm.aspect.push('Maximum');
            }
            if (value.ShowTotal == true) {
                columns.push('Total');
                vm.aspect.push('Total');
            }
            if (value.ShowCount == true) {
                columns.push('Count');
                vm.aspect.push('Count');
            }
            if (value.ShowRange == true) {
                columns.push('Range');
                vm.aspect.push('Range');
            }
            if (value.ShowVariance == true) {
                columns.push('Variance');
                vm.aspect.push('Variance');
            }
            if (value.ShowStandardDeviation == true) {
                columns.push('StandardDeviation');
                vm.aspect.push('StandardDeviation');
            }
            if (value.ShowTotalizer == true) {
                columns.push('Totalizer');
                vm.aspect.push('Totalizer');
            }
            vm.columns[index] = columns;
            var tempObj = {
                name: value.Tag.Name,
                count: columns.length
            };
            vm.tagNames.push(tempObj);
            tempObj = {};
            columns = [];
            index++;
            //console.log(vm.tagNames);
            //console.log()
            //var name = value.Tag.Name;
            //  vm.aspectMapForTable.push(columns);
            //  columns = [];
            //name = [];


        })
        //console.log(vm.columns);
        if (!_.isEmpty(DesignDataServiceForArcReport['1'])) {
            DesignDataServiceForArcReport['1'].then(function (data) {
                commonDataService.data = data;
                vm.designData = data;
                console.log(vm.designData);
                vm.designTableData = {};
                angular.forEach(vm.designData, function (objValue, date) {
                    if (date == '$type' || date == '$promise' || date == '$resolved') {
                        return;
                    }
                    var counter = 0;
                    var index = 0;
                    vm.designTableData[date] = {};
                    angular.forEach(objValue, function (obj, key) {

                        var number = _.size(vm.columns[counter]);
                        //console.log(number.length);
                        for (var i = 0; i < number; i++) {
                            //console.log(vm.columns[counter][i]);
                            vm.designTableData[date][index] = obj[vm.columns[counter][i]]

                            if (number > 1) {
                                index++;
                            }
                        }
                        //index--;
                        if (number <= 1) {
                            index++;
                        }
                        counter++;
                    });
                    //    console.log('new');
                    //  console.log(vm.designTableData);
                    commonDataService.data = vm.designTableData
                });

            });
        }






    }



})();
