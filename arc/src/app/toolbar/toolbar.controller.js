(function () {
    'use strict';

    angular
    .module('app.toolbar')
    .controller('ToolbarController', ToolbarController);

    angular
    .module('app.toolbar')
    .service('currentLanguageService', function () {
        return new(function currentLanguageService() {
            this.currentLanguage = 'EN';
            this.displayName = '';
        });
    });

    /** @ngInject */
    function ToolbarController($rootScope, msApi, $q, $state, $timeout, $mdSidenav, $translate, $mdToast, msNavigationService, userDetails, $cookieStore, currentLanguageService, $scope) {
        var vm = this;

        //
        // If we're not in production, display the BASE_URL
        //
        if ($rootScope.BASE_URL.indexOf('api.arc.greenfieldethanol.com') === -1) {
            vm.environment = $rootScope.BASE_URL;
        }

        // Data
        $rootScope.global = {
            search: ''
        };
        vm.bodyEl = angular.element('body');
        vm.userStatusOptions = [{
                'title': 'Online',
                'icon': 'icon-checkbox-marked-circle',
                'color': '#4CAF50'
            }, {
                'title': 'Away',
                'icon': 'icon-clock',
                'color': '#FFC107'
            }, {
                'title': 'Do not Disturb',
                'icon': 'icon-minus-circle',
                'color': '#F44336'
            }, {
                'title': 'Offline',
                'icon': 'icon-checkbox-blank-circle-outline',
                'color': '#616161'
            }
        ];
        vm.languages = {
            EN: {
                'title': 'English',
                'translation': 'ARC.ENGLISH',
                'code': 'EN',
                'flag': 'ca'
            },
            FR: {
                'title': 'French',
                'translation': 'ARC.FRENCH',
                'code': 'FR',
                'flag': 'ca'
            }
        };

        // Methods
        vm.toggleSidenav = toggleSidenav;
        vm.logout = logout;
        vm.changeLanguage = changeLanguage;
        vm.setUserStatus = setUserStatus;
        vm.toggleHorizontalMobileMenu = toggleHorizontalMobileMenu;
        vm.toggleMsNavigationFolded = toggleMsNavigationFolded;
        vm.search = search;
        vm.searchResultClick = searchResultClick;

        //////////

        init();

        /**
         * Initialize
         */
        function init() {
            // Select the first status as a default
            vm.userStatus = vm.userStatusOptions[0];
            getUser();

        }

        // get username
        function getUser() {
            //stub
            userDetails.getUser().then(function (user) {
                currentLanguageService.displayName = user.DisplayName;
                vm.username = currentLanguageService.displayName;
                vm.selectedLanguage = vm.languages[user.LanguageCode];
                currentLanguageService.currentLanguage = user.LanguageCode;
                console.log("Lang From Database", currentLanguageService.currentLanguage);
                $translate.use(currentLanguageService.currentLanguage);

            });
        };

        $scope.$watch(function () {
            return currentLanguageService.currentLanguage;
        }, function (newValue, oldValue) {
            console.log('value changed', oldValue, newValue);
            vm.selectedLanguage = vm.languages[newValue];

        });

        $scope.$watch(function () {
            return currentLanguageService.displayName;
        }, function (newValue, oldValue) {
            console.log('value changed', oldValue, newValue);
            vm.username = newValue;
        });

        vm.gotoHelp = gotoHelp;
        function gotoHelp (app) {
            if (app == 'full') {
                window.open("https://docs.google.com/document/d/19L414PkngoiHVhZBzR9VbjxCZ73_4A-ZDy3L4WvwUHk/pub", 'HTML', 'height=600,width=800');
            } else {
                return
            }
        };
        /**
         * Toggle sidenav
         *
         * @param sidenavId
         */
        function toggleSidenav(sidenavId) {
            $mdSidenav(sidenavId).toggle();
        }

        /**
         * Sets User Status
         * @param status
         */
        function setUserStatus(status) {
            vm.userStatus = status;
        }

        /**
         * Logout Function
         */
        function logout() {
            // Do logout here..
        }

        /**
         * Change Language
         */
        function changeLanguage(lang) {
            vm.selectedLanguage = lang;

            /**
             * Show temporary message if user selects a language other than English
             *
             * angular-translate module will try to load language specific json files
             * as soon as you change the language. And because we don't have them, there
             * will be a lot of errors in the page potentially breaking couple functions
             * of the template.
             *
             * To prevent that from happening, we added a simple "return;" statement at the
             * end of this if block. If you have all the translation files, remove this if
             * block and the translations should work without any problems.
             *
            if ( lang.code !== 'en' ){
            var message = 'Fuse supports translations through angular-translate module, but currently we do not have any translations other than English language. If you want to help us, send us a message through ThemeForest profile page.';

            $mdToast.show({
            template : '<md-toast id="language-message" layout="column" layout-align="center start"><div class="md-toast-content">' + message + '</div></md-toast>',
            hideDelay: 7000,
            position : 'top right',
            parent   : '#content'
            });

            return;
            }
             */

            // Change the language
            $translate.use(lang.code);
            currentLanguageService.currentLanguage = lang.code;

            // $translate.use(vm.selectedLanguage);
        }

        /**
         * Toggle horizontal mobile menu
         */
        function toggleHorizontalMobileMenu() {
            vm.bodyEl.toggleClass('ms-navigation-horizontal-mobile-menu-active');
        }

        /**
         * Toggle msNavigation folded
         */
        function toggleMsNavigationFolded() {
            msNavigationService.toggleFolded();
        }

        /**
         * Search action
         *
         * @param query
         * @returns {Promise}
         */
        function search(query) {
            var navigation = [],
            flatNavigation = msNavigationService.getFlatNavigation(),
            deferred = $q.defer();

            // Iterate through the navigation array and
            // make sure it doesn't have any groups or
            // none ui-sref items
            for (var x = 0; x < flatNavigation.length; x++) {
                if (flatNavigation[x].uisref) {
                    navigation.push(flatNavigation[x]);
                }
            }

            // If there is a query, filter the navigation;
            // otherwise we will return the entire navigation
            // list. Not exactly a good thing to do but it's
            // for demo purposes.
            if (query) {
                navigation = navigation.filter(function (item) {
                        if (angular.lowercase(item.title).search(angular.lowercase(query)) > -1) {
                            return true;
                        }
                    });
            }

            // Fake service delay
            $timeout(function () {
                deferred.resolve(navigation);
            }, 1000);

            return deferred.promise;
        }

        /**
         * Search result click action
         *
         * @param item
         */
        function searchResultClick(item) {
            // If item has a link
            if (item.uisref) {
                // If there are state params,
                // use them...
                if (item.stateParams) {
                    $state.go(item.state, item.stateParams);
                } else {
                    $state.go(item.state);
                }
            }
        }
    }

})();
