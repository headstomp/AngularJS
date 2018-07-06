(function () {
    'use strict';


    angular
        .module('app.main', [])
        .config(config);

    angular.module('app.main')
        .run(function (msNavigationService, userDetails) {
            var currentUser = null;
            userDetails.getUser()
                .then(function (user) {
                    currentUser = user;
                });
            msNavigationService.saveItem('SendData.excise.app', {
                title: 'Excise App',
                state: 'app.exportexcise',
                translate: 'ARC.EXCISE_APP',
                hidden: function () {
                    return !currentUser || !(currentUser.IsAdmin || _([
                            'GFE\\Erin.McClure',
                            'GFE\\Michael.Jacobson',
                            'GFE\\dlugg-admin',
                        ])
                        .includes(currentUser.Username));
                },
            });
        })

    angular.module('app.main', [])
        .config(config);

    angular.module('app.main')
        .provider('progressIndicator', function ($httpProvider) {

            var $provider = _.merge(this, {
                httpRequestCount: 0,
            $get: function ($http, $rootScope) {
                
                return _.merge(this, {
                    getHttpRequestCount: getHttpRequestCount,
                });
                
                function getHttpRequestCount() {
                    return $provider.httpRequestCount;
                }
                
                $rootScope.$watch(function () {
                    return $provider.httpRequestCount;
                }, function () {
                    console.log($provider.httpRequestCount);
                })
                
            },
        });
        
        $httpProvider.interceptors.push(function ($timeout, $q) {
            return {
                request: function (config) {
                    $timeout(function () {
                        $provider.httpRequestCount += 1;
                    }, 2500);
                    return config;
                },
                requestError: function (rejection) {
                    $provider.httpRequestCount -= 1;
                    return $q.reject(rejection);
                },
                response: function (response) {
                    $provider.httpRequestCount -= 1;
                    return response;
                },
                responseError: function (rejection) {
                    $provider.httpRequestCount -= 1;
                    return $q.reject(rejection);
                },
            };
        });
        
        return $provider;
    });
    
    angular.module('app.main').directive('progressIndicator', function (progressIndicator) {
        return {
            scope: {
                isVisible: '=',
            },
            restrict: 'E',
            controllerAs: '$ctrl',
            bindToController: true,
            template: '<div ng-if="$ctrl.percent > 0 && $ctrl.percent < 100">'
                  + '<md-progress-linear md-mode="determinate" value="{{$ctrl.percent}}"></md-progress-linear>'
                  + '<div style="text-align: center; font-size: 300%;">'
                      + '<span class="fa fa-refresh fa-spin fa-fw"></span>'
                      + '<span>&nbsp;</span>'
                      + '<span>Loading</span>'
                      + '<span>&nbsp;</span>'
                      + '<span ng-if="$ctrl.maxHttpRequestCount > 2">{{$ctrl.percent}}%</span>'
                  + '</div>'
                  + '<style type="text/css">'
                      + 'md-progress-linear,'
                      + 'md-progress-linear .md-container,'
                      + 'md-progress-linear .md-container .md-bar{ height: 15px !important; }'
                  + '</style>'
              + '</div>',
            controller: function ($scope) {
                
                var $ctrl = _.merge(this, {
                    isVisible: false,
                    progressIndicator: progressIndicator,
                    percent: 0,
                    httpRequestCount: 0,
                    maxHttpRequestCount: 0,
                });
                
                var isProgressStarted = false;
                
                $scope.$watch(function () {
                    return $ctrl.progressIndicator.getHttpRequestCount();
                }, function () {
                    $ctrl.httpRequestCount = Math.max(0, $ctrl.progressIndicator.getHttpRequestCount());
                    $ctrl.maxHttpRequestCount = Math.max($ctrl.maxHttpRequestCount, $ctrl.httpRequestCount);
                    if (isProgressStarted === true) {
                        if ($ctrl.httpRequestCount === 0) {
                            isProgressStarted = false;
                            $ctrl.maxHttpRequestCount = 0;
                        }
                    }
                    if (isProgressStarted === false) {
                        if ($ctrl.httpRequestCount > 0) {
                            isProgressStarted = true;
                            $ctrl.maxHttpRequestCount = Math.max($ctrl.maxHttpRequestCount, $ctrl.httpRequestCount);
                        }
                    }
                });
                
                $scope.$watchGroup([
                    '$ctrl.httpRequestCount',
                    '$ctrl.maxHttpRequestCount',
                ], function () {
                    var maxHttpRequestCount = Math.max($ctrl.maxHttpRequestCount, $ctrl.httpRequestCount + 1);
                    $ctrl.percent = Math.floor((1 - ($ctrl.httpRequestCount / maxHttpRequestCount)) * 100);
                    console.log($ctrl.percent);
                });
                
                $scope.$watch('$ctrl.percent', function () {
                    $ctrl.isVisible = ($ctrl.percent > 0 && $ctrl.percent < 100);
                });
                
            },
        };
    });
    
    angular.module('app.main').run(function (msNavigationService, userDetails) {
        var currentUser = null;
        userDetails.getUser().then(function (user) {
            currentUser = user;
        });
        msNavigationService.saveItem('SendData.excise.app', {
            title: 'Excise App',
            state: 'app.exportexcise',
            translate: 'ARC.EXCISE_APP',
            hidden: function () {
                return !currentUser || !(currentUser.IsAdmin || _([
                            'gfe\\erin.mcclure',
                            'gfe\\michael.jacobson',
                            'gfe\\dlugg-admin',
                        ]).includes(currentUser.Username.toLowerCase()));
            },
        });
    })
    
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
        .state('app.main', {});
        
        // Translation
        //$translatePartialLoaderProvider.addPart('app/main');
        
        // Navigation Group Apps
        msNavigationServiceProvider.saveItem('Apps', {
            title: 'APPS',
            group: true,
            weight: 1
        });
        msNavigationServiceProvider.saveItem('Apps.home', {
            title: 'Home',
            icon: 'icon-home',
            state: 'app.home',
            translate: 'ARC.HOME',
            weight: 1
        });
        
        //
        // Importers
        //
        msNavigationServiceProvider.saveItem('Apps.importer', {
            title: 'IMPORTERS',
            icon: 'icon-import',
            translate: 'ARC.IMPORTERS',
            weight: 2,
            group: false
        });
        msNavigationServiceProvider.saveItem('Apps.importer.importerlist', {
            title: 'IMPORTER_LIST',
            state: 'app.importerlist',
            translate: 'ARC.IMPORTER_LIST',
        });
        
        //
        // Tags
        //
        msNavigationServiceProvider.saveItem('Apps.tag', {
            title: 'TAG.TAGS',
            icon: 'icon-tag-text-outline',
            translate: 'ARC.TAGS',
            weight: 3,
            group: false
        });
        msNavigationServiceProvider.saveItem('Apps.tag.taglist', {
            title: 'TAG_LIST',
            state: 'app.taglist',
            translate: 'ARC.TAG_LIST',
        });
        //
        // Forms
        //
        msNavigationServiceProvider.saveItem('Apps.forms', {
            title: 'FORMS',
            icon: 'icon-clipboard-text',
            translate: 'ARC.FORMS',
            weight: 2,
            group: false
        });
        msNavigationServiceProvider.saveItem('Apps.forms.formslist', {
            title: 'FORMS_LIST',
            state: 'app.formslist',
            translate: 'ARC.FORMS_LIST',
        });
        
        //
        // Reports
        //
        msNavigationServiceProvider.saveItem('Apps.report', {
            title: 'REPORTS',
            icon: 'icon-chart-areaspline',
            translate: 'ARC.REPORTS',
            weight: 4,
            group: false
        });
        msNavigationServiceProvider.saveItem('Apps.report.designlist', {
            title: 'MY_DESIGNS',
            state: 'app.designlist',
            translate: 'ARC.MY_DESIGNS',
        });
        
        msNavigationServiceProvider.saveItem('Apps.report.design', {
            title: 'NEW_DESIGN',
            state: 'app.design({id:-1})',
            translate: 'ARC.NEW_DESIGN',
            weight: 3
        });
        msNavigationServiceProvider.saveItem('Apps.report.published', {
            title: 'PUBLISHED_REPORTS',
            state: 'app.publishedlist',
            translate: 'ARC.PUBLISHED_REPORTS',
            weight: 4
        });
        
        //
        // Comments
        //
        msNavigationServiceProvider.saveItem('comments', {
            title: 'Comments',
            state: 'app.comments',
            translate: 'ARC.COMMENTS',
            icon: 'icon-comment',
            group: false,
            weight: 2
        });
        
        //
        // Settings
        //
        msNavigationServiceProvider.saveItem('Settings', {
            title: 'SETTINGS',
            translate: 'ARC.SETTINGS',
            icon: 'icon-cog',
            group: false,
            weight: 2
        });
        msNavigationServiceProvider.saveItem('Settings.translation', {
            title: 'TRANSLATIONS',
            state: 'app.translation',
            translate: 'ARC.TRANSLATIONS',
        });
        msNavigationServiceProvider.saveItem('Settings.profile', {
            title: 'PROFILE',
            state: 'app.profilehome',
            translate: 'ARC.PROFILE',
        });
        
        //
        // Export
        //
        msNavigationServiceProvider.saveItem('SendData', {
            title: 'Send Data',
            translate: 'ARC.EXTERNAL',
            icon: 'icon-export',
            group: false,
            weight: 2
        });
        msNavigationServiceProvider.saveItem('SendData.excise', {
            title: 'Excise',
            translate: 'ARC.EXCISE',
        });
        
        msNavigationServiceProvider.saveItem('SendData.excise.report', {
            title: 'Excise Report',
            state: 'app.design({id:1007})',
            translate: 'ARC.EXCISE_REPORT',
        });
        
        msNavigationServiceProvider.saveItem('SendData.pavillion', {
            title: 'PAVILLION',
            state: 'app.pavillionhome',
            translate: 'ARC.PAVILLION',
        });
        msNavigationServiceProvider.saveItem('SendData.navsessions', {
            title: 'Navision Sessions',
            state: 'app.navsessionhome',
            translate: 'ARC.NAVISION_SESSIONS',
        });
        
        //
        // testing
        //
        msNavigationServiceProvider.saveItem('sandbox', {
            title: 'Testing',
            translate: 'ARC.TESTING',
            icon: 'icon-gift',
            group: false,
            weight: 2,
            devOnly: true,
        });
        msNavigationServiceProvider.saveItem('sandbox.newstuff', {
            title: 'Queries / Builders',
            state: 'app.testing',
            translate: 'ARC.DAN_FILTERS',
        });
        
        msApiProvider.register('getUser', ['/User/Current', {}, {
                    query: {
                        method: 'GET',
                        params: {}
                    }
                }
            ]);
        
        msApiProvider.register('getLocation', ['/Location', {}, {
                    query: {
                        method: 'GET',
                        isArray: true,
                        params: {}
                    }
                }
            ]);
    }
})();
