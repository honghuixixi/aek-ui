'use strict';

angular.module('app')
	.controller('menuController', [ '$rootScope', '$scope', '$http', '$state',
	                                function($rootScope, $scope, $http, $state) {
		$scope.title = '菜单管理';
        $scope.param = { };
        $scope.loading = false;

		$scope.search = function () {
	        $scope.loading = true;
			$.ajax({
				url : '/menu/read/list',
				data: $scope.param
			}).then(function(result) {
		        $scope.loading = false;
				if (result.httpCode == 200) {
					$scope.pageInfo = result.data;
				} else {
					$scope.msg = result.msg;
				}
				$scope.$apply();
			});
		}
		
		$scope.search();
		
		$scope.clearSearch = function() {
			$scope.param.keyword= null;
			$scope.search();
		}
		
		$scope.disableItem = function(id, enable) {
			
		}

		$scope.nextFn = function (page) {
            $scope.param.pageNum=page;
            $scope.search();
        }



		// 翻页

        $scope.pagination = function (page,pageSize) {
            $scope.param.pageNum=page;
            $scope.param.pageSize=pageSize;
            $scope.search();
        };
} ]);