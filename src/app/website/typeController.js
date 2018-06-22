'use strict';

angular.module('app')
    .controller('typeController', [ '$rootScope', '$scope', '$http', '$state' , '$localStorage',
        function($rootScope, $scope, $http, $state, $localStorage) {
            $scope.apply=function(){
                var msg = layer.msg('<div class="toaster"><span>此模块正在开发中，详情请咨询官方客服</span></div>', {
                    area: ['100%', '60px'],
                    time: 3000,
                    offset: 'b',
                    shadeClose: true,
                    shade: 0
                });
                $scope.loginOrNot=function(){
                    $rootScope.logined=false;
                    ($localStorage.userInfo)&&($rootScope.logined=true);
                }
                $scope.loginOrNot();
            }
    } ]);