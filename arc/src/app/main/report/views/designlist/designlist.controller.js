(function () {
    'use strict';

    angular
        .module('app.designlist')
        .controller('designlistController', designlistController);

    /** @ngInjectL*/
    function designlistController($document, $scope, $q, user, $mdDialog, $mdSidenav, DTColumnBuilder, DTOptionsBuilder, $location, $translate, msApi, locationSetForDT, locations, $cookieStore) {
        var vm = this;
        vm.locationSetForDT = [];

        vm.getLocationForDT = getLocationForDT;
        vm.getLocationForDT();
        //  console.log(locationSetForDT);
        // get locations
        function getLocationForDT() {
            //  console.log('entering in');
            var temp = {
                'value': '',
                'label': 'Show All'
            }
            vm.locationSetForDT.push(temp);
            temp = {};
            angular.forEach(locationSetForDT, function (location) {
                //  console.log(location);
                temp['value'] = location.Name;
                temp['label'] = location.Name;
                vm.locationSetForDT.push(temp);
                temp = {};
                //  console.log(vm.locationSetForDT);
            })
        };

        vm.username = user.Username;
        vm.isadmin = user.IsAdmin;

        //direct to database url
        if ($scope.BASE_URL == 'http://api.arc.greenfieldethanol.com') {
            var dAPI = 'http://tf-appsvc01.greenfieldethanol.com/Gfsa.Arc.Api.Temp/ArcReports';
        }
        else {
            var dAPI = 'http://tf-devsql01:8069/ArcReports';
        };


        vm.rowCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            // Unbind first in order to avoid any duplicate handler (see https://github.com/l-lin/angular-datatables/issues/87)
            angular.element('.go', nRow)
                .unbind('click');
            angular.element('.go', nRow)
                .bind('click', function () {
                    $scope.$apply(function () {
                        vm.arcDesignRowClick(aData);
                    });
                });
            angular.element('.trash', nRow)
                .unbind('click');
            angular.element('.trash', nRow)
                .bind('click', function () {
                    $scope.$apply(function () {
                        vm.arcDeleteRowClick(aData, iDisplayIndexFull);
                    });
                });
            return nRow;
        };
        vm.arcDesignsdtInstance = {};
        var SearchCallDelay = 300;

        vm.arcDesignsDTOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('simple')
            .withDisplayLength(20)
            .withOption('lengthMenu', [
                [10, 20, 50, 100],
                [10, 20, 50, 100]
            ])
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
                    // console.log(data);


                    // Any values you set on the data object will be passed along as parameters to the server
                    data.user = vm.username;
                    data.isAdmin = vm.isadmin;
                    //data.isAdmin = false;

                },
            })

            .withDataProp('data')
            .withOption('serverSide', true)
            //.withOption('stateSave', true)
            //.withOption('stateDuration', 12 * 60 * 60)
            // .withOption('stateLoadCallback', function (settings) {
            //     var filterDT = $cookieStore.get('myFilterForReports');
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
            //     $cookieStore.remove('myFilterForReports');
            //     // var expireDate = new Date();
            //     // expireDate.setDate(expireDate.getMinutes() + 1);
            //     $cookieStore.put('myFilterForReports', data);
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
                    values: vm.locationSetForDT,
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
                    html: 'input',
                    type: 'text',
                    time: SearchCallDelay,
                    attr: {
                        class: '',
                        placeholder: ''
                    }
                },

            })
            .withOption('rowCallback', vm.rowCallback);

        vm.arcDesignsColumns = [
            DTColumnBuilder.newColumn('Id')
            .withClass('go'),
            DTColumnBuilder.newColumn('Name')
            .withClass('go'),
            DTColumnBuilder.newColumn('Description')
            .withClass('go'),
            DTColumnBuilder.newColumn('LocationName')
            .withClass('go'),
            DTColumnBuilder.newColumn('Owner')
            .withClass('go'),
            DTColumnBuilder.newColumn(null)
            .renderWith(deleteRow),
        ];

        function deleteRow(data, type, full, meta) {
            return '<span class="trash fa fa-trash-o" aria-hidden="true"></span>';
        }

        vm.arcDesignRowClick = function (data) {
            $location.url('/design/' + data.Id);
        };

        vm.arcDeleteRowClick = function (data, index) {
            deleteReportDetails(event, data.Id)
            console.log(data);
            console.log(index);
        };

        //// Methods
        vm.deleteReportDetails = deleteReportDetails;

        ////////

        // get username
        function getUser() {
            userDetails.getUser()
                .then(function (user) {
                    vm.username = user.Username;
                    vm.isadmin = user.IsAdmin;
                });
        };

        // get locations
        vm.locationMap = {};

        function getLocation() {
            locations.getLocation()
                .then(function (locations) {
                    vm.locationSet = locations;

                    angular.forEach(vm.locationSet, function (location) {
                        vm.locationMap[location.Id] = location.Name;
                        //console.log(location.Name);
                    });

                });
        };

        // Delete Report Details
        function deleteReportDetails(ev, Id) {
            var confirm = $mdDialog.confirm({
                title: 'Remove Report - ' + Id,
                parent: $document.find('#designlist'),
                textContent: 'Are you sure want to remove this report?',
                ariaLabel: 'remove report',
                targetEvent: ev,
                clickOutsideToClose: true,
                escapeToClose: true,
                ok: 'Remove',
                cancel: 'Cancel'
            });
            $mdDialog.show(confirm)
                .then(function () {
                    msApi.request('designDetailDelete@del', {
                            id: Id
                        },
                        // SUCCESS
                        function (response) {
                            console.log(response);
                            //vm.mydesignlist.splice(index, 1)
                            vm.arcDesignsdtInstance.reloadData();
                        },
                        // ERROR
                        function (response) {
                            console.log('Unable to delete Details');
                            console.error(response);
                        });

                }, function () {
                    // Canceled
                });

        }

        vm.gotoHelp = gotoHelp;

        function gotoHelp(app) {
            if (app == 'designList') {
                window.open("https://docs.google.com/document/d/19L414PkngoiHVhZBzR9VbjxCZ73_4A-ZDy3L4WvwUHk/edit#heading=h.3dmyotv0nesg ", 'HTML', 'height=600,width=800');
            }
            else {
                return
            }
        };


    }
})();
