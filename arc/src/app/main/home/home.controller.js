(function ()
{
    'use strict';

    angular
        .module('app.home')
        .controller('HomeController', HomeController);

    /** @ngInject */
    function HomeController($scope,$translate,$cookieStore,$interval, msApi, $q, $location, DTColumnBuilder, DTOptionsBuilder)
    {
        var vm = this;
        

        vm.comment = {};
        vm.saveComment = function () {
            vm.comment.save().then(function (result) {
                console.log('Save complete!');
                console.log(result);
            });
        };

        vm.diagnosticsInterval = 5000; // query the Nagios API every
        vm.importerStatusInterval = 60000; // query the importer list every

        
        //direct to database url
        if($scope.BASE_URL == 'http://api.arc.greenfieldethanol.com'){
            var dAPI = 'http://tf-appsvc01.greenfieldethanol.com/Gfsa.Arc.Api.Temp/ArcTagSources';
        } else {
            var dAPI = 'http://tf-devsql01:8069/ArcTagSources';
        };


        //refresh importer status
        vm.updateImportersStatus = $interval(function (){
            console.log("fucking kill me now");
            vm.dtInstance.reloadData();
        }, vm.importerStatusInterval);
        // Cleanup
        $scope.$on('$destroy', function (){
            $interval.cancel(vm.updateImportersStatus);
        });



        vm.rowCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            // Unbind first in order to avoid any duplicate handler (see https://github.com/l-lin/angular-datatables/issues/87)
            angular.element('.go', nRow).unbind('click');
            angular.element('.go', nRow).bind('click', function () {
                $scope.$apply(function () {
                    vm.arcImporterRowClick(aData);
                });
            });
            return nRow;
        };
        vm.dtInstance = {};
        var SearchCallDelay = 300;
        
        vm.arcHomeDTOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('simple')
            .withDisplayLength(18)
            //.withOption('searchDelay', null) //doesnt throttle for some reason
            .withOption('processing', false)
            .withOption('responsive', true)
            .withOption('autoWidth', true)
            .withOption('dom', 'rt<"bottom"<"left"<B>><"right"<"pagination"p>>>')
            .withOption('buttons', [
                'copy',
                'print',
                'pdf',
                'excel'
            ])
            .withOption('ajax', {
                url: dAPI,
                type: 'GET',
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                data: function (data, dtInstance) {
                    // Modify the data object properties here before being passed to the server
                    // Note that dtInstance parameter is actually a different object than $scope.dtInstance
                    
                    // Inspect the values of data and $scope.dtInstance to get a better idea of the parameters
                    // sent to the server, the state of the DataTable, and the available API methods on the
                    // $scope.dtInstance.DataTable object
                    // console.log(data);
                    if (vm.dtInstance) {
                        console.log('dtinstance', vm.dtInstance);
                        console.log('underlying DataTable object', vm.dtInstance.DataTable);
                    }
                    
                    // Any values you set on the data object will be passed along as parameters to the server
                    data.showForms = false;
                   
                    //data.isAdmin = false;
                    
                },
            })
            
            .withDataProp('data')
            .withOption('serverSide', true)
            
            .withLightColumnFilter({
                '0': {
                    html: 'input', //(input|range|select),
                    type: 'text', // type: (text|color|date|datetime|datetime-local|email|month|number|range|search|tel|time|url|week),
                    time: SearchCallDelay, //delay before call
                    attr: {
                        class: 'filter-input', //assign to all filter input Designs
                        placeholder: 'Name'
                    }
                },
                '1': {
                    html: 'input',
                    type: 'text',
                    time: SearchCallDelay,
                    attr: {
                        class: 'filter-input',
                        placeholder: 'Site'
                    }
                }
             
                
            })
            .withOption('rowCallback', vm.rowCallback);
        
        vm.arcHomeDTColumns = [
            DTColumnBuilder.newColumn('Name').withClass('go'),
            //DTColumnBuilder.newColumn('Description').withClass('go'),
            DTColumnBuilder.newColumn('LocationName').withClass('go'),
            DTColumnBuilder.newColumn('LastRun').renderWith(dt).withClass('go'),
            DTColumnBuilder.newColumn('LastData').renderWith(dt).withClass('go'),
            DTColumnBuilder.newColumn('CriticalRunThreshold').renderWith(status).withClass('go')
        ];


        vm.arcImporterRowClick = function (data) {
            $location.url('/sourcedetail/' + data.Id);
        };

    	function dt(data, type, full, meta) {
            return moment(data).fromNow();
        };

        function status(data, type, full, meta) {

        	//good
            	return '<span class="fa fa-thumbs-up green-fg"> good </span>'
            //waring 
            	//return '<span class="fa fa-thumbs-down yellow-800-fg"> good </span>'
            // bad
            	//return '<span class="fa fa-fire red-fg"> good </span>'
        }

       

            // values processed widget
            vm.importerValCount = {
                title           : "Values Processed",
                valsPerDay      : 200123123,
                updateFrequency : 5000, // in millseconds
                detail          : "This is the back side. You can show detailed information here.",
                init    : function () {
                    // update total values in arc counter based on Sundays real total plus values per day since Sunday every n seconds
                    var updateTotValCount = function() {
                        var daysSinceSunday = (moment() - moment().startOf('week')) / 1000 / 60 / 60 / 24;
                        vm.counter = vm.importerValueCountTotal + (daysSinceSunday * vm.importerValCount.valsPerDay);

                        // fake percentage to make meter on widget jump around
                        vm.percentage = Math.floor((Math.random() * 100) + 1);
                    };
                    // Set interval
                    var updateTotValCountInterval = $interval(function (){
                        updateTotValCount();
                    }, vm.importerValCount.updateFrequency);
                    // Cleanup
                    $scope.$on('$destroy', function (){
                        $interval.cancel(updateTotValCountInterval);
                    });
                }
            },

            // uptime widget
            vm.uptime = {
                title: "Server Uptime",
                updateFrequency : 1000, // in millseconds
                value: {
                    days    : 0,
                    hours   : 0,
                    minutes : 0,
                    seconds : 0
                },
                footnote: "Since last outage",
                detail  : "This is the back side. You can show detailed information here.",
                init    : function () {
                    // update seconds between length of query interval
                    var addSeconds = function() {

                    	if(vm.uptime.value.seconds == 60){
                    		vm.uptime.value.seconds = 1;
                    	}
                    	vm.uptime.value.seconds = vm.uptime.value.seconds + vm.uptime.updateFrequency /1000;
                    };
                    // Set interval
                    var updateUptimeInterval = $interval(function (){
                        addSeconds();
                    }, vm.uptime.updateFrequency);
                    // Cleanup
                    $scope.$on('$destroy', function (){
                        $interval.cancel(updateUptimeInterval);
                    });
                }
            },


            // CPU Utilization Widget
            vm.cpuUtilization = {
                title: "CPU Utilization",
                value: "0 %",
                updateFrequency : 1000, // in millseconds
                footnote: "Higher than average",
                detail: "This is the back side. You can show detailed information here.",
                chart: [{
                    key: "",
					values: [
					   	{"x": 0, "y": 0},
					    {"x": 0, "y": 0},
					    {"x": 0, "y": 0},
					    {"x": 0, "y": 0},
					    {"x": 0, "y": 0},
					    {"x": 0, "y": 0},
					    {"x": 0, "y": 0},
					    {"x": 0, "y": 0},
					    {"x": 0, "y": 0},
					    {"x": 0, "y": 0},
					    {"x": 0, "y": 0},
					    {"x": 0, "y": 0},
					    {"x": 0, "y": 0},
					    {"x": 0, "y": 0},
					    {"x": 0, "y": 0},
					    {"x": 0, "y": 0},
					    {"x": 0, "y": 0},
					    {"x": 0, "y": 0},
					    {"x": 0, "y": 0},
					    {"x": 0, "y": 0},
					    {"x": 0, "y": 0},
					    {"x": 0, "y": 0},
					    {"x": 0, "y": 0},
					    {"x": 0, "y": 0},
					    {"x": 0, "y": 0}
					]
                }]
            },
            vm.CPUChart = {
                title   : vm.cpuUtilization.title,
                value   : vm.cpuUtilization.value,
                footnote: vm.cpuUtilization.footnote,
                detail  : vm.cpuUtilization.detail,
                chart   : {
                    config : {
                        refreshDataOnly: true,
                        deepWatchData  : true
                    },
                    options: {
                        chart: {
                            type        : 'lineChart',
                            color       : ['rgba(0, 0, 0, 0.27)'],
                            height      : 55,
                            margin      : {
                                top   : 0,
                                right : 0,
                                bottom: 0,
                                left  : 0
                            },
                            duration    : 1,
                            clipEdge    : true,
                            interpolate : 'cardinal',
                            interactive : false,
                            isArea      : true,
                            showLegend  : false,
                            showControls: false,
                            showXAxis   : false,
                            showYAxis   : false,
                            x           : function (d)
                            {
                                return d.x;
                            },
                            y           : function (d)
                            {
                                return d.y;
                            },
                            yDomain     : [0, 100]
                        }
                    },
                    data   : vm.cpuUtilization.chart
                },
                init    : function (){

                    var lastIndex = vm.cpuUtilization.chart[0].values.length - 1,
                        x = vm.cpuUtilization.chart[0].values[lastIndex].x;

                    function cpuTicker(min, max){
                        x++;
                        var currentVal = vm.CPUtfappsvc01;
                        var newValue = {
                            x: x,
                            y: currentVal
                        };
                        vm.CPUChart.chart.data[0].values.shift();
                        vm.CPUChart.chart.data[0].values.push(newValue);

                        // Randomize the value
                        vm.CPUChart.value = currentVal;
                    };

                    // Set interval
                    var cpuTickerInterval = $interval(function (){
                        cpuTicker(1, 100);
                    }, vm.cpuUtilization.updateFrequency);

                    // Cleanup
                    $scope.$on('$destroy', function (){
                        $interval.cancel(cpuTickerInterval);
                    });
                }
            };

            // RAM Utilization Widget
            vm.ramUtilization = {
                title: "RAM Utilization",
                value: "0 %",
                updateFrequency : 1000, // in millseconds
                footnote: "Higher than average",
                detail: "This is the back side. You can show detailed information here.",
                chart: [{
                    key: "",
                     values: [
                       	{"x": 0, "y": 0},
                        {"x": 0, "y": 0},
                        {"x": 0, "y": 0},
                        {"x": 0, "y": 0},
                        {"x": 0, "y": 0},
                        {"x": 0, "y": 0},
                        {"x": 0, "y": 0},
                        {"x": 0, "y": 0},
                        {"x": 0, "y": 0},
                        {"x": 0, "y": 0},
                        {"x": 0, "y": 0},
                        {"x": 0, "y": 0},
                        {"x": 0, "y": 0},
                        {"x": 0, "y": 0},
                        {"x": 0, "y": 0},
                        {"x": 0, "y": 0},
                        {"x": 0, "y": 0},
                        {"x": 0, "y": 0},
                        {"x": 0, "y": 0},
                        {"x": 0, "y": 0},
                        {"x": 0, "y": 0},
                        {"x": 0, "y": 0},
                        {"x": 0, "y": 0},
                        {"x": 0, "y": 0},
                        {"x": 0, "y": 0}
                    ]
                }]
            },
            vm.ramChart = {
                title   : vm.ramUtilization.title,
                value   : vm.ramUtilization.value,
                footnote: vm.ramUtilization.footnote,
                detail  : vm.ramUtilization.detail,
                chart   : {
                    config : {
                        refreshDataOnly: true,
                        deepWatchData  : true
                    },
                    options: {
                        chart: {
                            type        : 'lineChart',
                            color       : ['rgba(0, 0, 0, 0.27)'],
                            height      : 55,
                            margin      : {
                                top   : 0,
                                right : 0,
                                bottom: 0,
                                left  : 0
                            },
                            duration    : 1,
                            clipEdge    : true,
                            interpolate : 'cardinal',
                            interactive : false,
                            isArea      : true,
                            showLegend  : false,
                            showControls: false,
                            showXAxis   : false,
                            showYAxis   : false,
                            x           : function (d)
                            {
                                return d.x;
                            },
                            y           : function (d)
                            {
                                return d.y;
                            },
                            yDomain     : [0, 100]
                        }
                    },
                    data   : vm.ramUtilization.chart
                },
                init    : function (){

                    var lastIndex = vm.ramUtilization.chart[0].values.length - 1,
                        x = vm.ramUtilization.chart[0].values[lastIndex].x;

                    function ramTicker(min, max){
                        x++;
                        var currentVal = vm.RAMtfappsvc01;
                        var newValue = {
                            x: x,
                            y: currentVal
                        };
                        vm.ramChart.chart.data[0].values.shift();
                        vm.ramChart.chart.data[0].values.push(newValue);

                        vm.ramChart.value = currentVal;
                    }
                    // Set interval
                    var cpuTickerInterval = $interval(function ()
                    {
                        ramTicker(1, 100);
                    }, vm.ramUtilization.updateFrequency);
                    // Cleanup
                    $scope.$on('$destroy', function ()
                    {
                        $interval.cancel(cpuTickerInterval);
                    });
                }
            };

            vm.cpuImporter = {
                title: "Average CPU Usage (Import Server)",
                updateFrequency: 1000, // in millseconds
                chart: [
                    {
                        key: "Average CPU Usage",
                        values: [
                           	{"x": 0, "y": 0},
	                        {"x": 0, "y": 0},
	                        {"x": 0, "y": 0},
	                        {"x": 0, "y": 0},
	                        {"x": 0, "y": 0},
	                        {"x": 0, "y": 0},
	                        {"x": 0, "y": 0},
	                        {"x": 0, "y": 0},
	                        {"x": 0, "y": 0},
	                        {"x": 0, "y": 0},
	                        {"x": 0, "y": 0},
	                        {"x": 0, "y": 0},
	                        {"x": 0, "y": 0},
	                        {"x": 0, "y": 0},
	                        {"x": 0, "y": 0},
	                        {"x": 0, "y": 0},
	                        {"x": 0, "y": 0},
	                        {"x": 0, "y": 0},
	                        {"x": 0, "y": 0},
	                        {"x": 0, "y": 0},
	                        {"x": 0, "y": 0},
	                        {"x": 0, "y": 0},
	                        {"x": 0, "y": 0},
	                        {"x": 0, "y": 0},
	                        {"x": 0, "y": 0}
                        ]
                    }
                ]
            },
            vm.cpuImporterChart = {
            title: vm.cpuImporter.title,
            chart: {
                config : {
                    refreshDataOnly: true,
                    deepWatchData  : true
                },
                options: {
                    chart: {
                        type                   : 'lineChart',
                        color                  : ['#03A9F4'],
                        height                 : 140,
                        margin                 : {
                            top   : 8,
                            right : 32,
                            bottom: 16,
                            left  : 48
                        },
                        duration               : 1,
                        clipEdge               : true,
                        clipVoronoi            : false,
                        interpolate            : 'cardinal',
                        isArea                 : true,
                        useInteractiveGuideline: true,
                        showLegend             : false,
                        showControls           : false,
                        x                      : function (d)
                        {
                            return d.x;
                        },
                        y                      : function (d)
                        {
                            return d.y;
                        },
                        yDomain                : [0, 100],
                        xAxis                  : {
                            tickFormat: function (d)
                            {
                                return d + ' sec.';
                            },
                            showMaxMin: false
                        },
                        yAxis                  : {
                            tickFormat: function (d)
                            {
                                return d + '%';
                            }
                        },
                        interactiveLayer       : {
                            tooltip: {
                                gravity: 's',
                                classes: 'gravity-s'
                            }
                        }
                    }
                },
                data   : vm.cpuImporter.chart
            },
            init : function ()
            {
                // Run this function once to initialize the widget

                // Grab the x value
                var lastIndex = vm.cpuImporter.chart[0].values.length - 1,
                    x = vm.cpuImporter.chart[0].values[lastIndex].x;

                /**
                 * Emulate constant data flow
                 *
                 * @param min
                 * @param max
                 */
                function cpuTicker(min, max)
                {
                    // Increase the x value
                    x = x + 1;

                    var newValue = {
                        x: x,
                        y: vm.CPUtfarcimp01
                    };

                    vm.cpuImporterChart.chart.data[0].values.shift();
                    vm.cpuImporterChart.chart.data[0].values.push(newValue);
                }

                // Set interval
                var cpuTickerInterval = $interval(function ()
                {
                    cpuTicker(0, 100);
                }, vm.cpuImporter.updateFrequency);

                // Cleanup
                $scope.$on('$destroy', function ()
                {
                    $interval.cancel(cpuTickerInterval);
                });
            }
        };


        // init
        getSundayImporterValueCount();
        getDiagnostics();


       

        //widgets
        vm.importerValCount.init();
        vm.CPUChart.init();
        vm.ramChart.init();
        vm.cpuImporterChart.init();
        vm.uptime.init();

       

        // get importer total values imported
        vm.importerSundayValueCount = {};
        vm.importerValueCountTotal = 0;
        function getSundayImporterValueCount() {
            msApi.request('importerValueCount@query', {},
                function (response) {
                    vm.importerValueCount = response.ValueCountMap;
                    //console.error(vm.importerValueCount);
                    angular.forEach(vm.importerValueCount, function (value, key) {
                        if (key === '$type') {
                            return;
                        }
                        vm.importerValueCountTotal = vm.importerValueCountTotal + value;
                        //console.log(vm.importerValueCountTotal);
                    });
                },
                function (response) {
                    //console.log('Unable to get tag list');
                    //console.error(response)
                });
        };

        // get diagnostics
        function getDiagnostics() {
            msApi.request('diagnostics@query', ["tf-appsvc01","tf-arcimp01"],
                function (response) {
                    vm.diagnostics = response;
                    vm.RAMtfappsvc01 = vm.diagnostics['tf-appsvc01'].memory.percent[0];
                    	vm.RAMUTottfappsvc01 = vm.diagnostics['tf-appsvc01'].general.root.memory.virtual.total[0] /1073741824;
                    	vm.RAMUsedtfappsvc01 = vm.diagnostics['tf-appsvc01'].general.root.memory.virtual.used[0] /1073741824;
                    	vm.RAMFreetfappsvc01 = vm.diagnostics['tf-appsvc01'].general.root.memory.virtual.free[0] /1073741824;
                    	vm.RAMSwapfappsvc01 = vm.diagnostics['tf-appsvc01'].general.root.memory.swap.used[0] /1073741824;


                    vm.CPUtfappsvc01 = getAvg(vm.diagnostics['tf-appsvc01'].processor.percent[0]);
                    	vm.CPU_0tfappsvc01 = vm.diagnostics['tf-appsvc01'].processor.percent[0][0];
                    	vm.CPU_1tfappsvc01 = vm.diagnostics['tf-appsvc01'].processor.percent[0][1];
                    	vm.CPU_2tfappsvc01 = vm.diagnostics['tf-appsvc01'].processor.percent[0][2];
                    	vm.CPU_3tfappsvc01 = vm.diagnostics['tf-appsvc01'].processor.percent[0][0];


                    vm.uptime.value.days = Math.floor(vm.diagnostics['tf-appsvc01'].general.root.system.uptime[0] / 86400);
                    vm.uptime.value.hours = Math.floor(vm.diagnostics['tf-appsvc01'].general.root.system.uptime[0] / 3600) %24;
                    vm.uptime.value.minutes = Math.floor(vm.diagnostics['tf-appsvc01'].general.root.system.uptime[0] / 60) %60;
                    vm.uptime.value.seconds = Math.floor(vm.diagnostics['tf-appsvc01'].general.root.system.uptime[0]) %60;

                    vm.CPUtfarcimp01 = getAvg(vm.diagnostics['tf-arcimp01'].processor.percent[0]);
                    console.log(response);

                },
                function (response) {
                    //console.log('Unable to get data');
                    //console.error(response)
                });
        };
		// Set interval
        var daignosticTickerInterval = $interval(function ()
        {
            getDiagnostics();
        }, vm.diagnosticsInterval);
        // Cleanup
        $scope.$on('$destroy', function ()
        {
            $interval.cancel(daignosticTickerInterval);
        });



        //average
        function getAvg(num) {
			return num.reduce(function (p, c) {
			return p + c;
			}) / num.length;
		}

		

         function gotoHelp (app) {
            console.log('help');
            if (app == 'home') {
                window.open("https://docs.google.com/document/d/19L414PkngoiHVhZBzR9VbjxCZ73_4A-ZDy3L4WvwUHk/edit#heading=h.sxurl033kyfo", 'HTML', 'height=600,width=800');
            } else {
                return
            }
        };







       
       
    }
})();
