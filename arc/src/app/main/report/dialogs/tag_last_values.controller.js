(function ()
{
    'use strict';

    angular
        .module('app.design')
        .controller('tagLastValuesController', tagLastValuesController);

    /** @ngInject */
    function tagLastValuesController($mdDialog, Value, event, msApi)
    {
        var vm = this;

        // Data
        vm.values = angular.copy(Value);
        vm.tagData = [];
        vm.tagResultSet = {};
        console.log(vm.values);

        vm.rawAspects = ['Date', 'Value'];
        vm.redAspects = ['Date', 'Last', 'Min', 'Max', 'Avg', 'Wavg', 'Var', 'StD'];

        // tagResults widget table layout for datatables
        vm.dtOptions = {
            dom: 'rt<"bottom"<"left"<"length"i>><"right"<"info"><"pagination"p>>>',
            pagingType: 'simple',
            pageLength: 10,
            autoWidth: false,
            responsive: false,
            order: [[0, "desc"]]
        };


         // determine if its a reduced or non reduced data source and sets flag
        if (vm.values.DataLocationId == 2) {
            vm.tagType = 'raw';
        } else {
            vm.tagType = 'red';
        }
        

        // Methods
        vm.closeDialog = closeDialog;
        vm.getTagResults = getTagResults;
        vm.tagResult = tagResult;
        vm.typeCheck = typeCheck;



        //////////
        
        // get data for tagResults per bucket type
        function getTagResults(id) {
            msApi.request('tagresult@query', {
                id: id,
            },
            function (response) {
                vm.tagData = response;
                if (vm.tagData[1]) {
                    // if non reduced data default to bucket type 1 (Raw)
                    vm.tagResult(1);
                } else {
                    // if reduced data default to bucket type 8 (1 day)
                    vm.tagResult(8);
                }
            },
            function (response) {
                console.log('Unable to refresh data');
                console.error(response)
            });
        };

        // change results based on bucket type selection
        function tagResult(bucketId) {
            var data = '';
            var resultSet = [];
            angular.forEach(vm.tagData[bucketId], function (value, key, obj) {
                if (key === '$type') {
                    return;
                }
                data = value[0];
                // data.DateTime = key.toLocaleString();
                data.DateTime = moment(key).utc(true).toISOString();
                resultSet.push(data);
            });
            // display the selected bucket type in header
            vm.tagResultSet = resultSet;
            if (bucketId == 1) { vm.aspectTitle = "Raw"; };
            if (bucketId == 4) { vm.aspectTitle = "10 Minute Reduction"; };
            if (bucketId == 5) { vm.aspectTitle = "30 Minute Reduction"; };
            if (bucketId == 6) { vm.aspectTitle = "1 Hour Reduction"; };
            if (bucketId == 7) { vm.aspectTitle = "12 Hour Reduction"; };
            if (bucketId == 8) { vm.aspectTitle = "1 Day Reduction"; };
            //console.log(vm.tagResultSet);
        };

        // TODO change this to $type check
        function typeCheck(value, hash) {
            if (typeof value === 'number') {
                if (value === parseInt(value, 10)) {
                    //console.log('integer');
                    return 'I';
                }
                else {
                    //console.log('float');
                    return 'N';
                }
            };
            if (typeof value === 'string') {
                //console.log('string');
                if (hash) {
                    return 'F';
                } else {
                    return 'S';
                }
            };
            if (typeof value === 'boolean') {
                //console.log('bool')
                return 'B';
                ;
            };
            if (typeof value === null) {
                //console.log('null');
                return 'E';
            }
            if (typeof value === 'undefined') {
                //console.log('undefined');
                return 'U';
            }
        };

        /**
         * Close dialog
         */
        function closeDialog()
        {
            $mdDialog.hide();
        }



        vm.getTagResults(vm.values.Id);
    }
})();