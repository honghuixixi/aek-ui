'use strict';

angular.module('app')
	.controller('wjmmController', [ '$rootScope', '$scope', '$http', '$state',
		function($rootScope, $scope, $http, $state) {
			$rootScope.userOr = false;
			$scope.first = true;
			$scope.second = false;
			$scope.third = false;
			$scope.findSuc = false;
			$scope.from={codes: '',send: false,newCode: '',repeatCode: '',notRepeat: '两次密码输入不一致，请重新输入'};
			$scope.next = function(){
				if($scope.first) {
					$scope.first = false;
					$scope.second = true;
				}else if(!$scope.first&&!$scope.third) {
					$scope.third = true;
					$scope.second = false;
				}else if($scope.third) {
					$scope.third = false;
					$scope.findSuc = true;
					var timeout = setTimeout(function() {$state.go('access.login');}, 3000);
				}
			}
			$scope.pre = function () {
				if($scope.second) {
					$scope.first = true;
					$scope.second = false;
				}else if($scope.third) {
					$scope.second = true;
					$scope.third = false;
				}
			}
	} ]);