'use strict';

angular.module('app')

.controller('repairMsgController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage) {
	$rootScope.currentmodule = "平台首页";

	$scope.optionType = [{moduleId:5,name:'全部类型'}];
	if($localStorage.userInfo.modules.length)
	$scope.optionType=$scope.optionType.concat($localStorage.userInfo.modules);
	$scope.optionTime = [{
		id: '',
		name: '全部时间'
	},{
		id: 1,
		name: '最近七天'
	}, {
		id: 2,
		name: '最近一个月'
	}, {
		id: 3,
		name: '最近三个月'
	}];
	$scope.typeList = false;
	$scope.timeList = false;
	$scope.timeModel = $scope.optionTime[0];
	$scope.typeModel = $scope.optionType[0];
	$scope.assetsDeptName = "";
	$scope.assetsName = '';
	$scope.option = function(list, value, item) {
        $rootScope.fixWrapShow = false;
        $scope[list] = false;
        $scope[value] = item;
        $scope.searchMsg();
    }
	$scope.listShow = function(str) {
		if($rootScope.fixWrapShow)
			return $scope.menuHide();
		$scope[str] = true;
		$rootScope.fixWrapShow = true;
	}
	$rootScope.fixWrapShow = false;
	$scope.menuHide = function() {
		$rootScope.fixWrapShow = false;

		$scope.timeList = false;
		$scope.typeList = false;
	}
	
	// onloading
	$scope.onloading = false;
	// oncontent
	$scope.nocontent = false;
	// 全部消息
	// 未读/全部 消息
	$scope.messageStatus = false;
	// loadingMore
	$scope.loadingMore = false;
	$scope.repairMsgPageNo = 1;
	$scope.msgData = [];
	$scope.msgStatus = 0;
	$scope.searchMsg = function(a,b){
		if($scope.typeModel.moduleId!=5){
			$scope.nocontent=true;
			$scope.loadingMore = false;
			return $scope.msgData = [];
		}
		if(a==1){
			$scope.messageStatus=true;
			$scope.msgStatus=null;
		}else if(a==0){
			$scope.messageStatus=false;
			$scope.msgStatus=0;
		}
		if(b){
			$scope.repairMsgPageNo++;
		}else{
			$scope.repairMsgPageNo=1;
			$scope.msgData = [];
		}
		$scope.loadingMore = false;
		$scope.nocontent = false;
		$scope.onloading = true;
		var data = {
			pageNo: $scope.repairMsgPageNo,
			pageSize: 10,
			messageStatus: $scope.msgStatus,
			messageLevel: null,
			// assetsDeptName: null,
			// assetsName: null,
			time: $scope.timeModel.id,
			isAsc: false,
			orderByField: 'message_time'
		};
		$.ajax({
			type: 'get',
			url: '/repair/repMessageReceive/search',
			data: data,
			complete: function(res) {
				$scope.onloading = false;
				$scope.loadingMore = true;
				$scope.nocontent=false;
				if(res.responseJSON.code == 200) {
					if(b){
						$scope.msgData=$scope.msgData.concat(res.responseJSON.data.records);
					}else{
						$scope.msgData=res.responseJSON.data.records;
					}
	                if(!res.responseJSON.data.records||!$scope.msgData.length){
	                	$scope.nocontent=true;
	                }
	                if(res.responseJSON.data.total==$scope.msgData.length){
	               		$scope.loadingMore = false;
	                }
				}else{
					$scope.loadingMore = false;
				}
				$rootScope.$apply();
			}
		});
	}
	$scope.searchMsg(0);
	// onscroll
	// window.onscroll=function(e){
	// 	console.log(e);
	// }
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
				return "不知道";
				break;
		}
	}
	// 查看指定消息
	$scope.lookTheRepairMsgDetail=function(a){
		$localStorage.repairMsg=a;
		$.ajax({
			type: 'get',
			url: '/repair/repMessageReceive/read',
			data: {messageid:a.id},
			complete: function(res) {
				var url = $state.href('repair.identify', {
					assetsId:a.assetsId,applyid:a.applyId,
					tenantId:$stateParams.tenantId||$localStorage.userInfo.tenantId
				});
				(res.responseJSON.code==200)&&window.open(url, '_blank');
			}
		});
	}
	// 返回上一页
	$scope.repairBack = function(){
		$.ajax({
            url: '/repair/repMessageReceive/find',
            type: 'get',
            complete: function(res) {
                if(res.responseJSON) {
                    if(res.responseJSON.code==200){
                        $rootScope.unreadMsg = res.responseJSON.data;
                        $rootScope.unreadMsg>9?$rootScope.repairMsgEven = true:($rootScope.unreadMsg==0?$rootScope.unreadMsg=null:1);
                    }
                }
                history.back();
            }
        });
	}
}]);