'use strict';

angular.module('app')

.controller('repairMsgCenterController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage) {
	$rootScope.currentmodule = "消息中心";

	$scope.statusType = [{
		id: '',
		name: '全部'
	},{
		id: 0,
		name: '未读'
	}];
	$scope.typeList = false;
	$scope.timeModel = $scope.statusType[0];
	$scope.overNum = false,//判断是否超过100条数据的样式变量
	$scope.allshow = true,//标记已读未读

	$scope.option = function(list, value, item) {
        $rootScope.fixWrapShow = false;
        $scope[list] = false;
        $scope[value] = item;
        $scope.searchMsg(1,8,item.id);
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

		$scope.typeList = false;
	}
	
	// onloading
	$scope.onloading = false;
	// oncontent
	$scope.nocontent = false;
	// 全部消息
	// loadingMore
	$scope.loadingMore = false;
	$scope.msgData = [];
	$scope.msgStatus = 0;
	$scope.pagination = function (page,pageSize) {
		$scope.searchMsg(page,pageSize,$scope.timeModel.id);
	};
	$scope.repairMsgStatus=function(a){
		$state.go('info.things',{status:a,tenantId:$stateParams.tenantId},{reload:true});
	}
	// 根据实施ID获取计划ID
	$scope.getPlanId=function(a){
		$.ajax({
			type: 'get',
			url: '/qc/qcImplement/getPlanId/'+a.moduleId,
			complete: function(res) {
				if(res.responseJSON.code == 200) {
					$state.go(a.url,{tenantId:($stateParams.tenantId||$localStorage.userInfo.tenantId),id:a.moduleId,planId:res.responseJSON.data});
				}else{
					var msg = layer.msg('<div class="toaster"><span>' + res.responseJSON.msg + '</span></div>', {
	                    area: ['100%', '60px'],
	                    time: 3000,
	                    offset: 'b',
	                    shadeClose: true,
	                    shade: 0
	                });
				}
			}
		});
	}
	// 代办/消息/公告 验证
    $scope.adjustMsg=function(a,b){
    	$.ajax({
			type: 'get',
			url:'/sys/user/checkAll',
			data: {
				tab: a,
				permissionId: b.status
			},
			complete: function(res){
				if(res.responseJSON.code == 200) {
					var url;
					if(a==2) {
						function fun(){
							var obj = {
								tenantId:($stateParams.tenantId||$localStorage.userInfo.tenantId)
							};
							(b.status==1)&&(obj.applyId=b.moduleId)&&(obj.status=4);
							(b.status==2)&&(obj.billApplyId=b.moduleId);
							(b.status==3)&&(obj.planId=b.moduleId);
							if(b.status==4){
								return $scope.getPlanId(b);
							}
							(b.status==5)&&(obj.id=b.moduleId);
							(b.status==6)&&(obj.id=b.moduleId);
							(b.status==7)&&(obj.billId=b.moduleId);
							(b.status==8)&&(obj.billId=b.moduleId);
							(b.status==9)&&(obj.id=b.moduleId);
							$state.go(b.url,obj);
						}
						if(b.messageStatus)
							return fun();
						$.ajax({
							type: 'get',
							url:'/newrepair/repMessageReceive/read/'+b.id,
							complete: function(res){
								if(res.responseJSON.code == 200) {
									fun();
								}else{
									var msg = layer.msg('<div class="toaster"><span>' + res.responseJSON.msg + '</span></div>', {
					                    area: ['100%', '60px'],
					                    time: 3000,
					                    offset: 'b',
					                    shadeClose: true,
					                    shade: 0
					                });
								}
							}
						});
					}else{
						$state.go(b.url,{status:b.cs,tenantId:($stateParams.tenantId||$localStorage.userInfo.tenantId)});
					}
				}else{
					var msg = layer.msg('<div class="toaster"><span>' + res.responseJSON.msg + '</span></div>', {
	                    area: ['100%', '60px'],
	                    time: 3000,
	                    offset: 'b',
	                    shadeClose: true,
	                    shade: 0
	                });
	                if(res.responseJSON.code == 202){
		                setTimeout(function(){
		                	// 跳转登录页
		                	$localStorage.$reset();
							$state.go('access.login',null,{reload: true});
		                },3000);
	                }
				}
				$rootScope.$apply();
			}
		});
	}
	$scope.searchMsg = function(page,pageSize,a){
		$scope.nocontent = false;
		$scope.onloading = true;
		var data = {
			pageNo: page||1,
			pageSize: pageSize||8,
			messageStatus: a,
			isAsc: false,
			orderByField: 'message_time'
		};
		$.ajax({
			type: 'get',
			url: '/newrepair/repMessageReceive/search',
			data: data,
			complete: function(res) {
				$scope.onloading = false;
				$scope.nocontent=false;
				if(res.responseJSON.code == 200) {
					$scope.msgData=res.responseJSON.data.records;
	                if(!res.responseJSON.data.records||!$scope.msgData.length){
	                	$scope.nocontent=true;
	                }
	                $scope.pageInfo=res.responseJSON.data;
	                $scope.pageInfo.pstyle = 2;
				}else{
					$scope.nocontent = true;
					$scope.msgData=[];
					var msg = layer.msg('<div class="toaster"><span>' + res.responseJSON.msg + '</span></div>', {
	                    area: ['100%', '60px'],
	                    time: 3000,
	                    offset: 'b',
	                    shadeClose: true,
	                    shade: 0
	                });
				}
				$rootScope.$apply();
			}
		});
	}
	$scope.readAllMsg=function(){
    	$.ajax({
			type: 'get',
			url:'/newrepair/repMessageReceive/readAll',
			complete: function(res){
				if(res.responseJSON.code == 200) {
					$.ajax({
						type: 'get',
						url: '/newrepair/repMessageReceive/search',
						data: {
							pageNo: 1,
							pageSize: 8,
							messageStatus: '',
							isAsc: false,
							orderByField: 'message_time'
						},
						complete: function(res) {
							$scope.onloading = false;
							$scope.nocontent=false;
							if(res.responseJSON.code == 200) {
								$scope.msgData=res.responseJSON.data.records;
				                if(!res.responseJSON.data.records||!$scope.msgData.length){
				                	$scope.nocontent=true;
				                }
				                $scope.pageInfo=res.responseJSON.data;
							}else{
								$scope.nocontent = true;
								$scope.msgData=[];
							}
							$rootScope.$apply();
						}
					});
				}else{
					var msg = layer.msg('<div class="toaster"><span>' + res.responseJSON.msg + '</span></div>', {
	                    area: ['100%', '60px'],
	                    time: 3000,
	                    offset: 'b',
	                    shadeClose: true,
	                    shade: 0
	                });
				}
			}
		});
    }
    $scope.waitDoTxtList=[{
    	title: '维修管理-待接单',
    	des: '个维修单需要接单',
    	moduleId: 5,
    	module: '维修管理'
    }, {
    	title: '维修管理-维修中',
    	des: '个维修单需要维修',
    	moduleId: 5,
    	module: '维修管理'
    }, {
    	title: '维修管理-待验收',
    	des: '个维修单需要验收',
    	moduleId: 5,
    	module: '维修管理'
    }, {
    	title: '维修管理-单据审批',
    	des: '条维修单据需要审批',
    	moduleId: 5,
    	module: '维修管理'
    }, {
    	title: '巡检管理-待巡检',
    	des: '条巡检计划需要巡检',
    	moduleId: 6,
    	module: '巡检管理'
    }, {
    	title: 'PM管理-待实施',
    	des: '条PM实施需要实施',
    	moduleId: 7,
    	module: 'PM管理'
    }, {
    	title: '转科管理-待审核',
    	des: '条转科单需要审核',
    	moduleId: 4,
    	module: '资产管理'
    }, {
    	title: '报损管理-待审核',
    	des: '条报损单需要审核',
    	moduleId: 4,
    	module: '资产管理'
	}, {
		title: '巡检管理-待验收',
		des: '条报告单需要验收',
		moduleId: 6,
		module: '巡检管理'
	}, {
		title: 'PM管理-待验收',
		des: '条报告单需要验收',
		moduleId: 7,
		module: 'PM管理'
	}, {
		title: '质控管理-待审核',
		des: '条质控申报单需要审核',
		moduleId: 15,
		module: '质控管理'
	}];	
	$scope.searchMsgStatus=function(){
		$scope.nocontent = false;
		$scope.onloading = true;
		$scope.waitDoList=[];
		$.ajax({
			type: 'get',
			url:'/newrepair/repRepairApply/waitToDo',
			complete: function(res){
				if(res.responseJSON.code == 200) {
					$scope.waitDoList=[];
					for (var i = 0; i < res.responseJSON.data.length; i++) {
						$scope.waitDoList.push($.extend($scope.waitDoTxtList[res.responseJSON.data[i].status-1],res.responseJSON.data[i]));
					};
				}else{
					var msg = layer.msg('<div class="toaster"><span>' + res.responseJSON.msg + '</span></div>', {
	                    area: ['100%', '60px'],
	                    time: 3000,
	                    offset: 'b',
	                    shadeClose: true,
	                    shade: 0
	                });
				}
				$rootScope.$apply();
			}
		});
	}
	
	$scope.statusDataGet=function(){
		($stateParams.status==1)&&$scope.searchMsg(1,8,'');
		($stateParams.status==0)&&$scope.searchMsgStatus();
	}
	$scope.statusDataGet();
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
			url: '/newrepair/repMessageReceive/read/'+a.id,
			complete: function(res) {
				var url = $state.href('repair.identify', {
					assetsId:a.assetsId,applyid:a.applyId,
					tenantId:$stateParams.tenantId||$localStorage.userInfo.tenantId
				});
				(res.responseJSON.code==200)&&window.open(url, '_blank');
			}
		});
	}
	// 分页
	$scope.page = function(){
		$scope.order();
		$scope.status();
		$scope.searchFour=$scope.baifenhao($scope.searchKey.searchFour);
		$scope.searchCon=$scope.baifenhao($scope.searchKey.searchCon);
		$.ajax({
			type: "get",
			url: "/repairnew/apply/search",
			data: {'status': $scope.searchOne.status, 'urgentLevel': $scope.urgentLevel,'assetsDeptName':$scope.searchFour,'orderByField':$scope.orderByField,'isAsc':false,'assetsName':$scope.searchFive,'pageSize':$scope.pageSize,'pageNo':$scope.pageNo,'tenantId':($stateParams.tenantId||$localStorage.userInfo.tenantId)},
			complete: function (res) {
				if(res.responseJSON.code == 200){
					var resData = res.responseJSON.data;
					$scope.pageInfo = res.responseJSON.data;
					$scope.pageInfo.pstyle = 2;
					$scope.allInfo = $scope.pageInfo.total;
					$scope.msgList = resData.records;
					for(var i = 0; i < $scope.msgList.length; i++) {
						$scope.msgList[i].json = JSON.stringify($scope.msgList[i]);
					};
					$rootScope.$apply();
				}
			}
		})
	}
	// 返回上一页
	$scope.repairBack = function(){
		$.ajax({
            url: '/newrepair/repMessageReceive/find',
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
//未读消息数量
	$rootScope.mf_hotIconMsg = false;
				$.ajax({
					url: '/newrepair/repMessageReceive/find',
					type: 'get',
					complete: function(res) {
						if(res.responseJSON) {
							if(res.responseJSON.code==200){
								$rootScope.unreadMsg = res.responseJSON.data;
								$rootScope.unreadMsg>99?$rootScope.mf_hotIconMsg = true:($rootScope.unreadMsg==0?$rootScope.unreadMsg=null:1);
							}
						}
					}
				});
//消息数量过滤方法
$scope.msgNum = function(a){
	if(a>=100){
		$scope.overNum = true;
		return '99+'
	}else{
		$scope.overNum = false;
		return a
	}
}
//点击全部标记为已读
// $scope.deleteAll=function(c){
    
// }
$scope.deleteAll=function() {
	$scope.allshow=!$scope.allshow;
 }
}]);