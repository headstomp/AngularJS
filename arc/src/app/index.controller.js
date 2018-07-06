  (function () {
      'use strict';

      angular
          .module('fuse')
          .controller('IndexController', IndexController);

      /** @ngInject */
      function IndexController(fuseTheming, $scope, $state) {
          var vm = this;

          // Data
          vm.themes = fuseTheming.themes;

          vm.debug = false;

          vm.stateClassSet = [];

          $scope.$state = $state;
          $scope.$watch('$state.current', function () {
              var classNameSet = [];
              var nameStack = []
              _.get($state, 'current.name', '')
                  .split(/\./)
                  .forEach(function (name) {
                      nameStack.push(name);
                      var className = nameStack.join('-')
                          .toLowerCase();
                      classNameSet.push(className);
                  });
              vm.stateClassSet = classNameSet;
          });

          //////////
      }
  })();
