(function () {
    angular.module('app.demoTable', [])
        .config(config);

    function config($stateProvider, msApiProvider) {

        $stateProvider.state('app.demoTable', {
            url: '/demotable',
            views: {
                'content@app': {
                    templateUrl: 'app/main/demoTable/demoTable.html',
                    controller: 'demoTableController as vm'
                }
            },
            resolve: {
                TagData: function (tagDataService) {
                    return tagDataService.getTagResult(2);
                }
            }
        });

        msApiProvider.register('tagresult', ['/TagReducedResult/:id',
            {
                id: '@Id',
            },
            {
                query: {
                    method: 'get',
                    params: {
                        /* Defaults if any ex. (getByDate: true) */
                    }
                }
            }
        ]);


    }
})();
