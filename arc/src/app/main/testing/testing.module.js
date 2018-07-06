(function () {
    'use strict';
    
    angular
    .module('app.testing', [])
    .config(config);
    
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        $stateProvider
        
        .state('app.testing', {
            url: '/testing',
            views: {
                'content@app': {
                    templateUrl: 'app/main/testing/testing.html',
                    controller: 'testingController as vm'
                }
            }
        });



         // Api
        var apiUrl = msApiProvider.getBaseUrl();
        msApiProvider.setBaseUrl('http://tf-devsql01:7535/Gfsa.Arc.Api');  //<-----enter Dans special api here

    
            // get tag list
            msApiProvider.register('designTaglist', ['/Tag/TagSource/:id',
              {
                  id: '@Id',
              }
            ]);

            // get importlist
            msApiProvider.register('designImporterlist', ['/TagSource?pageIndex=0&pageCount=500',
                {
                },
                {
                    get: {
                        method: 'get',
                        params: {
                            /* Defaults if any ex. (getByDate: true) */
                        }
                    }
                }
            ]);

        msApiProvider.setBaseUrl(apiUrl);
        

        
    }
    
})();
