(function () {
    'use strict';

    angular
        .module('app.formentry', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider, $translatePartialLoaderProvider) {
        // State
        $stateProvider.state('app.formentry', {
            url: '/formentry/:id',
            views: {
                'content@app': {
                    templateUrl: 'app/main/forms/views/formentry/formentry.html',
                    controller: 'formentryController as vm'
                }
            },
            resolve: {
                ImporterDetailService: function ($stateParams, ImporterDetailService) {
                    return ImporterDetailService.getImporterDetail($stateParams.id);
                },
                TagListService: function ($stateParams, TagListService) {
                    return TagListService.getTagList($stateParams.id);
                }
            }
        });

        // TagSource (importers) details
        msApiProvider.register('importerDetail', ['/TagSource/:id']);

        // TagList by Source
        msApiProvider.register('tagList', ['/Tag/TagSource/:id']);

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

        msApiProvider.register('tagReducedDataDelete', ['/ReportResult/NonReducedReportResult/Tag/:id/Group/:gid',
            {
                id: '@TagId',
            },
            {
              gid: '@GroupId'
            },
            {
              delete:{
                method:'DELETE',
                params:{

                }
              }
            }
        ]);

        //update tag reduced data
        msApiProvider.register('tagReducedData',['/ReportResult/NonReducedReportResult',{},
          {
            update:{
              method:'PUT',
            },
            create:{
              method:'POST'
            }
          }]);


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
