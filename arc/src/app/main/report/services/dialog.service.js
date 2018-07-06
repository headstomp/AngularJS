(function ()
{
    'use strict';

    angular
        .module('app.report')
        .factory('DialogService', DialogService);

    /** @ngInject */
    function DialogService($mdDialog, $document)
    {
        var service = {
            openCardDialog: openCardDialog
        };

        //////////

        /**
         * Open card dialog
         *
         * @param ev
         * @param cardId
         */
        function openCardDialog(ev, cardId)
        {
            $mdDialog.show({
                templateUrl        : 'app/main/apps/report/dialogs/card/card-dialog.html',
                controller         : 'reportCardDialogController',
                controllerAs       : 'vm',
                parent             : $document.find('#report'),
                targetEvent        : ev,
                clickOutsideToClose: true,
                escapeToClose      : true,
                locals             : {
                    cardId: cardId
                }
            });
        }

        return service;
    }
})();