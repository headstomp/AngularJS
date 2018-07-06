(function () {
    
    angular.module('app.core').directive('arcExpressionBuilder', function () {
        return {
            scope: {
                mvel: '=?',
                mvelJson: '=?',
                isValid: '=?',
            },
            bindToController: true,
            replace: true,
            restrict: 'E',
            templateUrl: 'app/core/arc/arc-expression-builder.html',
            controllerAs: 'vm',
            controller: function ($scope, $danApi, $qb, $element, $mdDialog) {
                var vm = _.merge(this, {
                        _: _,
                        isValid: false,
                        expression: '',
                        nameSet: [],
                        mapping: {},
                        mvel: '',
                        utex: '',
                        aspectMap: {
                            'lst': 'Last Value',
                            'wvg': 'Weighted Average',
                            'avg': 'Average',
                            'min': 'Minimum',
                            'max': 'Maximum',
                            'tot': 'Total',
                            'cnt': 'Count',
                            'rng': 'Range',
                            'var': 'Variance',
                        },
                        constantMap: {
                            'ln2': Math.LN2,
                            'ln10': Math.LN10,
                            'log2e': Math.LOG2E,
                            'log10e': Math.LOG10E,
                            'pi': Math.PI,
                        },
                        tagSourceWhereSet: [
                            $qb.where.equalTo('DataLocationId', $qb.as.int64(4)),
                        ],
                        showExpressionSyntaxHelpDialog: function () {
                            var dialog = $mdDialog.show({
                                    multiple: true,
                                    fullscreen: true,
                                    templateUrl: 'app/core/arc/arc-expression-syntax-help-dialog.html',
                                    controllerAs: 'vm',
                                    controller: function () {
                                        var vm = _.merge(this, {
                                                tagSource: {},
                                                close: $mdDialog.hide,
                                                setExpression: function (expression) {
                                                    $mdDialog.hide(expression);
                                                },
                                            });
                                    },
                                });
                            dialog.then(function (expression) {
                                if (expression) {
                                    vm.expression = expression;
                                }
                            });
                        },
                        showExpressionCatalogDialog: function () {
                            var dialog = $mdDialog.show({
                                    multiple: true,
                                    fullscreen: true,
                                    templateUrl: 'app/core/arc/arc-expression-catalog-dialog.html',
                                    controllerAs: 'vm',
                                    controller: function () {
                                        var vm = _.merge(this, {
                                                tagSource: {},
                                                close: $mdDialog.hide,
                                                setExpression: function (expression) {
                                                    $mdDialog.hide(expression);
                                                },
                                            });
                                    },
                                });
                            dialog.then(function (expression) {
                                if (expression) {
                                    vm.expression = expression;
                                }
                            });
                        },
                    });
                
                ///////////////////////////////////////////////////////////////////////////////////
                
                vm.currentError = '';
                vm.isExpressionValid = false;
                vm.isMappingValid = false;
                vm.isFormValid = false;
                
                $scope.$watch('vm.mvel', function () {
                    vm.mvelJson = angular.toJson(vm.mvel);
                });
                
                $scope.$watch('vm.expressionForm', function () {
                    vm.isFormValid = _.isEmpty(vm.expressionForm.$error);
                }, true);
                
                $scope.$watchGroup([
                        'vm.isExpressionValid',
                        'vm.isMappingValid',
                        'vm.isFormValid',
                    ], function () {
                    console.log({
                        isExpressionValid: vm.isExpressionValid,
                        isMappingValid: vm.isMappingValid,
                        isFormValid: vm.isFormValid,
                    });
                    vm.isValid = vm.isExpressionValid && vm.isMappingValid && vm.isFormValid;
                });
                
                $scope.$watch('vm.expression', function () {
                    vm.isExpressionValid = processExpression();
                    processMapping();
                });
                
                var functionMap = {
                    sqrt: 1,
                    cbrt: 1,
                    floor: 1,
                    ceil: 1,
                    round: 1,
                    pow: 2,
                    abs: 1,
                };
                
                function processExpression() {
                    try {
                        var node = getNode();
                        var nameSet = [];
                        node.traverse(function (node, path, parent) {
                            if (node.isConstantNode && node.valueType === 'string') {
                                throw 'String constants are not valid';
                            }
                            if (node.isSymbolNode) {
                                switch (node.name.toLowerCase()) {
                                    case 'true':
                                    case 'false':
                                        throw 'Boolean constants are not valid';
                                }
                                switch (node.name.toLowerCase()) {
                                    case 'e':
                                    case 'pi':
                                        return;
                                }
                                nameSet.push(node.name);
                            }
                            if (node.isFunctionNode) {
                                console.log(node);
                                if (!(node.fn.name in functionMap) || functionMap[node.fn.name] !== node.args.length) {
                                    throw 'Unrecognized function "' + node.fn.name + '", or invalid number of arguments';
                                }
                            }
                        });
                        vm.nameSet = _.uniq(nameSet);
                        if (vm.nameSet.length === 0) {
                            throw 'Your expression requires at least one variable';
                        }
                        vm.currentError = '';
                        return true;
                    } catch (error) {
                        vm.currentError = error;
                        return false;
                    }
                }
                
                $scope.$watch('vm.mapping', function () {
                    vm.isMappingValid = processMapping();
                }, true);
                
                function processMapping() {
                    vm.mapping = _.pickBy(vm.mapping, function (map, name) {
                            return _.includes(vm.nameSet, name);
                        });
                    _.forEach(vm.mapping, function (map) {
                        if (map.tagSource) {
                            map.tagWhereSet = [
                                $qb.where.equalTo('TagSourceId', $qb.as.int64(map.tagSource.Id)),
                            ];
                        }
                    });
                    var isValid = true;
                    vm.mvel = {
                        expression: getNode().toString(),
                        mapping: _.mapValues(vm.mapping, function (map, name) {
                            if (map.tag && map.tag.Id && map.aspect) {
                                return {
                                    tagId: map.tag.Id,
                                    aspect: map.aspect,
                                    ifNull: map.hasIfNull ? parseFloat(String(map.ifNull)) : null,
                                };
                            } else {
                                isValid = isValid && false;
                            }
                        }),
                    };
                    return isValid;
                }
                
                function getNode() {
                    return math.parse(vm.expression || '') || null;
                }
            },
        };
    });
    
})();
