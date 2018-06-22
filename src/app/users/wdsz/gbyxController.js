'use strict';

angular.module('app')
	.controller('gbyxController', [ '$rootScope', '$scope', '$http', '$state',
		function($rootScope, $scope, $http, $state) {
			$rootScope.userOr = false;
			$scope.first = true;
			$scope.thirdSuc = false;
			$scope.codeErr = false;
			$scope.from={codes: '',send: false};
			$scope.next = function(){
				if(!$scope.from.codes){
					return $scope.codeErr = true;
				}else if($scope.first) {
					$scope.first = false;
                    $scope.from.send = false;
					$scope.codeErr = false;
					$scope.from.codes = '';
				}else {
					$scope.thirdSuc = true;
				}
			}
			$scope.pre = function(){
				$scope.first = true;
                $scope.from.send = false;
				$scope.codeErr = false;
				$scope.from.codes = '';
			}
	} ]);