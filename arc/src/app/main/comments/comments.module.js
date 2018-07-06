(
    function () {
        'use strict';

        angular
            .module('app.comments', [])
            .config(config);

        function config($stateProvider, msApiProvider) {
            $stateProvider

                // Home
                .state('app.comments', {
                    url: '/comments?:tagId',
                    views: {
                        'content@app': {
                            templateUrl: 'app/main/comments/comments.html',
                            controller: 'commmentsController as vm'
                        }
                    },
                });
            // Translation
            //  $translatePartialLoaderProvider.addPart('app/main/report');
            // msApiProvider.register('updateProfile', ['/User', {}, {
            //   update: {
            //       method: 'PUT',
            //   }
            //   }]);
            //

            msApiProvider.register('reportlist', ['/Report/Tag/:id',
                {
                    id: '@Id',
                },

            ]);
        }
    })();
