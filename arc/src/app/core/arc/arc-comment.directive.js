(function () {
    
    'use strict';
    
    angular.module('app.core').directive('arcComment', function (arcCommentService, $timeout) {
        
        return {
            restrict: 'E',
            scope: {
                service: '=',
            },
            bindToController: true,
            templateUrl: 'app/core/arc/arc-comment.html',
            controllerAs: 'vm',
            controller: function arcCommentDirectiveController ($scope) {
                var vm = _.merge(this, {
                    comment: arcCommentService.getEmptyComment(),
                    service: {
                        save: save,
                        clear: clear,
                    },
                });
                
                function save(params) {
                    console.log(params);
                    vm.comment = _.merge(vm.comment, params);
                    console.log(vm.comment);
                    return arcCommentService.saveComment(vm.comment);
                }
                
                function clear() {
                    vm.comment = arcCommentService.getEmptyComment();
                }
            },
        };
    });
    
})();
