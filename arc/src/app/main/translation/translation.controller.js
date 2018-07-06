(function () {
    'use strict';
    
    angular
    .module('app.translation')
    .controller('TranslationController', TranslationController);
    
    angular
    .module('app.translation')
    .filter('translationSearch', function () {
        return function (object, search) {
            // console.log('object from api',object);
            if (!object) {
                return object;
            }
            if (!search) {
                return object;
            }
            var expected = String(search).toUpperCase();
            var result = {};
            angular.forEach(object, function (value, key) {
                if (_.some(value, function (translation) {
                    return translation.SourceKey.toUpperCase().indexOf(expected) > -1
                        || translation.Target.toUpperCase().indexOf(expected) > -1;
                })) {
                    result[key] = value;
                }
            });
            console.log(result);
            return result;
        };
    });
    
    angular
    .module('app.translation')
    .filter('objectLimitTo', function () {
        return function (object, index, count) {
            // console.log(Object.keys(object));
            var keySet = Object.keys(object).slice(index * count, (index + 1) * count);
            // console.log(keySet);
            if (keySet.length < 1) {
                return [];
            }
            var resultObject = {};
            angular.forEach(keySet, function (key) {
                resultObject[key] = object[key];
            });
            //console.log('resultObject', resultObject);
            return resultObject;
        };
    });
    
    /** @ngInject */
    function TranslationController($scope, $timeout, msApi, $mdDialog) {
        var vm = this;
        
        //
        // Empty tranlsation objects
        //
        var emptyTranslation = {};
        msApi.request('emptyTranslation@get').then(function (translation) {
            emptyTranslation = angular.extend({}, translation);
            emptyTranslation.ApplicationKey = 'ARC';
        });
        
        function getEmptyTranslation() {
            return angular.copy(emptyTranslation);
        }
        
        function getEmptyTranslationSet(sourceKey) {
            var languageMap = {};
            angular.forEach(vm.supportedLanguageSet, function (supportedLanguage) {
                languageMap[supportedLanguage.LanguageCode] = angular.extend(getEmptyTranslation(), {
                    SourceKey: sourceKey,
                    LanguageCode: supportedLanguage.LanguageCode,
                });
            });
            return languageMap;
        }
        
        //
        // Supported languages for Arc
        //
        var supportedLanguageSet = [{
                LanguageCode: 'en',
                Name: 'English'
            },
            {
                LanguageCode: 'fr',
                Name: 'French'
            },
        ];
        vm.supportedLanguageSet = supportedLanguageSet;
        
        vm.pageCount = 12;
        vm.pageIndex = 0;
        
        vm.pageFirst  = function () {
            vm.pageIndex = 0;
            console.log(vm.pageIndex);
        };
        vm.pagePrevious = function () {
            vm.pageIndex = Math.max(vm.pageIndex - 1, 0);
            console.log(vm.pageIndex);
        };
        vm.pageNext = function () {
            vm.pageIndex = Math.min(vm.pageIndex + 1, Math.floor(Object.keys(vm.sourceLanguageMap).length / vm.pageCount));
            console.log(vm.pageIndex);
        };
        vm.pageLast = function () {
            vm.pageIndex = Math.floor(Object.keys(vm.sourceLanguageMap).length / vm.pageCount);
            console.log(vm.pageIndex);
        };
        
        //
        // Refresh the translation map
        //
        function refresh() {
            vm.sourceLanguageMap = {};
            msApi.request('translationSet@get').then(function (translationSet) {
                var sourceLanguageMap = {};
                translationSet.sort(function (t1, t2) {
                    return t1.SourceKey < t2.SourceKey ? -1 : 1;
                });
                angular.forEach(translationSet, function (translation, index) {
                    translation.SearchTarget = translation.Target;
                    if (!(translation.SourceKey in sourceLanguageMap)) {
                        sourceLanguageMap[translation.SourceKey] = {};
                    }
                    if (!(translation.LanguageCode in sourceLanguageMap[translation.SourceKey])) {
                        sourceLanguageMap[translation.SourceKey][translation.LanguageCode] = angular.extend({}, translation);
                    }
                });
                vm.sourceLanguageMap = sourceLanguageMap;
            });
        }
        refresh();
        
        // $scope.$watch(angular.bind(this, function () {
        //     return this.search;
        // }), function (search) {
        //     console.log(search);
        // }, true);
        
        vm.add = function () {
            
            var sourceLanguageMap = vm.sourceLanguageMap;
            
            $mdDialog.show({
                templateUrl: 'app/main/translation/translation-add.dialog.html',
                controllerAs: 'vm',
                controller: function ($mdDialog) {
                    var vm = angular.extend(this, {
                        sourceKey: '',
                        targetMap: {},
                        supportedLanguageSet: supportedLanguageSet,
                    }, {
                        cancel: $mdDialog.hide,
                        create: function () {
                            console.log(vm.sourceKey);
                            var translationMap = {};
                            angular.forEach(vm.targetMap, function (map, languageCode) {
                                var translation = getEmptyTranslation();
                                translation.ApplicationKey = 'ARC';
                                translation.LanguageCode = languageCode;
                                translation.SourceKey = vm.sourceKey;
                                translation.Target = map.target;
                                translationMap[languageCode] = translation;
                            });
                            translationMap.DoUpdate = true;
                            sourceLanguageMap[vm.sourceKey] = translationMap;
                            save();
                            $mdDialog.hide();
                        },
                    });
                },
            });
        };
        
        function addSourceKey(sourceKey) {
            var languageMap = getEmptyTranslationSet(sourceKey);
            vm.sourceLanguageMap[sourceKey] = languageMap;
            console.log(vm.sourceLanguageMap);
        }
        
        vm.markForUpdate = function (sourceKey, languageCode) {
            if (!vm.sourceLanguageMap[sourceKey]) {
                vm.sourceLanguageMap[sourceKey] = {};
            }
            // console.log(vm.sourceLanguageMap[sourceKey]);
            vm.sourceLanguageMap[sourceKey].DoUpdate = true;
            if (!vm.sourceLanguageMap[sourceKey][languageCode]) {
                vm.sourceLanguageMap[sourceKey][languageCode] = getEmptyTranslation();
            }
            // TODO: bug here, the empty translation isn't being set
            vm.sourceLanguageMap[sourceKey][languageCode].LanguageCode = languageCode;
            vm.sourceLanguageMap[sourceKey][languageCode].ApplicationKey = 'ARC';
            vm.sourceLanguageMap[sourceKey][languageCode].SourceKey = sourceKey;
            // console.log(vm.sourceLanguageMap[sourceKey][languageCode]);
        };

        vm.gotoHelp = gotoHelp;
        function gotoHelp (app) {
            console.log('help');
            if (app == 'translation') {
                window.open("https://docs.google.com/document/d/1ZD16FP849E-YB2jIWfmM3I-j8wrWnGb2Y7xHe4r9vrE/pub", 'HTML', 'height=600,width=800');
            } else {
                return
            }
        };
        
        
        vm.save = save;
        function save () {
            var updateTranslationSet = [];
            var createTranslationSet = [];
            angular.forEach(vm.sourceLanguageMap, function (languageMap) {
                // console.log(languageMap);
                if (languageMap.DoUpdate) {
                    delete languageMap.DoUpdate;
                    // console.log(languageMap);
                    angular.forEach(languageMap, function (translation, languageCode) {
                        delete translation.SearchTarget;
                        if (languageCode == '$type') {
                            return;
                        }
                        // console.log(translation);
                        if (!('Id' in translation) || translation.Id == 0) {
                            translation.Id = 0;
                            createTranslationSet.push(translation);
                            return;
                        }
                        updateTranslationSet.push(translation);
                    });
                }
            });
            if (!!updateTranslationSet.length) {
                msApi.request('translationSet@update', updateTranslationSet).then(function () {
                    refresh();
                });
            }
            if (!!createTranslationSet.length) {
                msApi.request('translationSet@create', createTranslationSet).then(function () {
                    refresh();
                });
            }
            refresh();
        };
    }
})();
