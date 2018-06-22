'use strict';

angular.module('app')
    .controller('successController', [ '$rootScope', '$scope', '$http', '$state' , '$localStorage',
        function($rootScope, $scope, $http, $state, $localStorage) {
            $scope.loginOrNot=function(){
                $rootScope.logined=false;
                ($localStorage.userInfo)&&($rootScope.logined=true);
            }
            $scope.loginOrNot();
    } ]);