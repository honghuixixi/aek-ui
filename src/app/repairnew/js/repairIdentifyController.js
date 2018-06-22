'use strict';

angular.module('app')

.controller('repairnewIdentifyController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage) {

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
		url: '/repair/apply/total/'+($stateParams.tenantId||$localStorage.userInfo.tenantId),
		complete: function(res) {
			$scope.status=res.responseJSON.data;
		}
	});
	$scope.repairManage=function(a){
		$state.go('repair.manage',{status:a});
	}


	$scope.initcalendar = function() {
        var option = {
            format: 'YYYY-MM-DD HH:mm',
            startDate: '2017-01-01 ',
            endDate: new Date(),
            timePicker:true,
            // minDate:new Date(new Date()-24*60*60*1000),
            maxDate: new Date("2050-01-01"),
            timePicker12Hour:false,
            //timePicker: false,
            opens: "top",
            singleDatePicker: true
        }
        angular.element('.input-datepicker').daterangepicker($.extend({}, option, {
            startDate: new Date()
        }), function(date, enddate, el) {
        	
        });
    }
    $scope.initcalendar();
}]);

//TAB菜单功能
   

       