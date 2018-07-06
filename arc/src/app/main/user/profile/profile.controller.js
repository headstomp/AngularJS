(function () {
    'use strict';

    angular
        .module('app.profile')
        .controller('profileController', profileController);

    /** @ngInject */

    /** @ngInject */
    function profileController($qb, msNavigationService, userDetails, msApi, $translate, $cookieStore, currentLanguageService, locations) {
        var vm = this;

        vm.commentWhereSet = [
            $qb.where.equalTo('CreatedBy', $qb.as.string('no user')),
        ];

        vm.arcProfileDTInstance = {};

        vm.arcProfileDTOptions = {
            dom: 'rt<"bottom"<"left"<""B>><"right"<"info"i><"pagination"p>>>',
            buttons: [
                'copy',
                'print',
                'pdf',
                'excel'
            ],
            autoWidth: false,
            responsive: false,
            pagingType: 'simple',
            pageLength: 10,
            lengthMenu: [
                [10, 20, 50, 100, -1],
                [10, 20, 50, 100, "All"]
            ],

            initComplete: function () {
                var api = this.api(),
                    searchBox = angular.element('body')
                    .find('#design-search');

                // Bind an external input as a table wide search box
                if (searchBox.length > 0) {
                    searchBox.on('keyup', function (event) {
                        api.search(event.target.value)
                            .draw();
                    });
                }
            },
        };

        vm.update = function (lang) {
            //  $cookieStore.put('sessionLanguage',lang );
            $translate.use(lang);
        };

        function init() {
            //  $translate.use($cookieStore.get('sessionLanguage'));
        }

        vm.widgetIcons = {
            accountIcon: 'assets/images/avatars/profile.jpg',
        };
        vm.langs = [
            "EN",
            "FR"
        ];

        //  function getOsLang(){
        //    return navigator.language.substring(0,2).toUpperCase();
        //  }
        init();
        getUserProfile();

        vm.gotoHelp = gotoHelp;

        function gotoHelp(app) {
            console.log('help');
            if (app == 'profile') {
                window.open("https://docs.google.com/document/d/19L414PkngoiHVhZBzR9VbjxCZ73_4A-ZDy3L4WvwUHk/edit#heading=h.h8uhb8s3ziv", 'HTML', 'height=600,width=800');
            }
            else {
                return
            }
        };

        function getUserProfile() {
            userDetails.getUser()
                .then(function (user) {
                    console.log(user);
                    vm.master = user;
                    //  var tempUserName = vm.master.Username;
                    //  vm.userName = tempUserName.split('\\');

                    vm.commentWhereSet = [
                        $qb.where.equalTo('CreatedBy', $qb.as.string(vm.master.Username)),
                    ];


                    vm.user = angular.copy(vm.master);
                    vm.update(vm.user.LanguageCode);
                    currentLanguageService.currentLanguage = vm.user.LanguageCode;
                    currentLanguageService.displayName = vm.user.DisplayName;
                    if (vm.master.IsAuthenticated) {
                        vm.widgetIcons.isAdmin = 'icon-account-check';
                    }
                    else {
                        vm.widgetIcons.isAdmin = 'icon-account-minus';
                    }
                })
                .catch(function (err) {
                    console.log('error', err);
                });

        }

        vm.updateUser = function (user) {
            userDetails.updateUser(user)
                .then(function (user) {
                    vm.update(user.LanguageCode);
                    getUserProfile();
                    console.log('successfully Profile fetched');
                });
        }

        getLocation();

        // get locations
        function getLocation() {
            locations.getLocation()
                .then(function (locations) {
                    vm.locationSet = locations;
                });
        };
    }
})();
