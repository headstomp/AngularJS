(function () {
    'use strict';
    
    angular
    .module('app.publishedlist')
    .controller('publishedListController', publishedListController);
    
    /** @ngInjectL*/
    function publishedListController($document, $scope, $q, user, $mdDialog, $mdSidenav, DTColumnBuilder, DTOptionsBuilder, $location, $translate, msApi) {
        var vm = this;
        
        vm.username = user.Username;
        vm.isadmin = user.IsAdmin;
        
        //direct to database url
        if($scope.BASE_URL == 'http://api.arc.greenfieldethanol.com'){
            var dAPI = 'http://tf-appsvc01.greenfieldethanol.com/Gfsa.Arc.Api.Temp/ArcReports';
        } else {
            var dAPI = 'http://tf-devsql01:8069/ArcReports';
        };
        
        
        vm.rowCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            // Unbind first in order to avoid any duplicate handler (see https://github.com/l-lin/angular-datatables/issues/87)
            angular.element('.go', nRow).unbind('click');
            angular.element('.go', nRow).bind('click', function () {
                $scope.$apply(function () {
                    vm.arcDesignRowClick(aData);
                });
            });
            angular.element('.html-link', nRow).unbind('click');
            angular.element('.html-link', nRow).bind('click', function () {
                $scope.$apply(function () {
                    vm.arcHTMLRowClick(aData);
                });
            });
            return nRow;
        };
        
        vm.arcPublishdtInstance = {};
        var SearchCallDelay = 300;
        
        vm.arcPublishDTOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('simple')
            .withDisplayLength(20)
            .withOption('lengthMenu', [[10, 20, 50, 100], [10, 20, 50, 100]])
            //.withOption('searchDelay', null) //doesnt throttle for some reason
            .withOption('processing', false)
            .withOption('dom', 'rt<"bottom"<"left"<"buttons"B><"length"l>><"right"<"info"i><"pagination"p>>>')
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
                    console.log(data);
                    if (vm.dtInstance) {
                        console.log('dtinstance', $scope.dtInstance);
                        console.log('underlying DataTable object', $scope.dtInstance.DataTable);
                    }
                    
                    // Any values you set on the data object will be passed along as parameters to the server
                    data.user = vm.username;
                    data.isAdmin = true;
                    data.isPublished = true;
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
                        placeholder: 'search ID'
                    }
                },
                '1': {
                    html: 'input',
                    type: 'text',
                    time: SearchCallDelay,
                    attr: {
                        class: 'filter-input',
                        placeholder: 'search Name'
                    }
                },
                '2': {
                    html: 'input',
                    type: 'text',
                    time: SearchCallDelay,
                    attr: {
                        class: 'filter-input',
                        placeholder: 'search Description'
                    }
                },
                '3': {
                    html: 'input',
                    type: 'text',
                    time: SearchCallDelay,
                    attr: {
                        class: 'filter-input',
                        placeholder: 'search Location'
                    }
                },
                '4': {
                    html: 'input',
                    type: 'text',
                    time: SearchCallDelay,
                    attr: {
                        class: 'filter-input',
                        placeholder: 'search Owner'
                    }
                },
                '5': {
                    html: 'select',
                    values: [{
                            value: '',
                            label: 'Show all'
                        }, {
                            value: '1',
                            label: 'CSV'
                        }, {
                            value: '0',
                            label: 'NO CSV'
                        }
                    ],
                    time: SearchCallDelay,
                    attr: {
                        class: 'dropdown'
                    }
                },
                '6': {
                    html: 'select',
                    values: [{
                            value: '',
                            label: 'Show all'
                        }, {
                            value: '1',
                            label: 'QVD'
                        }, {
                            value: '0',
                            label: 'NO QVD'
                        }
                    ],
                    time: SearchCallDelay,
                    attr: {
                        class: 'dropdown'
                    }
                },
                '7': {
                    html: 'select',
                    values: [{
                            value: '',
                            label: 'Show all'
                        }, {
                            value: '1',
                            label: 'Published'
                        }, {
                            value: '0',
                            label: 'Not Published'
                        }
                    ],
                    time: SearchCallDelay,
                    attr: {
                        class: 'dropdown'
                    }
                },
                
            })
            .withOption('rowCallback', vm.rowCallback);
        
        vm.arcPublishColumns = [
            DTColumnBuilder.newColumn('Id').withClass('go'),
            DTColumnBuilder.newColumn('Name').withClass('go'),
            DTColumnBuilder.newColumn('Description').withClass('go'),
            DTColumnBuilder.newColumn('LocationName').withClass('go'),
            DTColumnBuilder.newColumn('Owner').withClass('go'),
            DTColumnBuilder.newColumn('ShowQvdCsv').renderWith(CSV),
            DTColumnBuilder.newColumn('ShowQvdCsv').renderWith(QVD),
            DTColumnBuilder.newColumn('ShowTable').renderWith(HTML).withClass('html-link'),
        ];
        
        function CSV(data, type, full, meta) {
            if (data == true) {
                return '<span class="pub-link"><a href="gfsa://openfolder?path=\\\\tf-qvds\\QVD\\arc\\Sources\\CSV">CSV</a></span>';
            } else {
                return '';
            }
        }
        
        function QVD(data, type, full, meta) {
            if (data == true) {
                return '<span class="pub-link"><a href="gfsa://openfolder?path=\\\\tf-qvds\\QVD\\arc\\Sources\\QVD">QVD</a></span>';
            } else {
                return '';
            }
        }
        
        function HTML(data, type, full, meta) {
            if (data == true) {
                return '<div class="pub-link">' + 'HTML' + '</div>';
            } else {
                return '';
            }
        }
        
        vm.arcDesignRowClick = function (data) {
            $location.url('/design/' + data.Id);
        };
        
        vm.arcHTMLRowClick = function (data) {
            if (data.ShowTable == true) {
                window.open($scope.BASE_URL + '/ReportResult/' + data.Id + '/Html?isLegacy=false', 'HTML', 'height=600,width=800');
            } else {
                return
            }
        };
        
        //// Methods

        
        ////////
        
        // get username
        function getUser() {
            userDetails.getUser().then(function (user) {
                vm.username = user.Username;
                vm.isadmin = user.IsAdmin;
            });
        };
        
        // get locations
        vm.locationMap = {};
        function getLocation() {
            locations.getLocation().then(function (locations) {
                vm.locationSet = locations;
                
                angular.forEach(vm.locationSet, function (location) {
                    vm.locationMap[location.Id] = location.Name;
                    //console.log(location.Name);
                });
                
            });
        };

        vm.gotoHelp = gotoHelp;
        function gotoHelp (app) {
            console.log('help');
            if (app == 'publish') {
                window.open("https://docs.google.com/document/d/19L414PkngoiHVhZBzR9VbjxCZ73_4A-ZDy3L4WvwUHk/edit#heading=h.f3iv932f1wkg", 'HTML', 'height=600,width=800');
            } else {
                return
            }
        };
       
    }
})();
