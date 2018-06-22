'use strict';

angular.module('app')

.controller('repairIndexController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage) {


	$rootScope.repairDate = function(){
		var date = new Date();
		return {
			year: date.getFullYear(),
			month: date.getMonth()+1
		};
	}()
	$scope.repairDateChange=function(a){
		$rootScope.repairDate.month+=a;
		if($rootScope.repairDate.month>12){
			$rootScope.repairDate.month=1,
			$rootScope.repairDate.year=$rootScope.repairDate.year+1;
		}else if($rootScope.repairDate.month<1){
			$rootScope.repairDate.month=12,
			$rootScope.repairDate.year=$rootScope.repairDate.year-1;
		}
		$rootScope.repairCalendar();
	}
	// 不同状态消息数量
	$scope.status=[];
	$.ajax({
		type: 'get',
		url: '/newrepair/repRepairApply/total/'+($stateParams.tenantId||$localStorage.userInfo.tenantId),
		complete: function(res) {
			$scope.status=res.responseJSON.data;
		}
	});
	$scope.repairManage=function(a){
		$state.go('repair.manage',{status:a,tenantId:$stateParams.tenantId||$localStorage.userInfo.tenantId});
	}
}]);