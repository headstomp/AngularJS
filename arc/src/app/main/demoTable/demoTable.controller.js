(function () {
    angular.module('app.demoTable')
        .controller('demoTableController', demoTableController);

    function demoTableController(TagData, $scope) {

        var vm = this;
        vm.aspectMap = {
            'Date': 'DateTime',
            'Totalizer': 'Totalizer',
            'Last': 'LastValue',
            'Min': 'Minimum',
            'Max': 'Maximum',
            'Wavg': 'WeightedAverage',
            'Var': 'Variance',
            'StD': 'StandardDeviation',
            'Cnt': 'Count',
            'Tot': 'Total',
        };
        //  console.log(TagData);
        vm.data = TagData;
        vm.tagData = vm.data[4];
        //  console.log(vm.tagData);

        vm.user = "sid";
        var aspects = ['Date', 'Totalizer', 'Last', 'Min', 'Max', 'Wavg', 'Var', 'StD', 'Cnt', 'Tot'];
        var aspects2 = ['Date', 'Last', 'Min', 'Max', 'Wavg', 'Var', 'StD', 'Cnt', 'Tot'];
        vm.aspects = aspects;
        vm.dataMap = [];
        var temp = {};
        angular.forEach(vm.tagData, function (tag, date) {

            if (date == '$type') {
                return;
            }
            else {
                angular.forEach(tag, function (tagObj, index) {


                    for (var i = 0; i < vm.aspects.length; i++) {
                        //  console.log(tagObj[vm.aspectMap[vm.aspects[i]]])
                        temp[vm.aspectMap[vm.aspects[i]]] = tagObj[vm.aspectMap[vm.aspects[i]]];

                    }

                    vm.dataMap.push(temp);
                    temp = {};
                });

            }

        });


        vm.removeTotalizer = removeTotalizer;
        var isTotalizer = true;

        function removeTotalizer() {
            vm.dataMap = [];
            //  console.log('removed');
            if (!isTotalizer) {
                vm.aspects = aspects;
                var temp = {};
                angular.forEach(vm.tagData, function (tag, date) {

                    if (date == '$type') {
                        return;
                    }
                    else {
                        angular.forEach(tag, function (tagObj, index) {


                            for (var i = 0; i < vm.aspects.length; i++) {
                                //  console.log(tagObj[vm.aspectMap[vm.aspects[i]]])
                                temp[vm.aspectMap[vm.aspects[i]]] = tagObj[vm.aspectMap[vm.aspects[i]]];

                            }

                            vm.dataMap.push(temp);
                            temp = {};
                        });

                    }

                });





                isTotalizer = true;

            }
            else {
                vm.dataMap = [];
                vm.aspects = aspects2;
                var temp = {};
                angular.forEach(vm.tagData, function (tag, date) {

                    if (date == '$type') {
                        return;
                    }
                    else {
                        angular.forEach(tag, function (tagObj, index) {


                            for (var i = 0; i < vm.aspects.length; i++) {
                                //  console.log(tagObj[vm.aspectMap[vm.aspects[i]]])
                                temp[vm.aspectMap[vm.aspects[i]]] = tagObj[vm.aspectMap[vm.aspects[i]]];

                            }

                            vm.dataMap.push(temp);
                            temp = {};
                        });

                    }

                });

                isTotalizer = false;
            }
        }

        //console.log(vm.aspects);
        //  console.log(vm.data);

        //  vm.aspects = vm.options.aspects;

        //console.log(vm.tagData);


        //  console.log(vm.dataMap);





    }
})();

//javascript:(function(){alert($('input[type="password"]'))}())
