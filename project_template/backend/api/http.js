/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////    DAVE 2.0 API
////    Written by: Paul Kazmir
////    Date: 2014-00-00
////    For documentation and exmaples see:  http://tf-davedev.comalc.com/DAVE2/API/
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



function httpCtrl($scope, $http, $window) {

    // LOGIN - save JWT to sesson Storage
    // todo 
    // - add user/password from token to all get/post/patch request headers via factory interceptor.push('authInterceptor')
    $scope.requestlogin = function () {
        $scope.url = 'back-end/login.php';
        $scope.user = {username: 'paul.kazmir', password: 'password'};
        $scope.agent = 'login';
        $scope.reqtype = 'get';
        $scope.message = ''
      
        $http.post($scope.url, {"agent" : $scope.agent, "credentials" : $scope.user}).
        success(function (data, status, headers, config) {
            $window.sessionStorage.token = data.token;
            $scope.message = 'Welcome to DAVE v2';
          }).
        error(function (data, status, headers, config) {
            // Erase the token if the user fails to log in
            delete $window.sessionStorage.token;
            // Handle login errors here
            $scope.message = 'Error: Invalid user or password';
          });
      };

    // ITEM-LIST - use this for grabbing item lists
    $scope.requestItemList = function($url) {
        $scope.url = 'back-end/itemsellist.php';
        $scope.agent = 'item-list';
        $scope.reqtype = 'get';
        
        
        $http.post($scope.url, {"agent" : $scope.agent, "reqtype" : $scope.reqtype, "view" : $scope.view}).
        success(function(data, status) {
            $scope.status = status;
            $scope.data = data;
            $scope.result = data;
            $scope.list = data;               // - will remove after testing
        }).
        error(function(data, status) {
            $scope.data = data || "Request failed";
            $scope.status = status;         
        });
    };


    // ITEM-META - use this for grabbing item related information
    $scope.requestItemMeta = function($url) {
        $scope.url = 'back-end/getItem.php';
        $scope.agent = 'item-meta';
        $scope.reqtype = 'get'
        
        $http.post($scope.url, {"agent" : $scope.agent, "reqtype" : $scope.reqtype, "item_id" : $scope.item_id, "exp" : $scope.exp, "seq": $scope.seq}).
        //$http.post($scope.url, { "ito" : [{"agent" : $scope.agent, "reqtype" : $scope.reqtype}], "r" : [{"item_id" : $scope.item_id, "exp" : $scope.exp, "seq" : $scope.seq}]}).
        success(function(data, status) {
            $scope.status = status;
            $scope.data = data;
            $scope.result = data;               // - will remove after testing
            $scope.item = data.itm.item_id;     // - will remove after testing
        }).
        error(function(data, status) {
            $scope.data = data || "Request failed";
            $scope.status = status;         
        });
    };

}