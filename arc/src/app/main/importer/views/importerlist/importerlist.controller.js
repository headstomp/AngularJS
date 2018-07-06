(function () {
    'use strict';

    angular
        .module('app.importerlist')
        .controller('ImporterListController', ImporterListController);

    /** @ngInject */
    function ImporterListController($scope, DTColumnBuilder, DTOptionsBuilder, $location, locationSet, $cookieStore) {


        var vm = this;
        vm.locationSet = [];
        vm.getLocation = getLocation;
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
                //  console.log(vm.locationSet);
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
                        vm.arcImporterRowClick(aData);
                    });
                });
            return nRow;
        };
        vm.arcImportDTInstance = {};
        var SearchCallDelay = 300;

        vm.arcImportDTOptions = DTOptionsBuilder.newOptions()
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
                    // console.log(data);
                    if (vm.dtInstance) {
                        //console.log('dtinstance', vm.dtInstance);
                        //console.log('underlying DataTable object', vm.dtInstance.DataTable);
                    }

                    // Any values you set on the data object will be passed along as parameters to the server
                    data.showForms = false;

                    //data.isAdmin = false;

                },
            })

            .withDataProp('data')
            .withOption('serverSide', true)
            //.withOption('stateSave', true)
            .withOption('stateDuration', 12 * 60 * 60)
            // .withOption('stateLoadCallback', function (settings) {
            //     var filterDT = $cookieStore.get('myFilterForImporters');
            //     if (filterDT) {
            //         return filterDT;
            //     }
            //     else {
            //         return false;
            //     }
            // })
            // .withOption('stateSaveCallback', function (settings, data) {
            //     //console.log('stateSaveCallback', data);
            //     //console.log(settings);
            //     //  console.log(data);
            //     // console.log(settings);
            //     // return true;
            //     //  table.state.clear();
            //     //  console.log('in save callback', $cookieStore.get('myFilter'));
            //     $cookieStore.remove('myFilterForImporters');
            //     // var expireDate = new Date();
            //     // expireDate.setDate(expireDate.getMinutes() + 1);
            //     $cookieStore.put('myFilterForImporters', data);
            //     return true;
            //
            // })
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
                }

            })
            .withOption('rowCallback', vm.rowCallback);

        vm.arcImportColumns = [
            DTColumnBuilder.newColumn('Id')
            .withClass('go'),
            DTColumnBuilder.newColumn('Name')
            .withClass('go'),
            DTColumnBuilder.newColumn('Description')
            .withClass('go'),
            DTColumnBuilder.newColumn('LocationName')
            .withClass('go'),
            DTColumnBuilder.newColumn('LastData')
            .renderWith(dt)
            .withClass('go'),
            DTColumnBuilder.newColumn('LastRun')
            .renderWith(dt)
            .withClass('go'),
        ];

        vm.arcImporterRowClick = function (data) {
            $location.url('/sourcedetail/' + data.Id);
        };

        function dt(data, type, full, meta) {
            //console.log(data);
            return moment.utc(data)
                .format("YYYY-MM-DD hh:mm A");
        }



        vm.gotoHelp = gotoHelp;

        function gotoHelp(app) {
            if (app == 'importerList') {
                window.open("https://docs.google.com/document/d/19L414PkngoiHVhZBzR9VbjxCZ73_4A-ZDy3L4WvwUHk/edit#heading=h.1qq283z5mv83", 'HTML', 'height=600,width=800');
            }
            else {
                return
            }
        };



    }
})();
