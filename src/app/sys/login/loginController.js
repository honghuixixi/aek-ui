'use strict';
angular.module('app')
    .controller('loginController',[ '$rootScope', '$scope', '$http', '$state', '$localStorage', function($rootScope, $scope, $http, $state) {
        $scope.user = {};
        $scope.login = function () {
            $state.go('main.tre.ytz.list');
            // $.ajax({
            //     url : '/sys/index/login',
            //     data:  $scope.user,
            //     type: 'get'
            // }).then(function(result) {
            //     console.log(result);
            //     if (result.code == 0) {
            //         //$state.go('main.users.zzjg.tjzjg');
            //         //预台账
            //         $state.go('main.tre.ytz.list');
            //     } else {
            //         $scope.msg = result.msg;
            //         $rootScope.$apply();   //检测modle
            //     }
            // });
        }
    } ]);
