(function ()
{
    'use strict';

    angular
        .module('app.design')
        .controller('whereUsedController', whereUsedController);

    /** @ngInject */
    function whereUsedController($mdDialog, Values, User, event, msApi)
    {
        var vm = this;

        // Data
        vm.reportResults = [];
        vm.user = User;

        vm.whereUsedValues = {
            "whereUsedReportId": 478,
            "reportName": Values.Name,
            "reportDescription": Values.ShortDescription,
            "reportId": Values.Id,
        };

        vm.addNew = {
            "type": '',
            "link": '',
            "name": '',
            "owner": vm.user,
            "id": Values.Id
          };


        vm.tableHeader = ['File Type','Link', 'File Name','Owner', 'Report Id'];
        vm.types = ['Excel','Qlikview','JMP'];

        vm.dtOptions = {
            dom: 'rt<"bottom"<"left"<"length"i>><"right"<"info"><"pagination"p>>>',
            pagingType: 'simple',
            pageLength: 10,
            autoWidth: false,
            responsive: false,
            order: [[0, "desc"]]
        };


        // Methods
        vm.closeDialog = closeDialog;
        vm.getReportResults = getReportResults;
        vm.postWhereUsedForm = postWhereUsedForm;

        function postWhereUsedForm(obj){
          var keys = Object.keys(obj);
          var date = new Date();
          var dateKey = date.toISOString();
          var groupId = dateKey.replace(/\D/g,'');
          var counter = 0;
          angular.forEach(vm.postRequestObject, function(tagObject, datekey){
              if(tagObject.hasOwnProperty('TagId')){
                tagObject.GroupId = groupId;
                tagObject.DateTime = dateKey;
                tagObject.Value = obj[keys[counter]];
                msApi.request('tagReducedData@create',tagObject)
                              .then(function(resolve){
                            console.log('success', resolve);
                          }).catch(function(err){
                          console.log('err', err);
                        });
                //console.log(tag);
                counter++;
              }
            });
          var newObj = angular.copy(vm.postRequestObject);
          refreshView(newObj);

        }

        function refreshView(addNew){
          vm.reportResults.push(addNew);
         console.log(vm.reportResults);
          addNew={};
        }

        // get report results
        function getReportResults(id) {
            msApi.request('designData@get', {
                id: id,
            },
            function (response) {
                var reportDataItemSet = [];
              //  console.log(response);

                angular.forEach(response || [], function (value, key, obj) {
                    if (key.substring(0, 1) == "1" || key.substring(0, 1) == "2") {
                        if(value[5].Value == Values.Id){
                            this.push(value);
                          //  console.log(value);
                        };
                    };
                }, reportDataItemSet);
                    vm.reportResults = reportDataItemSet;
                    vm.postRequestObject = getRequestContainer(response);

            },
            function (response) {
                //console.log('Unable to refresh data');
                //console.error(response)
            });
        };

        function getRequestContainer(reportResults){

          var containerObj = {};

          var keepGoing= true;

          angular.forEach(reportResults, function(tagObject, key, obj){

            if(Date.parse(key) && keepGoing){

              containerObj = tagObject;
              keepGoing= false;
            }
            });

          return containerObj;
        }


        /**
         * Close dialog
         */
        function closeDialog()
        {
            $mdDialog.hide();
        }



        vm.getReportResults(vm.whereUsedValues.whereUsedReportId);
    }
})();
