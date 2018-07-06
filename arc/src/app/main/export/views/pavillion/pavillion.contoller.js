(function () {
    //'use strict';
    
    angular
    .module('app.pavillion')
    .controller('pavillionController', pavillionController)
    .factory('pavillionDataService', pavillionDataService);
    
    /** @ngInject */
    function pavillionController($document, $mdDialog, $scope, $q, msApi, $timeout, pavillionDataService) {
        vm = this;
        
        vm.unit = "Johnstown";
        
        /*
        vm.PavDTInstance = {};
        vm.PavdtOptions = {
            dom: 'rt<"bottom"<"left"<"buttons"B><"length"l>><"right"<"info"i><"pagination"p>>>',
            buttons: [
                'copy',
                'print',
                'pdf',
                'excel'
            ],
            autoWidth: false,
            responsive: false,
            pagingType: 'simple',
            pageLength: 20,
            lengthMenu: [[10, 20, 50, 100, -1], [10, 20, 50, 100, "All"]],
            order: [[0, "desc"]],
            columnDefs: [{
                    // Target the image column
                    targets: 1,
                    filterable: true,
                    sortable: true
                }
            ],
            initComplete: function () {
                var api = this.api(),
                searchBox = angular.element('body').find('#design-search');
                
                // Bind an external input as a table wide search box
                if (searchBox.length > 0) {
                    searchBox.on('keyup', function (event) {
                        api.search(event.target.value).draw();
                    });
                }
            },
        };
        */
        
        vm.pavillionMap = {};
        pavillionDataService.getPavillionData().then(function (object) {
            vm.pavillionData = makePavillionObjectMap(object);
            console.log(vm.pavillionData);
            vm.availableUnit = Object.keys(vm.pavillionData);
            //makeHeartBeatSet(vm.pavillionData);
        });
        
        // function makeHeartBeatSet(pavillionArray){
        //   var heartbeat = {};
        //   angular.forEach(pavillionArray, function(prop, key){
        //       heartbeat[key][]
        //   });
        // }
        
        
        function makePavillionObjectMap(pavillionData) {
            var pavillionDataMap = {}
            pavillionData.forEach(function (data) {
                pavillionDataMap[data.LocationName] = {};
                
            });
            
            angular.forEach(pavillionData, function (data, index) {
                //  console.log(data, index);
                angular.forEach(data, function (prop, key) {
                    //  console.log(prop, key);
                    if (key !== '$type') {
                        pavillionDataMap[data.LocationName][key] = prop;
                    }
                });
            });
            return pavillionDataMap;
            
        }
        
    }
    
    function pavillionDataService($q, msApi) {
        
        var service = {
            data: [],
            getPavillionData: getPavillionData,
        };
        
        function getPavillionData() {
            
            var deferred = $q.defer();
            
            msApi.request('pavillionData@get', {},
                function (response) {
                service.data = response;
                deferred.resolve(response);
            },
                function (err) {
                deferred.reject(response);
            });
            
            return deferred.promise;
        };
        
        return service;
    }
    
})();
