(function () {
    'use strict';

    angular
        .module('app.formsdetail', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider, $translatePartialLoaderProvider) {
        // State
        $stateProvider.state('app.formsdetail', {
            url: '/formdetail/:id',
            views: {
                'content@app': {
                    templateUrl: 'app/main/forms/views/formdetail/formdetail.html',
                    controller: 'formsdetailController as vm'
                }
            },
            resolve: {
                ImporterDetailService: function ($stateParams, ImporterDetailService) {
                    return ImporterDetailService.getImporterDetail($stateParams.id);
                }
            }
        });
        
        $stateProvider.state('app.formsopener', {
            url: '/formsopener/:id',
            views: {
                'content@app': {
                    template: '<div style="padding: 2em">Your form is opening...</div>',
                    controller: 'formsopenerController as vm'
                }
            },
        });

        // TagSource (importers) details
        msApiProvider.register('importerDetail', ['/TagSource/:id']);



        // get tag results
        msApiProvider.register('tagresult', ['/TagReducedResult/:id',
            {
                id: '@Id',
            },
            {
                query: {
                    method: 'query',
                    params: {
                        /* Defaults if any ex. (getByDate: true) */
                    }
                }
            }
        ]);

        // get report list
        msApiProvider.register('reportlist', ['/Report/Tag/:id',
            {
                id: '@Id',
            },

        ]);

        // update report details
        msApiProvider.register('editValue', ['/ReportResult/NonReduced',
            {
            },
            {
                update: {
                    method: 'POST',
                    params: {
                        /* Defaults if any ex. (getByDate: true) */
                    }
                },
                del: {
                    method: 'DELETE',
                    params: {
                        /* Defaults if any ex. (getByDate: true) */
                    }
                }
            }
        ]);
    }
})();
