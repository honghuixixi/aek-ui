'use strict';

angular.module('app')

.controller('repairDateController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage) {
	$rootScope.currentmodule = "维修管理";

	$scope.nocontent = false;
	$scope.repairTable = [];
	var height = window.innerHeight||document.body.clientHeight;
	angular.element('.fy_repairDate').css('min-height',height-312+'px');
	angular.element('.fy_repairDateNoContent').css('height',height-312+'px');
	angular.element('.fy_repairDateNoContent span').css('line-height',height-312+'px');
	$rootScope.repairCalendar=function(){
		$.ajax({
			type: 'get',
			url: '/repair/apply/getApplyByTime',
			data: {year:$rootScope.repairDate.year,month:$rootScope.repairDate.month,tenantId:$stateParams.tenantId||$localStorage.userInfo.tenantId},
			complete: function(res) {
				if(res.responseJSON.code == 200) {
	                $scope.repairTable = res.responseJSON.data.list;
	                $scope.nocontent = false;
	                if(!$scope.repairTable.length){
	                	$scope.nocontent=true;
	                }
				}
				$rootScope.$apply();
			}
		});
	}
	$rootScope.repairCalendar();
	// 消息紧急程度
	$scope.msgLevel=function(a){
		switch (a){
			case 1:
				return "不紧急";
				break;
			case 2:
				return "一般";
				break;
			case 3:
				return "紧急";
				break;
			case 4:
				return "非常紧急";
				break;
			default:
				return "";
				break;
		}
	}
	// 消息状态
	$scope.repairCalendarStatus = function(a){
		switch (a){
			case 1:
				return "待故障判定";
				break;
			case 2:
				return "现场解决";
				break;
			case 3:
				return "待维修";
				break;
			case 4:
				return "以维修待验收";
				break;
			case 5:
				return "已完成";
				break;
			case 6:
				return "验收不通过";
				break;
			default:
				return "";
				break;
		}
	}
}]);