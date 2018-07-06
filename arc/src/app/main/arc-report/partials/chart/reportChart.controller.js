/// <reference path="reportChart.html" />
/// <reference path="reportChart.html" />
/// <reference path="reportChart.html" />
/// <reference path="reportChart.html" />
/// <reference path="reportChart.html" />
(function () {
    //'use strict';

    angular
        .module('app.arcReport')
        .directive('hcStockChartReport', function hcStockChartDirective() {
            return {
                restrict: 'E',
                template: '<div ng-cloak ></div>',
                scope: {
                    options: '<'
                },
                link: function ($scope, element) {
                    $scope.$watch("options", function (newValue, oldValue) {
                        $scope.options = newValue;
                        console.log($scope.options);
                        Highcharts.setOptions({
                            lang: {
                                downloadJPEG: 'JPEG',
                                downloadPDF: 'PDF'
                            }
                        });
                        Highcharts.stockChart(element[0], $scope.options ? $scope.options : {});
                    });
                }
            };
        });

    angular.module('app.arcReport')
        .directive('hcBarChartReport', function hcBarChartDirective() {
            return {
                restrict: 'E',
                template: '<div ng-cloak ></div>',
                scope: {
                    options: '<'
                },
                link: function ($scope, element) {
                    $scope.$watch("options", function (newValue, oldValue) {
                        $scope.options = newValue;
                        Highcharts.setOptions({
                            lang: {
                                downloadJPEG: 'JPEG',
                                downloadPDF: 'PDF'
                            }
                        });
                        Highcharts.chart(element[0], $scope.options ? $scope.options : {});
                    });
                }
            };
        });
    angular
        .module('app.arcReport')
        .controller('reportChartController', reportChartController);

    /** @ngInject */

    /** @ngInject */
    function reportChartController(ChartDataServiceForArcReport) {

        var vm = this;
        //console.log(ChartDataServiceForArcReport);
        var tempForLineChart = [];
        var tempForBarChart = [];
        var mainArrayLine = [];
        var mainArrayBar = [];
        vm.chartType = "line";



        vm.designDetail = ChartDataServiceForArcReport['2'];
        //console.log(vm.designDetail);
        vm.chartConfig = {};
        vm.chartConfig1 = {};

        vm.aspectsForChartData = [];
        var aspect = [];

        vm.aspectMap = {
            'LastValue': 'HeadingLastValue',
            'Value': "HeadingValue",
            'WeightdAverage': 'HeadingWeightedAverage',
            'Average': 'HeadingAverage',
            'Minimum': 'HeadingMinimum',
            'Maximum': 'HeadingMaximum',
            'Total': 'HeadingTotal',
            'Count': 'HeadingCount',
            'Range': 'HeadingRange',
            'Variance': 'HeadingVariance',
            'StandardDeviation': 'HeadingStandardDeviation',
            'Totalizer': 'HeadingTotalizer',
        };
        angular.forEach(vm.designDetail.ReportDataItemSet, function (value, key) {
            // console.log(value);
            if (value.ShowLastValue === true) {
                vm.aspectsForChartData.push(key + 1 + '-LastValue');
            }
            if (value.ShowValue === true) {
                vm.aspectsForChartData.push(key + 1 + '-Value');
            }
            if (value.ShowWeightedAverage === true) {
                vm.aspectsForChartData.push(key + 1 + '-WeightedAverage');
            }
            if (value.ShowAverage === true) {
                vm.aspectsForChartData.push(key + 1 + '-Average');
            }
            if (value.ShowMinimum === true) {
                vm.aspectsForChartData.push(key + 1 + '-Minimum');
            }
            if (value.ShowMaximum === true) {
                vm.aspectsForChartData.push(key + 1 + '-Maximum');
            }
            if (value.ShowTotal === true) {
                vm.aspectsForChartData.push(key + 1 + '-Total');
            }
            if (value.ShowCount === true) {
                vm.aspectsForChartData.push(key + 1 + '-Count');
            }
            if (value.ShowRange === true) {
                vm.aspectsForChartData.push(key + 1 + '-Range');
            }
            if (value.ShowVariance === true) {
                vm.aspectsForChartData.push(key + 1 + '-Variance');
            }
            if (value.ShowStandardDeviation === true) {
                vm.aspectsForChartData.push(key + 1 + '-StandardDeviation');
            }
            if (value.ShowTotalizer === true) {
                vm.aspectsForChartData.push(key + 1 + '-Totalizer');

            }

            //  console.log(vm.aspectsForChartData);
        });

        function getLegendNames(aspect, key) {
            var temp = aspect.split('-');
            var index = parseInt(temp[0]);
            //console.log(vm.designDetail.ReportDataItemSet[index - 1]);


            // ['1-Wavg']
            //  console.log(temp); //['1', Wavg]
            //temp[0]==1;.
            //console.log('aspect', temp);
            var tagName = vm.designDetail.ReportDataItemSet[index - 1].Tag.Name;

            var label = vm.designDetail.ReportDataItemSet[index - 1][vm.aspectMap[temp[1]]]; // temp[1]==WAvg
            if (label) {
                label = label.concat(" ", aspect);
                return label;
            }
            else {
                tagName = tagName.concat(" ", aspect);
                return tagName;
            }

        }

        var tempForLineChart = [];
        var tempForBarChart = [];
        var mainArrayLine = [];
        var mainArrayBar = [];
        vm.highChartsData = [];
        vm.barChartData = [];
        vm.tagNamesForCharts = [];
        vm.dateArrayForBar = [];
        vm.getMinMaxForYaxis = getMinMaxForYaxis;




        ChartDataServiceForArcReport['1'].then(function (data) {
            vm.chartData = data;
            var options = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',

            };

            var dateKeys = _.filter(_.keysIn(data), function (key) {
                return key.substring(0, 1) == "1" || key.substring(0, 1) == "2"
            });
            var index = 0;
            //console.log(vm.chartData);
            angular.forEach(vm.aspectsForChartData, function (aspect, aspNum) {
                vm.tagNamesForCharts.push(getLegendNames(aspect, aspect));

                var temp = aspect.split('-');
                var aspectIndex = parseInt(temp[0]);
                var asp = temp[1];
                for (var y = 0; y < dateKeys.length; y++) {
                    var d = new Date(dateKeys[y]);
                    vm.dateArrayForBar.push(d.toLocaleString('en-US', options));
                    if (vm.chartData[dateKeys[y]]) {
                        var aspValue = vm.chartData[dateKeys[y]];
                        var temp = (aspectIndex)
                            .toString();
                        //console.log(temp);

                        //console.log(d.toLocaleString('en-US', options));
                        tempForLineChart.push(Date.parse(d.toLocaleString('en-US', options)));
                        if (aspValue[temp][asp]) {
                            tempForLineChart.push(aspValue[temp][asp]);
                            tempForBarChart.push(aspValue[temp][asp]);
                        }
                        else {
                            tempForLineChart.push(null);
                            tempForBarChart.push(null);
                        }
                        mainArrayLine.push(tempForLineChart);
                        // mainArraybar.push(tempForLineBar);

                        tempForLineChart = [];
                        //tempForBarChart = [];

                    }
                }
                //console.log('new');
                var seriesData = {
                    data: mainArrayLine,
                    name: vm.tagNamesForCharts[index]
                };

                var barChartData = {
                    name: vm.tagNamesForCharts[index],
                    data: tempForBarChart
                };

                ++index;
                mainArrayLine = [];
                tempForBarChart = [];
                vm.highChartsData.push(seriesData);
                vm.barChartData.push(barChartData);

                //console.log(vm.highChartsData);


                if (vm.highChartsData.length == vm.aspectsForChartData.length) {
                    var minMaxForYaxis = getMinMaxForYaxis(vm.highChartsData);
                    console.log(minMaxForYaxis);
                    vm.chartConfig = {
                        credits: {
                            enabled: false
                        },
                        chart: {
                            height: 500,
                            width: 1200,
                            type: 'line',
                            colorCount: 32
                        },

                        title: {
                            text: vm.designDetail.Name
                        },
                        // rangeSelector: {
                        //     selected: 1
                        // },
                        legend: {
                            enabled: true,
                            layout: 'vertical',
                            align: 'right',
                            verticalAlign: 'top',
                            y: 100
                        },

                        yAxis: {
                            //max: minMaxForYaxis,
                            tickAmount: 8,
                            startOnTick: false,
                            endOnTick: true,
                            plotLines: [{
                                value: 0,
                                width: 3,
                                color: 'silver'
                            }]
                        },
                        plotOptions: {
                            series: {
                                //selected: true,
                                compare: 'value',
                                showInNavigator: true,
                                //showCheckbox: true,
                                connectNulls: true,
                                marker: {
                                    enabled: true
                                },
                                animation: {
                                    duration: 2000
                                },
                            },
                        },
                        tooltip: {
                            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.y})<br/>',
                            valueDecimals: 2,
                            split: true
                        },
                        series: vm.highChartsData,
                        xAxis: {},
                    };

                    vm.chartConfig1 = {
                        credits: {
                            enabled: false
                        },
                        chart: {
                            height: 500,
                            width: 1200,
                            type: 'column',
                            colorCount: 32
                        },
                        title: {
                            text: vm.designDetail.Name
                        },
                        rangeSelector: {
                            selected: 1
                        },
                        legend: {
                            enabled: true,
                            layout: 'vertical',
                            align: 'right',
                            verticalAlign: 'top',
                            y: 100
                        },

                        yAxis: {
                            min: 0,
                            labels: {
                                overflow: 'justify'
                            }
                        },
                        plotOptions: {
                            series: {
                                //  selected: true,
                                //  showCheckbox: true,
                                animation: {
                                    duration: 2000
                                },
                                // events: {
                                //     legendItemClick: function (event) {
                                //         event.preventDefault();
                                //     },
                                //     checkboxClick: function (event) {
                                //
                                //         if (event.checked) {
                                //             event.item.show()
                                //         }
                                //         else {
                                //             event.item.hide()
                                //         }
                                //     },
                                //     click: function (event) {
                                //         alert(this.name + ' clicked');
                                //     }
                                // }
                            }
                        },
                        tooltip: {
                            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
                            valueDecimals: 2,
                            split: true
                        },
                        series: vm.barChartData,
                        xAxis: {
                            categories: vm.dateArrayForBar,
                            crosshair: true
                        },
                    };
                }
            });
        }); // promise brace
        function getMinMaxForYaxis(chartData) {

            var counter = 0;
            var max = 0;
            var min = 0;
            var maxTemp = 0;
            angular.forEach(chartData, function (data) {
                //console.log(data.data);
                angular.forEach(data.data, function (arr) {
                    //console.log(arr);
                    if (typeof arr[1] === 'number') {
                        maxTemp = arr[1];
                        if (maxTemp > max) {
                            max = maxTemp;
                        }

                    }
                });
            });
            return max;
        }
    } // controller brace close



})();
