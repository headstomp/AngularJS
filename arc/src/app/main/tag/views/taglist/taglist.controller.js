(function () {
    'use strict';

    angular
        .module('app.taglist')
        .controller('taglistController', taglistController);

    /** @ngInject*/
    function taglistController($scope, DTColumnBuilder, DTOptionsBuilder, $location, locationSet, $cookieStore) {
        // var table = $('#data_table-list')
        //     .dataTable();
        //
        // console.log('table', table);
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
                //console.log(vm.locationSet);
            })
        };



        if ($scope.BASE_URL == 'http://api.arc.greenfieldethanol.com') {
            var dAPI = 'http://tf-appsvc01.greenfieldethanol.com/Gfsa.Arc.Api.Temp/ArcTags';
        }
        else {
            var dAPI = 'http://tf-devsql01:8069/ArcTags';
        };

        vm.rowCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            // Unbind first in order to avoid any duplicate handler (see https://github.com/l-lin/angular-datatables/issues/87)
            angular.element('td', nRow)
                .unbind('click');
            angular.element('td', nRow)
                .bind('click', function () {
                    $scope.$apply(function () {
                        vm.arcTagRowClick(aData);
                    });
                });
            return nRow;
        };

        vm.arcTagsDTInstance = {};
        var SearchCallDelay = 300;


        vm.arcTagsDTOptions = DTOptionsBuilder.newOptions()
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
                data: function (data, dtInstance) {
                    //  console.log(data);
                    //  console.log(dtInstance);
                    // Modify the data object properties here before being passed to the server
                    // Note that dtInstance parameter is actually a different object than $scope.dtInstance

                    // Inspect the values of data and $scope.dtInstance to get a better idea of the parameters
                    // sent to the server, the state of the DataTable, and the available API methods on the
                    // $scope.dtInstance.DataTable object


                    // Any values you set on the data object will be passed along as parameters to the server
                    data.user = 'Paul';
                }
            })
            .withDataProp('data')
            .withOption('serverSide', true)
            // .withOption('stateSave', true)
            // //.withOption('stateDuration', 12 * 60 * 60)
            // .withOption('stateLoadCallback', function (settings) {
            //     var filterDT = $cookieStore.get('myFilterForTags');
            //     console.log('filterDT', filterDT);
            //     if (filterDT) {
            //         return filterDT;
            //     }
            //     else {
            //         return false;
            //     }
            // })
            // .withOption('stateSaveCallback', function (settings, data) {
            //     //  console.log('stateSaveCallback', data);
            //     //  console.log(settings);
            //     console.log('stateSaveCallback', data);
            //     // console.log(settings);
            //     // return true;
            //     //  table.state.clear();
            //     //  console.log('in save callback', $cookieStore.get('myFilter'));
            //     $cookieStore.remove('myFilterForTags');
            //     // var expireDate = new Date();
            //     // expireDate.setDate(expireDate.getMinutes() + 1);
            //     $cookieStore.put('myFilterForTags', data);
            //     return true;
            //
            // })
            // .withColumnFilter({
            //     aoColumns: [{
            //         type: 'number'
            //     }, {
            //         type: 'text',
            //         bRegex: true,
            //         bSmart: true
            //     }, {
            //         type: 'select',
            //         bRegex: false,
            //         values: ['Yoda', 'Titi', 'Kyle', 'Bar', 'Whateveryournameis']
            //     }]
            // })
            .withLightColumnFilter({
                '0': {
                    html: 'input', //(input|range|select),
                    type: 'text', // type: (text|color|date|datetime|datetime-local|email|month|number|range|search|tel|time|url|week),
                    time: SearchCallDelay, //delay before call
                    attr: {
                        class: 'filter-input', //assign to all filter input tags
                        placeholder: 'filter by id'

                    }
                },
                '1': {
                    html: 'input',
                    type: 'text',
                    time: SearchCallDelay,
                    attr: {
                        class: 'filter-input',
                        placeholder: 'filter by name'
                    }
                },
                '2': {
                    html: 'input',
                    type: 'text',
                    time: SearchCallDelay,
                    attr: {
                        class: 'filter-input',
                        placeholder: 'filter by description'
                    }
                },
                '3': {
                    html: 'select',
                    type: 'select',
                    values: vm.locationSet,
                    time: SearchCallDelay,
                    attr: {
                        class: 'filter-input',
                        placeholder: 'filter by location'
                    }

                },

                '4': {
                    html: 'input',
                    type: 'text',
                    time: SearchCallDelay,
                    attr: {
                        class: 'filter-input',
                        placeholder: 'filter by area'
                    }
                },
                '5': {
                    html: 'input',
                    type: 'text',
                    time: SearchCallDelay,
                    attr: {
                        class: 'filter-input',
                        placeholder: 'filter by source'
                    }
                },
                '6': {
                    html: 'select',
                    type: 'text',
                    values: [{
                            value: '',
                            label: 'Show All'
                        },
                        {
                            value: 'Analog',
                            label: 'Analog'
                        },
                        {
                            value: 'Comment',
                            label: 'Comment'
                        },
                        {
                            value: 'Decimal',
                            label: 'Decimal'
                        },
                        {
                            value: 'Discrete',
                            label: 'Discrete'
                        },
                        {
                            value: 'File',
                            label: 'File'
                        },
                        {
                            value: 'Integer',
                            label: 'Integer'
                        },
                        {
                            value: 'String',
                            label: 'String'
                        },
                        {
                            value: 'Calculated',
                            label: 'Calculated'
                        }
                    ],
                    time: SearchCallDelay,
                    attr: {
                        class: 'dropdown'
                    }
                },
            })
            .withOption('rowCallback', vm.rowCallback);

        vm.arcTagsColumns = [
            DTColumnBuilder.newColumn('Id'),
            DTColumnBuilder.newColumn('Name'),
            DTColumnBuilder.newColumn('Description'),
            DTColumnBuilder.newColumn('LocationName'),
            DTColumnBuilder.newColumn('Area'),
            DTColumnBuilder.newColumn('TagSourceDescription'),
            DTColumnBuilder.newColumn('TagTypeName')

        ];

        vm.arcTagRowClick = function (data) {
            //  console.log(data);
            $location.url('/detail/' + data.Id);

        };
        // var tempinstance = angular.element('#data_table-list');
        // console.log(tempinstance);

        vm.gotoHelp = gotoHelp;

        function gotoHelp(app) {
            console.log('help');
            if (app == 'tagList') {
                window.open("https://docs.google.com/document/d/19L414PkngoiHVhZBzR9VbjxCZ73_4A-ZDy3L4WvwUHk/edit#heading=h.pcb6q5h4f7c3", 'HTML', 'height=600,width=800');
            }
            else {
                return
            }
        };

    }
})();
