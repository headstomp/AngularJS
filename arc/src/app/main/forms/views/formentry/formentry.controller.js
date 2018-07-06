(function () {
    'use strict';

    angular
    .module('app.formentry')
    .controller('formentryController', formentryController);

    angular
    .module('app.formentry')
    .filter('reducedDataSearch', function () {
        return function (object, search) {

            if (!object)
                return object;
            if (!search)
                return object;

            var result = {}

            angular.forEach(object, function (tagObj, date) { //each object in tag comprises of date and and tag values
                angular.forEach(tagObj, function (value) { // comparing each propery value against the search string
                    var data = value.toString();
                    if (data.indexOf(search.toString()) !== -1) {
                        result[date] = tagObj;
                    }
                });
            });
            return result;
        }
    });

    /** @ngInject */
    function formentryController($document, $mdDialog, msApi, ImporterDetailService, TagListService, $timeout, $q, $scope) {
        var vm = this;
        vm.dtOptions = {
            //f = search
            dom: 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            autoWidth: false,
            responsive: false,
            pagingType: 'simple',
            pageLength: 20,
            lengthMenu: [[10, 20, 50, 100, -1], [10, 20, 50, 100, "All"]],
            columnDefs: [{
                    // Target the image column
                    targets: 1,
                    filterable: true,
                    sortable: true
                }
            ]
        };
        vm.search = '';
        vm.isOpen = false;
        $scope.$watch('vm.isOpen', function (newValue, oldValue) {
            console.log(newValue, oldValue);
            if (newValue) {
                vm.search = '';
            }
        });
        //console.log(vm.search);

        vm.formDetails = ImporterDetailService;
        vm.tagList = TagListService;
        vm.tagData = [];
        vm.tagResultSet = {};
        vm.keysForUpdate = [];

        vm.diableSaveButton = false;
        vm.tagResolvedData = {};

        // Methods
        vm.addTagRow = addTagRow;
        vm.markForUpdate = markForUpdate;
        vm.saveTagData = saveTagData;
        vm.deleteTagRow = deleteTagRow;

        vm.tagIds = vm.tagList.map(function (tag) {
          //  console.log(tag);
                return tag.Id;
            });
        console.log('vm.tagIds', vm.tagIds);

        function getReportReducedResults(tagId) {

            var promises = tagId.map(function (id) {
                  //  console.log(id);
                    var deferred = $q.defer();
                    msApi.request('tagresult@query', {
                        id: id
                    }, function (response) {
                        deferred.resolve(response);
                        //console.log('Promises made again');
                    }, function (err) {
                        console.log('error', err);
                    });
                    return deferred.promise;

                });
            return promises;
        }

        // promise resolve start

        var tagPromises = getReportReducedResults(vm.tagIds);

        refreshTagData(tagPromises); // first request on page load

        function refreshTagData(tagPromises) {
            vm.tagResolvedData = {};
          //  console.log(tagPromises);
            vm.tagResultMap = {};
            var tagResultMap = {};
            var tempObj = {};
            var temp = [];
            $q.all(tagPromises)
            .then(function (promiseValues) {
                vm.tagData = promiseValues;
              //  console.log(vm.tagData);
                angular.forEach(vm.tagData, function (tagObject, tagObjectkey) {
                    var tag = vm.tagData[tagObjectkey];

                    if (tag.hasOwnProperty('1')) {
                        var tagData = tag[1];
                        var count = 0;
                      //  console.log('new tag');
                        angular.forEach(tagData, function (tagValueObject, tagKey) {
                            if (tagKey !== '$type' && (!tagResultMap.hasOwnProperty(tagKey))) {
                                tagResultMap[tagKey] = {}; //temp[count] = tagResultMap[tagKey];
                            }
                        });
                   }
                });
              //  console.log(tagResultMap);
                var data = createMap(tagResultMap, vm.tagData);
                vm.tagResolvedData = data.tagResultMap
                    vm.originalTagData = angular.copy(tagResultMap);
                vm.requestObjs = data.requestObjs;
              //  console.log(vm.requestObjs);
            });
        }

        function getRequestObjects(tags){

          return  tags[1][Object.keys(tags[1])[Object.keys(tags[1]).length-1]][0]

        }

        function createMap(tagResultMap, tagObjects) {
            //console.log(tagObjects);
            var count = 0;
            var counter = 0;
            var requestObjs = [];
            var tagObjCount = vm.tagIds.length;
            var flag = true;
            angular.forEach(tagResultMap, function (emptyObj, key) {
                angular.forEach(tagObjects, function (tagValue) {
                    if (flag) {
                      var tempReqObj =   getRequestObjects(tagValue);
                      requestObjs.push(tempReqObj);
                        if (requestObjs.length === tagObjCount) {
                            flag = false;
                        }
                      }
                    if (!tagValue['1'][key]) {
                        emptyObj[counter] = '';
                    } else {
                        emptyObj[counter] = tagValue['1'][key][0]['Value'];
                    }
                    counter++;
                });
                counter = 0;
            });
            return {
                tagResultMap: tagResultMap,
                requestObjs: requestObjs
            };

        }

        function isEmpty(obj) {
            for (var key in obj) {
                if (obj.hasOwnProperty(key))
                    return false;
            }
            return true;
        }

        function getEmptyObject(obj) {

            console.log(obj);
            var date = new Date();
            var dateKey = date.toISOString();
            angular.forEach(obj, function (object, key) {
                obj['DateTime'] = dateKey;
                obj['GroupId'] = dateKey.replace(/\D/g, '');
                obj['Value'] = checkType(temp[i]['Value']);

                console.log(temp);
            });
        }

        function addTagRow() {
            var count = vm.tagIds.length;
            var obj = {};
            var date = new Date();
            var dateKey = date.toISOString();
            var tagResolvedData = {};
            for (var i = 0; i < count; i++) {
                obj[i] = "";
            }
            tagResolvedData[dateKey] = obj;
            angular.forEach(vm.tagResolvedData, function (tag, key) {
                tagResolvedData[key] = tag;
            });
            vm.tagResolvedData = {};
            vm.tagResolvedData = tagResolvedData;
          //  console.log(vm.tagResolvedData);
        }

        function markForUpdate(date) { // gets the date from view of edited or new tag data row
            if (vm.keysForUpdate.indexOf(date) == -1) {
                vm.keysForUpdate.push(date);
                console.log(vm.keysForUpdate);
            }
        }

        function saveTagData() {
            var counter = 0;
            var tagKeys = Object.keys(vm.originalTagData);
            //console.log(tagKeys);
            angular.forEach(vm.keysForUpdate, function (key) {
                if (tagKeys.indexOf(key) === -1) {
                    console.log('creating new');
                    var count = 0;
                    angular.forEach(vm.tagResolvedData[key], function (data) {
                      //  console.log(data);
                        var reqObj = angular.copy(vm.requestObjs[count]);
                        reqObj.DateTime = key;
                        reqObj.GroupId = key.replace(/\D/g, '');
                        reqObj.Value = data;
                      //  console.log(reqObj);
                        msApi.request('tagReducedData@create', reqObj)
                        .then(function (resolve) {
                            console.log('success', resolve);

                        }).catch (function (err) {
                            console.log('err', err);
                        });
                        count++;
                    });
                } else {
                    console.log('updating');
                    var count = 0;
                    angular.forEach(vm.tagResolvedData[key], function (data) {
                        var reqObj = angular.copy(vm.requestObjs[count]);
                        reqObj.DateTime = key;
                        reqObj.GroupId = key.replace(/\D/g, '');
                        reqObj.Value = data;
                      //  console.log(reqObj);
                        msApi.request('tagReducedData@create', reqObj)
                        .then(function (resolve) {
                            console.log('success', resolve);

                        }).catch (function (err) {
                            console.log('err', err);
                        });
                        count++;
                    });
                }
                counter++;
                if (counter == vm.keysForUpdate.length) {
                    vm.tagResolvedData = {};
                    setTimeout(function () {

                        console.log(vm.tagIds);
                        var tagPromises = getReportReducedResults(vm.tagIds);
                        refreshTagData(tagPromises);
                        vm.keysForUpdate = [];
                        counter = 0;
                    }, 1000);
                }

            })
        }

        function tagPostRequest(tag) {
            console.log('called');

            //  return;
        }
        // Deleting by group and tag id

        vm.gotoHelp = gotoHelp;
        function gotoHelp (app) {
            console.log('help');
            if (app == 'formEntry') {
                window.open("https://docs.google.com/document/d/19L414PkngoiHVhZBzR9VbjxCZ73_4A-ZDy3L4WvwUHk/edit#heading=h.4s1lazf35oay", 'HTML', 'height=600,width=800');
            } else {
                return
            }
        };

        function deleteTagRow(key) {

            var confirm = $mdDialog.confirm()
                .title('Are you sure?')
                .content('The Values for ' + key + ' will be deleted.')
                .ariaLabel('Delete Value')
                .ok('Delete')
                .cancel('Cancel')
                .targetEvent(event);

            $mdDialog.show(confirm).then(function () {
                var GroupId = key.replace(/\D/g, ''); // objToDelete contains object and data array then object
                delete vm.tagResolvedData[key];
                var tagResolvedData = vm.tagResolvedData;
                vm.tagResolvedData = {};
                angular.forEach(vm.tagIds, function (tagId) {
                    console.log(tagId, GroupId);
                    // gives an array to get data from
                    msApi.request('tagReducedDataDelete@delete', {
                        id: tagId,
                        gid: GroupId
                    })
                    .then(function (resolve) {
                        console.log('deleted');
                    }).catch (function (err) {
                        console.log('err', err);
                    });

                });
                vm.tagResolvedData = tagResolvedData;

            }, function () {
                // Cancel Action
            });

        }

        function checkType(value) {
            if (typeof value === 'number')
                return 0;
            if (typeof value === 'string')
                return '';
            if (typeof value === 'boolean')
                return false;
        }
    }
})();
