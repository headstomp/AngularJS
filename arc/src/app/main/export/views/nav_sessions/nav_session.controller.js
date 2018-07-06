(function () {
    //'use strict';
    
    angular
    .module('app.navsessionhome')
    .controller('navsessionhomeController', navsessionhomeController);
    
    /** @ngInject */
    function navsessionhomeController($scope, user, $mdSidenav, DTColumnBuilder, DTOptionsBuilder, $location, msApi) {
        var vm = this;

        
        vm.username = user.Username;
        vm.isadmin = user.IsAdmin;
        vm.applicationId = 1;
        
        vm.rowCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            // Unbind first in order to avoid any duplicate handler (see https://github.com/l-lin/angular-datatables/issues/87)
            angular.element('#delete', nRow).unbind('click');
            angular.element('#delete', nRow).bind('click', function () {
                $scope.$apply(function () {
                    vm.deleteRow(aData);
                });
            });
            return nRow;
        };

        vm.navSessionsDTInstance = {};
        var SearchCallDelay = 300;
        
        vm.navSessionsDTOptions = DTOptionsBuilder.newOptions()
           .withPaginationType('simple')
            .withDisplayLength(20)
            .withOption('lengthMenu', [[10, 20, 50, 100], [10, 20, 50, 100]])
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

                url: 'http://tf-appsvc01/Gfsa.Arc.Api.Temp/SqlSessions/',
                type: 'GET',
                data: function (data, dtInstance) {
                    // Modify the data object properties here before being passed to the server
                    // Note that dtInstance parameter is actually a different object than $scope.dtInstance
                    
                    // Inspect the values of data and $scope.dtInstance to get a better idea of the parameters
                    // sent to the server, the state of the DataTable, and the available API methods on the
                    // $scope.dtInstance.DataTable object
                    data.applicationId = vm.applicationId;
                    
                }
            })
            .withDataProp('data')
            .withOption('serverSide', true)
            
            .withLightColumnFilter({
                '0': {
                    html: 'input', //(input|range|select),
                    type: 'text', // type: (text|color|date|datetime|datetime-local|email|month|number|range|search|tel|time|url|week),
                    time: SearchCallDelay, //delay before call
                    attr: {
                        class: 'filter-input', //assign to all filter input tags
                        placeholder: 'filter by SPID'
                    }
                },
                '1': {
                    html: 'input',
                    type: 'text',
                    time: SearchCallDelay,
                    attr: {
                        class: 'filter-input',
                        placeholder: 'filter by blocked'
                    }
                },
                '2': {
                    html: 'input',
                    type: 'text',
                    time: SearchCallDelay,
                    attr: {
                        class: 'filter-input',
                        placeholder: 'filter by login'
                    }
                },
                '3': {
                    html: 'input',
                    type: 'text',
                    time: SearchCallDelay,
                    attr: {
                        class: 'filter-input',
                        placeholder: 'filter by host'
                    }
                },
                '4': {
                    html: 'input',
                    type: 'text',
                    time: SearchCallDelay,
                    attr: {
                        class: 'filter-input',
                        placeholder: 'filter by idle'
                    }
                },
                '5': {
                    html: 'input',
                    type: 'text',
                    time: SearchCallDelay,
                    attr: {
                        class: 'filter-input',
                        placeholder: 'filter by database'
                    }
                },
                '6': {
                    html: 'input',
                    type: 'text',
                    time: SearchCallDelay,
                    attr: {
                        class: 'filter-input',
                        placeholder: 'filter by program'
                    }
                }
            })
            .withOption('rowCallback', vm.rowCallback);
        
        vm.navSessionsColumns = [
            DTColumnBuilder.newColumn('SPID', 'SPID'),
            DTColumnBuilder.newColumn('BlockedBySPID', 'Blocked By SPID'),
            DTColumnBuilder.newColumn('LoginName', 'Login Name'),
            DTColumnBuilder.newColumn('HostName', 'Host Name'),
            DTColumnBuilder.newColumn('IdleMinutes', 'Idle Minutes'),
            DTColumnBuilder.newColumn('DatabaseName', 'Database Name'),
            DTColumnBuilder.newColumn('ProgramName', 'Program Name'),
            DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable()
            .renderWith(actionsHtml)
        ];
        
        function actionsHtml(data, type, full, meta) {
            return '<div id="delete" ng-click="vm.deleteRow()">' +
            '   <span class=" red-fg fa fa-exclamation-triangle"> KILL</span>' +
            '</div>';
        };
        
        vm.deleteRow = function (data, index) {
            //console.log(data);
            vm.message = 'You are trying to kill the user: ' + JSON.stringify(data.SPID) + 'on database' + vm.applicationId;
            
            if (vm.isadmin == false) {
                alert("You do not have access to kill sessions!");
            } else {
                
                if (confirm(vm.message) == true) {
                    //console.log("You pressed OK!");
                    $.ajax({
                        //
                        // HACK: this needs to be fixed to point at the normal API
                        //
                        url: 'http://tf-appsvc01/Gfsa.Arc.Api.Temp/SqlSessions/Kill/' + data.SPID + '?isAdmin=' + vm.isadmin + '&applicationId=' + vm.applicationId,
                        type: 'DELETE',
                        success: function (response) {
                            vm.dtInstance.rerender();
                        }
                    });
                } else {}
            }
        };
        vm.refreshDatabase = refreshDatabase;
        function refreshDatabase() {
            vm.navSessionsDTInstance.rerender();
        }
        
      
    }
})();
