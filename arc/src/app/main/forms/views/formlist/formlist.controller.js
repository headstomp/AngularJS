(function () {
    'use strict';

    angular
        .module('app.formslist')
        .controller('formsListController', formsListController);

    /** @ngInject */
    function formsListController($document, $scope, DTColumnBuilder, DTOptionsBuilder, $location, locationSet, $cookieStore) {
        var vm = this;

        vm.getLocation = getLocation;
        vm.locationSet = [];
        vm.getLocation();
        // get locations
        function getLocation() {
            var temp = {
                'value': '',
                'label': 'Show All'
            }
            vm.locationSet.push(temp);
            temp = {};
            angular.forEach(locationSet, function (location) {
                temp['value'] = location.Name;
                temp['label'] = location.Name;
                vm.locationSet.push(temp);
                temp = {};
                //console.log(vm.locationSet);
            })
        };



        //direct to database url
        if ($scope.BASE_URL == 'http://api.arc.greenfieldethanol.com') {
            var dAPI = 'http://tf-appsvc01.greenfieldethanol.com/Gfsa.Arc.Api.Temp/ArcTagSources';
        }
        else {
            var dAPI = 'http://tf-devsql01:8069/ArcTagSources';
        };

        vm.rowCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            // Unbind first in order to avoid any duplicate handler (see https://github.com/l-lin/angular-datatables/issues/87)
            angular.element('.go', nRow)
                .unbind('click');
            angular.element('.go', nRow)
                .bind('click', function () {
                    $scope.$apply(function () {
                        vm.arcFormRowClick(aData);
                    });
                });
            angular.element('.app-link', nRow)
                .unbind('click');
            angular.element('.app-link', nRow)
                .bind('click', function () {
                    $scope.$apply(function () {
                        vm.arcAPPRowClick(aData);
                    });
                });
            angular.element('.html-link', nRow)
                .unbind('click');
            angular.element('.html-link', nRow)
                .bind('click', function () {
                    $scope.$apply(function () {
                        vm.arcWEBRowClick(aData);
                    });
                });
            return nRow;
        };

        vm.arcFromsDTInstance = {};
        var SearchCallDelay = 300;

        vm.arcFormsDTOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('simple')
            .withDisplayLength(20)
            .withOption('lengthMenu', [
                [10, 20, 50, 100],
                [10, 20, 50, 100]
            ])
            //.withOption('searchDelay', null) //doesnt throttle for some reason
            .withOption('processing', false)
            .withOption('responsive', true)
            .withOption('autoWidth', true)
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
                    //console.log(data);
                    if (vm.dtInstance) {
                        //console.log('dtinstance', $scope.dtInstance);
                        //console.log('underlying DataTable object', $scope.dtInstance.DataTable);
                    }

                    // Any values you set on the data object will be passed along as parameters to the server
                    data.showForms = true;

                },
            })
            .withDataProp('data')
            //.withOption('serverSide', true)
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
                    html: 'select',
                    type: 'select',
                    values: vm.locationSet,
                    time: SearchCallDelay,
                    attr: {
                        class: 'filter-input',
                        placeholder: 'search Location'
                    }
                },

                '6': {
                    html: 'input',
                    type: 'text',
                    time: SearchCallDelay,
                    attr: {
                        class: 'filter-input',
                        placeholder: 'search app'
                    }
                },
                '7': {
                    html: 'input',
                    type: 'text',
                    time: SearchCallDelay,
                    attr: {
                        class: 'filter-input',
                        placeholder: 'search web'
                    }
                },

            })
            // .withOption('stateSave', true)
            // .withOption('stateDuration', 12 * 60 * 60)
            // .withOption('stateLoadCallback', function (settings) {
            //     var filterDT = $cookieStore.get('myFilterForForms');
            //     if (filterDT) {
            //         return filterDT;
            //     }
            //     else {
            //         return false;
            //     }
            // })
            // .withOption('stateSaveCallback', function (settings, data) {
            //     console.log('stateSaveCallback', data);
            //     console.log(settings);
            //     //  console.log(data);
            //     // console.log(settings);
            //     // return true;
            //     //  table.state.clear();
            //     //  console.log('in save callback', $cookieStore.get('myFilter'));
            //     $cookieStore.remove('myFilterForForms');
            //     // var expireDate = new Date();
            //     // expireDate.setDate(expireDate.getMinutes() + 1);
            //     $cookieStore.put('myFilterForForms', data);
            //     return true;
            //
            // })

            .withOption('rowCallback', vm.rowCallback);


        vm.arcFormsColumns = [
            DTColumnBuilder.newColumn('Id')
            .withClass('go'),
            DTColumnBuilder.newColumn('DisplayName')
            .withClass('go'),
            DTColumnBuilder.newColumn('Description')
            .withClass('go'),
            DTColumnBuilder.newColumn('LocationName')
            .withClass('go'),
            DTColumnBuilder.newColumn('LastRun')
            .renderWith(dt)
            .withClass('go'),
            DTColumnBuilder.newColumn('LastData')
            .renderWith(dt)
            .withClass('go'),
            DTColumnBuilder.newColumn('Name')
            .renderWith(APP)
            .withClass('app-link'),
            DTColumnBuilder.newColumn('Id')
            .renderWith(WEB)
            .withClass('html-link')
        ];

        function myfunction() {
            console.log('exceuted');
        }


        function APP(data, type, full, meta) {
            return '<div class="pub-link">app - ' + data + '</div>';
        }

        function WEB(data, type, full, meta) {
            return '<div class="pub-link">web - ' + data + '</div>';
        }

        function dt(data, type, full, meta) {
            return moment.utc(data)
                .format("YYYY-MM-DD hh:mm A");
        }

        vm.arcFormRowClick = function (data) {
            $location.url('/formdetail/' + data.Id);
        };

        vm.arcAPPRowClick = function (data) {
            window.location.assign('gfsa://arcforms?application_id=' + data.ApplicationId + '&form_tab_id=' + data.FormTabId, 'HTML', 'height=1,width=1');
        };

        vm.arcWEBRowClick = function (data) {
            $location.url('/formentry/' + data.Id);
        };


        vm.gotoHelp = gotoHelp;

        function gotoHelp(app) {
            console.log('help');
            if (app == 'formList') {
                window.open("https://docs.google.com/document/d/19L414PkngoiHVhZBzR9VbjxCZ73_4A-ZDy3L4WvwUHk/edit#heading=h.4s1lazf35oay", 'HTML', 'height=600,width=800');
            }
            else {
                return
            }
        };



    }
})();
